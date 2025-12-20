// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core;

public interface IImageAnalysisService
{
    /// <summary>
    /// Analyzes an image and extracts catalog item information
    /// </summary>
    /// <param name="imageData">The image data as byte array</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>CatalogItemAnalysisResult containing extracted item information</returns>
    Task<CatalogItemAnalysisResult> AnalyzeAsync(byte[] imageData, CancellationToken cancellationToken = default);
}
