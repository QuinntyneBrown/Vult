// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ProductService.Api.Data;
using ProductService.Api.Model;

namespace ProductService.Api.Features.Products;

public class GetProductsQuery : IRequest<GetProductsQueryResult>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? BrandName { get; set; }
    public ItemType? ItemType { get; set; }
    public Gender? Gender { get; set; }
    public string? SortBy { get; set; }
}

public class GetProductsQueryResult
{
    public List<ProductDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, GetProductsQueryResult>
{
    private readonly ProductDbContext _context;

    public GetProductsQueryHandler(ProductDbContext context)
    {
        _context = context;
    }

    public async Task<GetProductsQueryResult> Handle(GetProductsQuery query, CancellationToken cancellationToken)
    {
        var queryable = _context.Products
            .Include(x => x.ProductImages)
            .AsQueryable();

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

        queryable = query.SortBy?.ToLower() switch
        {
            "price" => queryable.OrderBy(x => x.EstimatedMSRP),
            "price_desc" => queryable.OrderByDescending(x => x.EstimatedMSRP),
            "date" => queryable.OrderBy(x => x.CreatedDate),
            "date_desc" => queryable.OrderByDescending(x => x.CreatedDate),
            _ => queryable.OrderByDescending(x => x.CreatedDate)
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
