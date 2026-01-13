// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ProductService.Api.Data;

namespace ProductService.Api.Features.Products;

public class GetFeaturedProductsQuery : IRequest<List<ProductDto>>
{
    public int Limit { get; set; } = 10;
}

public class GetFeaturedProductsQueryHandler : IRequestHandler<GetFeaturedProductsQuery, List<ProductDto>>
{
    private readonly ProductDbContext _context;

    public GetFeaturedProductsQueryHandler(ProductDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductDto>> Handle(GetFeaturedProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _context.Products
            .Include(x => x.ProductImages)
            .Where(x => x.IsFeatured)
            .OrderByDescending(x => x.CreatedDate)
            .Take(request.Limit)
            .ToListAsync(cancellationToken);

        return products.Select(x => x.ToDto()).ToList();
    }
}
