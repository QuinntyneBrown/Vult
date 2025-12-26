// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Products;

public class UpdateProductCommand : IRequest<UpdateProductCommandResult>
{
    public UpdateProductDto Product { get; set; } = null!;
}

public class UpdateProductCommandResult
{
    public ProductDto? Product { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
