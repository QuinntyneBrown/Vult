// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core.Interfaces;

namespace Vult.Api.Features.CatalogItems;

public class CreateCatalogItemCommandHandler : IRequestHandler<CreateCatalogItemCommand, CreateCatalogItemCommandResult>
{
    private readonly IVultContext _context;

    public CreateCatalogItemCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<CreateCatalogItemCommandResult> Handle(CreateCatalogItemCommand command, CancellationToken cancellationToken)
    {
        var result = new CreateCatalogItemCommandResult();

        // Validate command
        var errors = ValidateCommand(command);
        if (errors.Any())
        {
            result.Success = false;
            result.Errors = errors;
            return result;
        }

        // Create catalog item
        var catalogItem = command.CatalogItem.ToCatalogItem();

        _context.CatalogItems.Add(catalogItem);
        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.CatalogItem = catalogItem.ToDto();

        return result;
    }

    private List<string> ValidateCommand(CreateCatalogItemCommand command)
    {
        var errors = new List<string>();

        if (command.CatalogItem == null)
        {
            errors.Add("CatalogItem is required");
            return errors;
        }

        if (command.CatalogItem.EstimatedMSRP <= 0)
        {
            errors.Add("Estimated MSRP must be greater than 0");
        }

        if (command.CatalogItem.EstimatedResaleValue <= 0)
        {
            errors.Add("Estimated Resale Value must be greater than 0");
        }

        if (string.IsNullOrWhiteSpace(command.CatalogItem.Description))
        {
            errors.Add("Description is required");
        }
        else if (command.CatalogItem.Description.Length > 1000)
        {
            errors.Add("Description cannot exceed 1000 characters");
        }

        if (string.IsNullOrWhiteSpace(command.CatalogItem.Size))
        {
            errors.Add("Size is required");
        }
        else if (command.CatalogItem.Size.Length > 50)
        {
            errors.Add("Size cannot exceed 50 characters");
        }

        if (string.IsNullOrWhiteSpace(command.CatalogItem.BrandName))
        {
            errors.Add("Brand Name is required");
        }
        else if (command.CatalogItem.BrandName.Length > 100)
        {
            errors.Add("Brand Name cannot exceed 100 characters");
        }

        return errors;
    }
}
