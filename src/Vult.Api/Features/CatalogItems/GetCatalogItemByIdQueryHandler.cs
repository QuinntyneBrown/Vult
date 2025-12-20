// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.CatalogItems;

public class GetCatalogItemByIdQueryHandler : IRequestHandler<GetCatalogItemByIdQuery, GetCatalogItemByIdQueryResult>
{
    private readonly IVultContext _context;

    public GetCatalogItemByIdQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetCatalogItemByIdQueryResult> Handle(GetCatalogItemByIdQuery query, CancellationToken cancellationToken)
    {
        var catalogItem = await _context.CatalogItems
            .Include(x => x.CatalogItemImages)
            .FirstOrDefaultAsync(x => x.CatalogItemId == query.CatalogItemId, cancellationToken);

        return new GetCatalogItemByIdQueryResult
        {
            CatalogItem = catalogItem?.ToDto()
        };
    }
}
