// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core;

public interface IProductIngestionService
{
    /// <summary>
    /// Processes multiple images and creates products with AI-generated metadata
    /// </summary>
    /// <param name="images">Array of image byte arrays to process</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing created products and processing status</returns>
    Task<ProductIngestionResult> IngestAsync(byte[][] images, CancellationToken cancellationToken = default);
}
