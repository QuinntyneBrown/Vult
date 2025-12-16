// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Api.Features.CatalogItems;

public class IngestPhotosCommand
{
    public List<IFormFile> Photos { get; set; } = new();
}

public class IngestPhotosCommandResult
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
    public int TotalProcessed { get; set; }
    public int SuccessfullyProcessed { get; set; }
    public int Failed { get; set; }
    public List<CatalogItemDto> CatalogItems { get; set; } = new();
}
