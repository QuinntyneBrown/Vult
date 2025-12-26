// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Vult.Core;

public class ProductEvaluationService : IProductEvaluationService
{
    private readonly IImageAnalysisService _azureAIService;
    private readonly IVultContext _context;
    private readonly ILogger<ProductEvaluationService> _logger;

    public ProductEvaluationService(
        IImageAnalysisService azureAIService,
        IVultContext context,
        ILogger<ProductEvaluationService> logger)
    {
        _azureAIService = azureAIService;
        _context = context;
        _logger = logger;
    }

    public async Task<ProductEvaluationResult> ReEvaluateItemAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        var result = new ProductEvaluationResult();

        try
        {
            // Load product with images
            var product = await _context.Products
                .Include(x => x.ProductImages)
                .FirstOrDefaultAsync(x => x.ProductId == productId, cancellationToken);

            if (product == null)
            {
                result.Success = false;
                result.Errors.Add($"Product with ID {productId} not found");
                return result;
            }

            if (!product.ProductImages.Any())
            {
                result.Success = false;
                result.Errors.Add($"Product {productId} has no images to re-evaluate");
                return result;
            }

            _logger.LogInformation("Re-evaluating product {ProductId}", productId);

            // Use the first image for re-evaluation (safely)
            var firstImage = product.ProductImages.FirstOrDefault();
            if (firstImage == null)
            {
                result.Success = false;
                result.Errors.Add($"Product {productId} has no images to re-evaluate");
                return result;
            }

            var analysisResult = await _azureAIService.AnalyzeAsync(firstImage.ImageData, cancellationToken);

            if (!analysisResult.Success)
            {
                result.Success = false;
                result.Errors.Add($"Failed to analyze image: {analysisResult.ErrorMessage}");
                return result;
            }

            // Update product with new analysis
            product.EstimatedMSRP = analysisResult.EstimatedMSRP;
            product.EstimatedResaleValue = analysisResult.EstimatedResaleValue;
            product.Description = analysisResult.Description;
            product.Size = analysisResult.Size;
            product.BrandName = analysisResult.BrandName;
            product.Gender = analysisResult.Gender;
            product.ItemType = analysisResult.ItemType;
            product.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            result.Success = true;
            result.Product = product;

            _logger.LogInformation("Successfully re-evaluated product {ProductId}", productId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error re-evaluating product {ProductId}", productId);
            result.Success = false;
            result.Errors.Add($"Unexpected error: {ex.Message}");
        }

        return result;
    }

    public async Task<ProductBatchEvaluationResult> ReEvaluateBatchAsync(Guid[] productIds, CancellationToken cancellationToken = default)
    {
        var result = new ProductBatchEvaluationResult
        {
            TotalProcessed = productIds.Length
        };

        if (productIds == null || productIds.Length == 0)
        {
            result.Success = false;
            result.Errors.Add("No product IDs provided");
            return result;
        }

        _logger.LogInformation("Starting batch re-evaluation of {Count} products", productIds.Length);

        foreach (var productId in productIds)
        {
            try
            {
                var evaluationResult = await ReEvaluateItemAsync(productId, cancellationToken);

                if (evaluationResult.Success && evaluationResult.Product != null)
                {
                    result.Products.Add(evaluationResult.Product);
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
                _logger.LogError(ex, "Error processing product {ProductId}", productId);
                result.Failed++;
                result.Errors.Add($"Product {productId}: Unexpected error - {ex.Message}");
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
