// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Orders;

public record GetOrderByIdQuery(Guid OrderId) : IRequest<GetOrderByIdQueryResult>;

public class GetOrderByIdQueryResult
{
    public OrderDto? Order { get; set; }
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
}

public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, GetOrderByIdQueryResult>
{
    private readonly IVultContext _context;

    public GetOrderByIdQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetOrderByIdQueryResult> Handle(GetOrderByIdQuery query, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.OrderId == query.OrderId, cancellationToken);

        if (order == null)
        {
            return new GetOrderByIdQueryResult
            {
                Success = false,
                ErrorMessage = $"Order with ID {query.OrderId} not found"
            };
        }

        return new GetOrderByIdQueryResult
        {
            Success = true,
            Order = order.ToDto()
        };
    }
}
