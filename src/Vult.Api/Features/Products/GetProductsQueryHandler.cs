// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Products;

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, GetProductsQueryResult>
{
    private readonly IVultContext _context;

    public GetProductsQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetProductsQueryResult> Handle(GetProductsQuery query, CancellationToken cancellationToken)
    {
        var queryable = _context.Products
            .Include(x => x.ProductImages)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(query.BrandName))
        {
            var brandNameLower = query.BrandName.ToLower();
            queryable = queryable.Where(x => x.BrandName.ToLower().Contains(brandNameLower));
        }

        if (query.ItemType.HasValue)
        {
            queryable = queryable.Where(x => x.ItemType == query.ItemType.Value);
        }

        if (query.Gender.HasValue)
        {
            queryable = queryable.Where(x => x.Gender == query.Gender.Value);
        }

        // Apply sorting
        queryable = query.SortBy?.ToLower() switch
        {
            "price" => queryable.OrderBy(x => x.EstimatedMSRP),
            "price_desc" => queryable.OrderByDescending(x => x.EstimatedMSRP),
            "date" => queryable.OrderBy(x => x.CreatedDate),
            "date_desc" => queryable.OrderByDescending(x => x.CreatedDate),
            _ => queryable.OrderByDescending(x => x.CreatedDate) // Default sort
        };

        var totalCount = await queryable.CountAsync(cancellationToken);

        var items = await queryable
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new GetProductsQueryResult
        {
            Items = items.Select(x => x.ToDto()).ToList(),
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}
