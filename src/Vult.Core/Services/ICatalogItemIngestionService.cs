// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core;

public interface ICatalogItemIngestionService
{
    /// <summary>
    /// Processes multiple images and creates catalog items with AI-generated metadata
    /// </summary>
    /// <param name="images">Array of image byte arrays to process</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing created catalog items and processing status</returns>
    Task<CatalogItemIngestionResult> IngestAsync(byte[][] images, CancellationToken cancellationToken = default);
}
