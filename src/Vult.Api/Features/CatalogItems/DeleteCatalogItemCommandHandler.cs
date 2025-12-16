// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core.Interfaces;

namespace Vult.Api.Features.CatalogItems;

public class DeleteCatalogItemCommandHandler : IRequestHandler<DeleteCatalogItemCommand, DeleteCatalogItemCommandResult>
{
    private readonly IVultContext _context;

    public DeleteCatalogItemCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<DeleteCatalogItemCommandResult> Handle(DeleteCatalogItemCommand command, CancellationToken cancellationToken)
    {
        var result = new DeleteCatalogItemCommandResult();

        // Validate command
        if (command.CatalogItemId == Guid.Empty)
        {
            result.Success = false;
            result.Errors.Add("CatalogItemId is required");
            return result;
        }

        // Find existing catalog item
        var catalogItem = await _context.CatalogItems
            .FirstOrDefaultAsync(x => x.CatalogItemId == command.CatalogItemId, cancellationToken);

        if (catalogItem == null)
        {
            result.Success = false;
            result.Errors.Add("Catalog item not found");
            return result;
        }

        // Delete catalog item (cascade delete will handle images)
        _context.CatalogItems.Remove(catalogItem);
        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;

        return result;
    }
}
