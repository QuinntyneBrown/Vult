// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Orders;

public record GetOrderByNumberQuery(string OrderNumber) : IRequest<GetOrderByNumberQueryResult>;

public class GetOrderByNumberQueryResult
{
    public OrderDto? Order { get; set; }
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
}

public class GetOrderByNumberQueryHandler : IRequestHandler<GetOrderByNumberQuery, GetOrderByNumberQueryResult>
{
    private readonly IVultContext _context;

    public GetOrderByNumberQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetOrderByNumberQueryResult> Handle(GetOrderByNumberQuery query, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.OrderNumber == query.OrderNumber, cancellationToken);

        if (order == null)
        {
            return new GetOrderByNumberQueryResult
            {
                Success = false,
                ErrorMessage = $"Order with number {query.OrderNumber} not found"
            };
        }

        return new GetOrderByNumberQueryResult
        {
            Success = true,
            Order = order.ToDto()
        };
    }
}
