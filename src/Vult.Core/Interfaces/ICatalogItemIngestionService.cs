// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Models;

namespace Vult.Core.Interfaces;

public interface ICatalogItemIngestionService
{
    /// <summary>
    /// Processes multiple images and creates catalog items with AI-generated metadata
    /// </summary>
    /// <param name="images">Array of image byte arrays to process</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Result containing created catalog items and processing status</returns>
    Task<CatalogItemIngestionResult> IngestImagesAsync(byte[][] images, CancellationToken cancellationToken = default);
}

public class CatalogItemIngestionResult
{
    public List<CatalogItem> CatalogItems { get; set; } = new();
    
    public bool Success { get; set; }
    
    public List<string> Errors { get; set; } = new();
    
    public int TotalProcessed { get; set; }
    
    public int SuccessfullyProcessed { get; set; }
    
    public int Failed { get; set; }
}
