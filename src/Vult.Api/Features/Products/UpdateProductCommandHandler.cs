// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Products;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, UpdateProductCommandResult>
{
    private readonly IVultContext _context;

    public UpdateProductCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<UpdateProductCommandResult> Handle(UpdateProductCommand command, CancellationToken cancellationToken)
    {
        var result = new UpdateProductCommandResult();

        // Validate command
        var errors = ValidateCommand(command);
        if (errors.Any())
        {
            result.Success = false;
            result.Errors = errors;
            return result;
        }

        // Find existing product with images
        var product = await _context.Products
            .Include(x => x.ProductImages)
            .FirstOrDefaultAsync(x => x.ProductId == command.Product.ProductId, cancellationToken);

        if (product == null)
        {
            result.Success = false;
            result.Errors.Add("Product not found");
            return result;
        }

        // Update product
        product.UpdateFromDto(command.Product);

        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.Product = product.ToDto();

        return result;
    }

    private List<string> ValidateCommand(UpdateProductCommand command)
    {
        var errors = new List<string>();

        if (command.Product == null)
        {
            errors.Add("Product is required");
            return errors;
        }

        if (command.Product.ProductId == Guid.Empty)
        {
            errors.Add("ProductId is required");
        }

        if (command.Product.EstimatedMSRP <= 0)
        {
            errors.Add("Estimated MSRP must be greater than 0");
        }

        if (command.Product.EstimatedResaleValue <= 0)
        {
            errors.Add("Estimated Resale Value must be greater than 0");
        }

        if (string.IsNullOrWhiteSpace(command.Product.Description))
        {
            errors.Add("Description is required");
        }
        else if (command.Product.Description.Length > 1000)
        {
            errors.Add("Description cannot exceed 1000 characters");
        }

        if (string.IsNullOrWhiteSpace(command.Product.Size))
        {
            errors.Add("Size is required");
        }
        else if (command.Product.Size.Length > 50)
        {
            errors.Add("Size cannot exceed 50 characters");
        }

        if (string.IsNullOrWhiteSpace(command.Product.BrandName))
        {
            errors.Add("Brand Name is required");
        }
        else if (command.Product.BrandName.Length > 100)
        {
            errors.Add("Brand Name cannot exceed 100 characters");
        }

        return errors;
    }
}
