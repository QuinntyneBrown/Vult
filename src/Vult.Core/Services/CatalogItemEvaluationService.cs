// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Vult.Core;

public class CatalogItemEvaluationService : ICatalogItemEvaluationService
{
    private readonly IImageAnalysisService _azureAIService;
    private readonly IVultContext _context;
    private readonly ILogger<CatalogItemEvaluationService> _logger;

    public CatalogItemEvaluationService(
        IImageAnalysisService azureAIService,
        IVultContext context,
        ILogger<CatalogItemEvaluationService> logger)
    {
        _azureAIService = azureAIService;
        _context = context;
        _logger = logger;
    }

    public async Task<CatalogItemEvaluationResult> ReEvaluateItemAsync(Guid catalogItemId, CancellationToken cancellationToken = default)
    {
        var result = new CatalogItemEvaluationResult();

        try
        {
            // Load catalog item with images
            var catalogItem = await _context.CatalogItems
                .Include(x => x.CatalogItemImages)
                .FirstOrDefaultAsync(x => x.CatalogItemId == catalogItemId, cancellationToken);

            if (catalogItem == null)
            {
                result.Success = false;
                result.Errors.Add($"Catalog item with ID {catalogItemId} not found");
                return result;
            }

            if (!catalogItem.CatalogItemImages.Any())
            {
                result.Success = false;
                result.Errors.Add($"Catalog item {catalogItemId} has no images to re-evaluate");
                return result;
            }

            _logger.LogInformation("Re-evaluating catalog item {CatalogItemId}", catalogItemId);

            // Use the first image for re-evaluation (safely)
            var firstImage = catalogItem.CatalogItemImages.FirstOrDefault();
            if (firstImage == null)
            {
                result.Success = false;
                result.Errors.Add($"Catalog item {catalogItemId} has no images to re-evaluate");
                return result;
            }
            
            var analysisResult = await _azureAIService.AnalyzeAsync(firstImage.ImageData, cancellationToken);

            if (!analysisResult.Success)
            {
                result.Success = false;
                result.Errors.Add($"Failed to analyze image: {analysisResult.ErrorMessage}");
                return result;
            }

            // Update catalog item with new analysis
            catalogItem.EstimatedMSRP = analysisResult.EstimatedMSRP;
            catalogItem.EstimatedResaleValue = analysisResult.EstimatedResaleValue;
            catalogItem.Description = analysisResult.Description;
            catalogItem.Size = analysisResult.Size;
            catalogItem.BrandName = analysisResult.BrandName;
            catalogItem.Gender = analysisResult.Gender;
            catalogItem.ItemType = analysisResult.ItemType;
            catalogItem.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            result.Success = true;
            result.CatalogItem = catalogItem;

            _logger.LogInformation("Successfully re-evaluated catalog item {CatalogItemId}", catalogItemId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error re-evaluating catalog item {CatalogItemId}", catalogItemId);
            result.Success = false;
            result.Errors.Add($"Unexpected error: {ex.Message}");
        }

        return result;
    }

    public async Task<CatalogItemBatchEvaluationResult> ReEvaluateBatchAsync(Guid[] catalogItemIds, CancellationToken cancellationToken = default)
    {
        var result = new CatalogItemBatchEvaluationResult
        {
            TotalProcessed = catalogItemIds.Length
        };

        if (catalogItemIds == null || catalogItemIds.Length == 0)
        {
            result.Success = false;
            result.Errors.Add("No catalog item IDs provided");
            return result;
        }

        _logger.LogInformation("Starting batch re-evaluation of {Count} catalog items", catalogItemIds.Length);

        foreach (var catalogItemId in catalogItemIds)
        {
            try
            {
                var evaluationResult = await ReEvaluateItemAsync(catalogItemId, cancellationToken);

                if (evaluationResult.Success && evaluationResult.CatalogItem != null)
                {
                    result.CatalogItems.Add(evaluationResult.CatalogItem);
                    result.SuccessfullyProcessed++;
                }
                else
                {
                    result.Failed++;
                    result.Errors.AddRange(evaluationResult.Errors);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing catalog item {CatalogItemId}", catalogItemId);
                result.Failed++;
                result.Errors.Add($"Catalog item {catalogItemId}: Unexpected error - {ex.Message}");
            }
        }

        result.Success = result.SuccessfullyProcessed > 0;

        _logger.LogInformation(
            "Batch re-evaluation completed. Total: {Total}, Success: {Success}, Failed: {Failed}",
            result.TotalProcessed,
            result.SuccessfullyProcessed,
            result.Failed);

        return result;
    }
}
