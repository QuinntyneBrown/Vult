// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.Extensions.Logging;
using OpenAI.Chat;

namespace Vult.Core;

public class ProductIngestionService : IProductIngestionService
{
    private readonly IImageAnalysisService _imageAnalysisService;
    private readonly IVultContext _context;
    private readonly ILogger<ProductIngestionService> _logger;
    private readonly IAzureOpenAIService _azureOpenAIService;

    public ProductIngestionService(
        IImageAnalysisService azureAIService,
        IVultContext context,
        IAzureOpenAIService azureOpenAIService,
        ILogger<ProductIngestionService> logger)
    {
        _imageAnalysisService = azureAIService;
        _context = context;
        _logger = logger;
        _azureOpenAIService = azureOpenAIService;
    }

    public async Task<ProductIngestionResult> IngestAsync(byte[][] images, CancellationToken cancellationToken = default)
    {
        if (images == null || images.Length == 0)
        {
            var result = new ProductIngestionResult
            {
                Success = false,
                TotalProcessed = images?.Length ?? 0
            };
            result.Errors.Add("No images provided for ingestion");

            return result;
        }

        var ingestionResult = new ProductIngestionResult
        {
            TotalProcessed = images.Length
        };

        _logger.LogInformation("Starting ingestion of {Count} images", images.Length);

        var productsToCreate = new List<Product>();

        for (var i = 0; i < images.Length; i++)
        {
            try
            {
                var imageData = images[i];

                if (imageData == null || imageData.Length == 0)
                {
                    _logger.LogWarning("Skipping empty image at index {Index}", i);
                    ingestionResult.Errors.Add($"Image at index {i} is empty");
                    ingestionResult.Failed++;
                    continue;
                }

                _logger.LogInformation("Processing image {Index}/{Total}", i + 1, images.Length);

                var analysisResult = await _imageAnalysisService.AnalyzeAsync(imageData, cancellationToken);

                var messages = new List<ChatMessage>
                {
                    new SystemChatMessage("You are a used product retail expert. Base on the image analysis reults provide condition (Excellent/Good/Fair/Poor), estimated MSRP, estimated Value and description for selling the item to a retail customer that focuses on features of the item, benefits of the item and reason to buy the item now. Respond only with a JSON object in this exact format: {\"condition\": \"Good\", \"esimatedMSRP\": 0, \"esimatedValue\": 0, \"description\": \"buy it\"}"),
                    new UserChatMessage($"Analyze these vehicle images and provide the assessment. Image analysis results: {analysisResult.Description}")
                };

                var content = await _azureOpenAIService.CompleteChatAsync(messages, cancellationToken);

                if (!analysisResult.Success)
                {
                    _logger.LogError("Failed to analyze image {Index}: {Error}", i, analysisResult.ErrorMessage);
                    ingestionResult.Errors.Add($"Image {i}: {analysisResult.ErrorMessage}");
                    ingestionResult.Failed++;
                    continue;
                }

                var product = new Product
                {
                    ProductId = Guid.NewGuid(),
                    EstimatedMSRP = analysisResult.EstimatedMSRP,
                    EstimatedResaleValue = analysisResult.EstimatedResaleValue,
                    Description = analysisResult.Description,
                    Size = analysisResult.Size,
                    BrandName = analysisResult.BrandName,
                    Gender = analysisResult.Gender,
                    ItemType = analysisResult.ItemType,
                    CreatedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow
                };

                // Create product image
                var productImage = new ProductImage
                {
                    ProductImageId = Guid.NewGuid(),
                    ProductId = product.ProductId,
                    ImageData = imageData,
                    Description = analysisResult.ImageDescription,
                    CreatedDate = DateTime.UtcNow
                };

                product.ProductImages.Add(productImage);
                productsToCreate.Add(product);

                ingestionResult.SuccessfullyProcessed++;
                _logger.LogInformation("Successfully processed image {Index}: {Brand} {ItemType}", i, product.BrandName, product.ItemType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error processing image {Index}", i);
                ingestionResult.Errors.Add($"Image {i}: Unexpected error - {ex.Message}");
                ingestionResult.Failed++;
            }
        }

        // Save all products to database
        if (productsToCreate.Any())
        {
            try
            {
                foreach (var item in productsToCreate)
                {
                    _context.Products.Add(item);
                }

                await _context.SaveChangesAsync(cancellationToken);

                ingestionResult.Products.AddRange(productsToCreate);
                ingestionResult.Success = true;

                _logger.LogInformation(
                    "Ingestion completed. Total: {Total}, Success: {Success}, Failed: {Failed}",
                    ingestionResult.TotalProcessed,
                    ingestionResult.SuccessfullyProcessed,
                    ingestionResult.Failed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save products to database");
                ingestionResult.Success = false;
                ingestionResult.Errors.Add($"Database error: {ex.Message}");
                return ingestionResult;
            }
        }
        else
        {
            ingestionResult.Success = false;
            ingestionResult.Errors.Add("No images were successfully processed");
        }

        return ingestionResult;
    }
}
