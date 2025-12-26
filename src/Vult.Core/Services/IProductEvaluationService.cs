// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core;

public interface IProductEvaluationService
{
    /// <summary>
    /// Re-evaluates a single product using Azure AI
    /// </summary>
    /// <param name="productId">The ID of the product to re-evaluate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing the updated product and processing status</returns>
    Task<ProductEvaluationResult> ReEvaluateItemAsync(Guid productId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Re-evaluates a batch of products using Azure AI
    /// </summary>
    /// <param name="productIds">The IDs of products to re-evaluate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing updated products and processing status</returns>
    Task<ProductBatchEvaluationResult> ReEvaluateBatchAsync(Guid[] productIds, CancellationToken cancellationToken = default);
}
