// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ProductService.Api.Data;

namespace ProductService.Api.Features.Products;

public class GetProductByIdQuery : IRequest<ProductDto?>
{
    public Guid ProductId { get; set; }
}

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly ProductDbContext _context;

    public GetProductByIdQueryHandler(ProductDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(x => x.ProductImages)
            .FirstOrDefaultAsync(x => x.ProductId == request.ProductId, cancellationToken);

        return product?.ToDto();
    }
}
