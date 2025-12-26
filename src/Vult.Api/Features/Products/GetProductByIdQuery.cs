// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Products;

public class GetProductByIdQuery : IRequest<GetProductByIdQueryResult>
{
    public Guid ProductId { get; set; }

    public GetProductByIdQuery(Guid productId)
    {
        ProductId = productId;
    }
}

public class GetProductByIdQueryResult
{
    public ProductDto? Product { get; set; }
}
