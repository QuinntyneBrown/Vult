// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Products;

public class DeleteProductCommand : IRequest<DeleteProductCommandResult>
{
    public Guid ProductId { get; set; }

    public DeleteProductCommand(Guid productId)
    {
        ProductId = productId;
    }
}

public class DeleteProductCommandResult
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
