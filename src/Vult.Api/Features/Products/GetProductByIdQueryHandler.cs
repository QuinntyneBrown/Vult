// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Products;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, GetProductByIdQueryResult>
{
    private readonly IVultContext _context;

    public GetProductByIdQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetProductByIdQueryResult> Handle(GetProductByIdQuery query, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(x => x.ProductImages)
            .FirstOrDefaultAsync(x => x.ProductId == query.ProductId, cancellationToken);

        return new GetProductByIdQueryResult
        {
            Product = product?.ToDto()
        };
    }
}
