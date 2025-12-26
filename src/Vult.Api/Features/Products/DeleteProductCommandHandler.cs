// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Products;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, DeleteProductCommandResult>
{
    private readonly IVultContext _context;

    public DeleteProductCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<DeleteProductCommandResult> Handle(DeleteProductCommand command, CancellationToken cancellationToken)
    {
        var result = new DeleteProductCommandResult();

        // Validate command
        if (command.ProductId == Guid.Empty)
        {
            result.Success = false;
            result.Errors.Add("ProductId is required");
            return result;
        }

        // Find existing product
        var product = await _context.Products
            .FirstOrDefaultAsync(x => x.ProductId == command.ProductId, cancellationToken);

        if (product == null)
        {
            result.Success = false;
            result.Errors.Add("Product not found");
            return result;
        }

        // Delete product (cascade delete will handle images)
        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;

        return result;
    }
}
