// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using OrderService.Api.Data;
using OrderService.Api.Model;

namespace OrderService.Api.Features.Orders;

public class GetOrdersQuery : IRequest<GetOrdersQueryResult>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public Guid? CustomerId { get; set; }
    public OrderStatus? Status { get; set; }
}

public class GetOrdersQueryResult
{
    public List<OrderDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}

public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, GetOrdersQueryResult>
{
    private readonly OrderDbContext _context;

    public GetOrdersQueryHandler(OrderDbContext context)
    {
        _context = context;
    }

    public async Task<GetOrdersQueryResult> Handle(GetOrdersQuery query, CancellationToken cancellationToken)
    {
        var queryable = _context.Orders
            .Include(o => o.LineItems)
            .AsQueryable();

        if (query.CustomerId.HasValue)
        {
            queryable = queryable.Where(o => o.CustomerId == query.CustomerId.Value);
        }

        if (query.Status.HasValue)
        {
            queryable = queryable.Where(o => o.Status == query.Status.Value);
        }

        queryable = queryable.OrderByDescending(o => o.CreatedDate);

        var totalCount = await queryable.CountAsync(cancellationToken);

        var items = await queryable
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new GetOrdersQueryResult
        {
            Items = items.Select(o => o.ToDto()).ToList(),
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}

public class GetOrderByIdQuery : IRequest<OrderDto?>
{
    public Guid OrderId { get; set; }
}

public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderDto?>
{
    private readonly OrderDbContext _context;

    public GetOrderByIdQueryHandler(OrderDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDto?> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.OrderId == request.OrderId, cancellationToken);

        return order?.ToDto();
    }
}

public class GetOrderByNumberQuery : IRequest<OrderDto?>
{
    public string OrderNumber { get; set; } = string.Empty;
}

public class GetOrderByNumberQueryHandler : IRequestHandler<GetOrderByNumberQuery, OrderDto?>
{
    private readonly OrderDbContext _context;

    public GetOrderByNumberQueryHandler(OrderDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDto?> Handle(GetOrderByNumberQuery request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.OrderNumber == request.OrderNumber, cancellationToken);

        return order?.ToDto();
    }
}
