// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core;

public interface ICatalogItemEvaluationService
{
    /// <summary>
    /// Re-evaluates a single catalog item using Azure AI
    /// </summary>
    /// <param name="catalogItemId">The ID of the catalog item to re-evaluate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing the updated catalog item and processing status</returns>
    Task<CatalogItemEvaluationResult> ReEvaluateItemAsync(Guid catalogItemId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Re-evaluates a batch of catalog items using Azure AI
    /// </summary>
    /// <param name="catalogItemIds">The IDs of catalog items to re-evaluate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing updated catalog items and processing status</returns>
    Task<CatalogItemBatchEvaluationResult> ReEvaluateBatchAsync(Guid[] catalogItemIds, CancellationToken cancellationToken = default);
}
