// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Products;

public class GetFeaturedProductsQueryHandler : IRequestHandler<GetFeaturedProductsQuery, GetFeaturedProductsQueryResult>
{
    private readonly IVultContext _context;

    public GetFeaturedProductsQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetFeaturedProductsQueryResult> Handle(GetFeaturedProductsQuery query, CancellationToken cancellationToken)
    {
        var queryable = _context.Products
            .Include(x => x.ProductImages)
            .Where(x => x.IsFeatured)
            .OrderByDescending(x => x.CreatedDate);

        var totalCount = await queryable.CountAsync(cancellationToken);

        var items = await queryable
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new GetFeaturedProductsQueryResult
        {
            Items = items.Select(x => x.ToDto()).ToList(),
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}
