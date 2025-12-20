// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.Extensions.Logging;
using OpenAI.Chat;

namespace Vult.Core;

public class CatalogItemIngestionService : ICatalogItemIngestionService
{
    private readonly IImageAnalysisService _imageAnalysisService;
    private readonly IVultContext _context;
    private readonly ILogger<CatalogItemIngestionService> _logger;
    private readonly IAzureOpenAIService _azureOpenAIService;

    public CatalogItemIngestionService(
        IImageAnalysisService azureAIService,
        IVultContext context,
        IAzureOpenAIService azureOpenAIService,
        ILogger<CatalogItemIngestionService> logger)
    {
        _imageAnalysisService = azureAIService;
        _context = context;
        _logger = logger;
        _azureOpenAIService = azureOpenAIService;
    }

    public async Task<CatalogItemIngestionResult> IngestAsync(byte[][] images, CancellationToken cancellationToken = default)
    {        
        if (images == null || images.Length == 0)
        {
            var result = new CatalogItemIngestionResult
            {
                Success = false,
                TotalProcessed = images?.Length ?? 0
            };
            result.Errors.Add("No images provided for ingestion");

            return result;
        }

        var ingestionResult = new CatalogItemIngestionResult
        {
            TotalProcessed = images.Length
        };

        _logger.LogInformation("Starting ingestion of {Count} images", images.Length);

        var catalogItemsToCreate = new List<CatalogItem>();

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

                var catalogItem = new CatalogItem
                {
                    CatalogItemId = Guid.NewGuid(),
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

                // Create catalog item image
                var catalogItemImage = new CatalogItemImage
                {
                    CatalogItemImageId = Guid.NewGuid(),
                    CatalogItemId = catalogItem.CatalogItemId,
                    ImageData = imageData,
                    Description = analysisResult.ImageDescription,
                    CreatedDate = DateTime.UtcNow
                };

                catalogItem.CatalogItemImages.Add(catalogItemImage);
                catalogItemsToCreate.Add(catalogItem);

                ingestionResult.SuccessfullyProcessed++;
                _logger.LogInformation("Successfully processed image {Index}: {Brand} {ItemType}", i, catalogItem.BrandName, catalogItem.ItemType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error processing image {Index}", i);
                ingestionResult.Errors.Add($"Image {i}: Unexpected error - {ex.Message}");
                ingestionResult.Failed++;
            }
        }

        // Save all catalog items to database
        if (catalogItemsToCreate.Any())
        {
            try
            {
                foreach (var item in catalogItemsToCreate)
                {
                    _context.CatalogItems.Add(item);
                }

                await _context.SaveChangesAsync(cancellationToken);
                
                ingestionResult.CatalogItems.AddRange(catalogItemsToCreate);
                ingestionResult.Success = true;
                
                _logger.LogInformation(
                    "Ingestion completed. Total: {Total}, Success: {Success}, Failed: {Failed}",
                    ingestionResult.TotalProcessed,
                    ingestionResult.SuccessfullyProcessed,
                    ingestionResult.Failed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save catalog items to database");
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
