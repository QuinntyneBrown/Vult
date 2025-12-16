// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Azure;
using Azure.AI.Vision.ImageAnalysis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Vult.Core.Enums;
using Vult.Core.Interfaces;
using Vult.Core.Models;

namespace Vult.Infrastructure.Services;

public class AzureAIService : IAzureAIService
{
    private readonly ImageAnalysisClient _client;
    private readonly ILogger<AzureAIService> _logger;
    private readonly int _maxRetries;
    private readonly int _retryDelayMs;

    public AzureAIService(IConfiguration configuration, ILogger<AzureAIService> logger)
    {
        _logger = logger;
        
        var endpoint = configuration["AzureAI:Endpoint"] ?? throw new InvalidOperationException("AzureAI:Endpoint configuration is missing");
        var apiKey = configuration["AzureAI:ApiKey"] ?? throw new InvalidOperationException("AzureAI:ApiKey configuration is missing");
        
        _maxRetries = int.TryParse(configuration["AzureAI:MaxRetries"], out var retries) ? retries : 3;
        _retryDelayMs = int.TryParse(configuration["AzureAI:RetryDelayMs"], out var delay) ? delay : 1000;
        
        _client = new ImageAnalysisClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
    }

    public async Task<CatalogItemAnalysisResult> AnalyzeImageAsync(byte[] imageData, CancellationToken cancellationToken = default)
    {
        var result = new CatalogItemAnalysisResult();
        
        if (imageData == null || imageData.Length == 0)
        {
            result.Success = false;
            result.ErrorMessage = "Image data cannot be null or empty";
            return result;
        }

        var attempt = 0;
        while (attempt < _maxRetries)
        {
            try
            {
                attempt++;
                _logger.LogInformation("Analyzing image (attempt {Attempt}/{MaxRetries})", attempt, _maxRetries);

                var imageSource = BinaryData.FromBytes(imageData);
                
                var analysisResult = await _client.AnalyzeAsync(
                    imageSource,
                    VisualFeatures.Tags | VisualFeatures.Objects | VisualFeatures.Caption,
                    new ImageAnalysisOptions { GenderNeutralCaption = false },
                    cancellationToken);

                // Parse the Azure AI response and map to our domain model
                ParseAnalysisResult(analysisResult.Value, result);
                
                result.Success = true;
                _logger.LogInformation("Image analysis completed successfully");
                return result;
            }
            catch (RequestFailedException ex)
            {
                _logger.LogError(ex, "Azure AI request failed (attempt {Attempt}/{MaxRetries}): {Message}", attempt, _maxRetries, ex.Message);
                
                if (attempt >= _maxRetries)
                {
                    result.Success = false;
                    result.ErrorMessage = $"Azure AI request failed after {_maxRetries} attempts: {ex.Message}";
                    return result;
                }
                
                await Task.Delay(_retryDelayMs * attempt, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during image analysis: {Message}", ex.Message);
                result.Success = false;
                result.ErrorMessage = $"Unexpected error: {ex.Message}";
                return result;
            }
        }

        result.Success = false;
        result.ErrorMessage = "Failed to analyze image after maximum retries";
        return result;
    }

    private void ParseAnalysisResult(Azure.AI.Vision.ImageAnalysis.ImageAnalysisResult azureResult, CatalogItemAnalysisResult result)
    {
        // Extract caption/description
        if (azureResult.Caption != null)
        {
            result.ImageDescription = azureResult.Caption.Text;
            result.Description = GenerateResellerDescription(azureResult.Caption.Text);
        }

        // Extract brand, size, gender, and item type from tags and objects
        var tags = azureResult.Tags?.Values?.Select(t => t.Name.ToLowerInvariant()).ToList() ?? new List<string>();
        var detectedObjects = azureResult.Objects?.Values?
            .Select(o => o.Tags.FirstOrDefault()?.Name.ToLowerInvariant())
            .Where(n => !string.IsNullOrEmpty(n))
            .Select(n => n!)
            .ToList() ?? new List<string>();
        
        var allDetections = tags.Concat(detectedObjects).Distinct().ToList();

        // Detect item type
        result.ItemType = DetectItemType(allDetections);
        
        // Detect gender
        result.Gender = DetectGender(allDetections);
        
        // Extract brand (this is a simplified approach - in production, use a brand recognition model)
        result.BrandName = ExtractBrand(allDetections);
        
        // Extract size (this is a placeholder - in production, this would need OCR or specific size detection)
        result.Size = ExtractSize(allDetections);
        
        // Estimate pricing (simplified approach - in production, use historical data or specialized pricing model)
        result.EstimatedMSRP = EstimateMSRP(result.ItemType, result.BrandName);
        result.EstimatedResaleValue = result.EstimatedMSRP * 0.6m; // 60% of MSRP as default resale value
    }

    private string GenerateResellerDescription(string imageDescription)
    {
        // Generate a friendly reseller description based on the image caption
        // This is a simplified approach - in production, use GPT or similar for better descriptions
        return $"Great condition item! {imageDescription}. Perfect for resale with high demand. Don't miss this opportunity!";
    }

    private ItemType DetectItemType(List<string> detections)
    {
        if (detections.Any(d => d.Contains("shoe") || d.Contains("sneaker") || d.Contains("boot") || d.Contains("sandal")))
            return ItemType.Shoe;
        if (detections.Any(d => d.Contains("pant") || d.Contains("jeans") || d.Contains("trouser")))
            return ItemType.Pants;
        if (detections.Any(d => d.Contains("jacket") || d.Contains("blazer")))
            return ItemType.Jacket;
        if (detections.Any(d => d.Contains("shirt") || d.Contains("blouse") || d.Contains("top")))
            return ItemType.Shirt;
        if (detections.Any(d => d.Contains("short")))
            return ItemType.Shorts;
        if (detections.Any(d => d.Contains("dress")))
            return ItemType.Dress;
        if (detections.Any(d => d.Contains("skirt")))
            return ItemType.Skirt;
        if (detections.Any(d => d.Contains("sweater") || d.Contains("cardigan")))
            return ItemType.Sweater;
        if (detections.Any(d => d.Contains("hoodie") || d.Contains("sweatshirt")))
            return ItemType.Hoodie;
        if (detections.Any(d => d.Contains("coat") || d.Contains("overcoat")))
            return ItemType.Coat;
        
        return ItemType.Shirt; // Default
    }

    private Gender DetectGender(List<string> detections)
    {
        if (detections.Any(d => d.Contains("women") || d.Contains("ladies") || d.Contains("female")))
            return Gender.Womens;
        if (detections.Any(d => d.Contains("men") || d.Contains("male")))
            return Gender.Mens;
        
        return Gender.Unisex; // Default
    }

    private string ExtractBrand(List<string> detections)
    {
        // Common brand names to detect (simplified list)
        var brands = new[] { "nike", "adidas", "puma", "reebok", "under armour", "champion", "gap", "levi", "gucci", "prada" };
        
        foreach (var brand in brands)
        {
            if (detections.Any(d => d.Contains(brand)))
            {
                return brand.Split(' ').Select(w => char.ToUpper(w[0]) + w.Substring(1)).Aggregate((a, b) => a + " " + b);
            }
        }
        
        return "Generic Brand"; // Default when no brand detected
    }

    private string ExtractSize(List<string> detections)
    {
        // Size detection (simplified - would need OCR in production)
        var sizes = new[] { "xs", "small", "medium", "large", "xl", "xxl", "s", "m", "l" };
        
        foreach (var size in sizes)
        {
            if (detections.Any(d => d.Contains(size)))
            {
                return size.ToUpper();
            }
        }
        
        return "M"; // Default to medium
    }

    private decimal EstimateMSRP(ItemType itemType, string brandName)
    {
        // Simplified pricing logic - in production, use historical data or ML model
        var basePrice = itemType switch
        {
            ItemType.Shoe => 80m,
            ItemType.Jacket => 120m,
            ItemType.Coat => 150m,
            ItemType.Dress => 100m,
            ItemType.Pants => 70m,
            ItemType.Shirt => 50m,
            ItemType.Sweater => 60m,
            ItemType.Hoodie => 65m,
            ItemType.Skirt => 55m,
            ItemType.Shorts => 45m,
            _ => 50m
        };

        // Adjust for brand (simplified)
        var brandMultiplier = brandName.ToLower() switch
        {
            "nike" => 1.5m,
            "adidas" => 1.4m,
            "gucci" => 3.0m,
            "prada" => 3.5m,
            _ => 1.0m
        };

        return basePrice * brandMultiplier;
    }
}
