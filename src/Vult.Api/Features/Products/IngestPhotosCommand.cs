// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Products;

public class IngestProductPhotosCommand : IRequest<IngestProductPhotosCommandResult>
{
    public List<IFormFile> Photos { get; set; } = new();
}

public class IngestProductPhotosCommandResult
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
    public int TotalProcessed { get; set; }
    public int SuccessfullyProcessed { get; set; }
    public int Failed { get; set; }
    public List<ProductDto> Products { get; set; } = new();
}
