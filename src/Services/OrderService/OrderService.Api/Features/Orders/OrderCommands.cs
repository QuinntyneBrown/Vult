// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using OrderService.Api.Data;
using OrderService.Api.Model;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace OrderService.Api.Features.Orders;

public class CreateOrderCommand : IRequest<OrderDto>
{
    public CreateOrderDto Order { get; set; } = null!;
}

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderDto>
{
    private readonly OrderDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<CreateOrderCommandHandler> _logger;

    public CreateOrderCommandHandler(
        OrderDbContext context,
        IEventPublisher eventPublisher,
        ILogger<CreateOrderCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<OrderDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new Order
        {
            OrderId = Guid.NewGuid(),
            OrderNumber = Order.GenerateOrderNumber(),
            CustomerId = request.Order.CustomerId,
            CustomerEmail = request.Order.CustomerEmail,
            Status = OrderStatus.Pending,
            Currency = "USD",
            ShippingFullName = request.Order.ShippingFullName,
            ShippingAddressLine1 = request.Order.ShippingAddressLine1,
            ShippingAddressLine2 = request.Order.ShippingAddressLine2,
            ShippingCity = request.Order.ShippingCity,
            ShippingProvince = request.Order.ShippingProvince,
            ShippingPostalCode = request.Order.ShippingPostalCode,
            ShippingCountry = request.Order.ShippingCountry,
            ShippingPhone = request.Order.ShippingPhone,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            LineItems = request.Order.LineItems.Select(li => new LineItem
            {
                LineItemId = Guid.NewGuid(),
                ProductId = li.ProductId,
                ProductName = li.ProductName,
                ProductSize = li.ProductSize,
                ProductImageUrl = li.ProductImageUrl,
                UnitPrice = li.UnitPrice,
                Quantity = li.Quantity
            }).ToList()
        };

        order.CalculateTotals();

        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new OrderCreatedEvent
        {
            OrderId = order.OrderId,
            OrderNumber = order.OrderNumber,
            CustomerId = order.CustomerId,
            CustomerEmail = order.CustomerEmail,
            Total = order.Total,
            Status = order.Status.ToString(),
            LineItems = order.LineItems.Select(li => new OrderLineItemData
            {
                ProductId = li.ProductId,
                ProductName = li.ProductName,
                Quantity = li.Quantity,
                UnitPrice = li.UnitPrice
            }).ToList()
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published OrderCreatedEvent for order {OrderId}", order.OrderId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish OrderCreatedEvent for order {OrderId}", order.OrderId);
        }

        return order.ToDto();
    }
}

public class UpdateOrderStatusCommand : IRequest<OrderDto?>
{
    public Guid OrderId { get; set; }
    public OrderStatus NewStatus { get; set; }
}

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, OrderDto?>
{
    private readonly OrderDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<UpdateOrderStatusCommandHandler> _logger;

    public UpdateOrderStatusCommandHandler(
        OrderDbContext context,
        IEventPublisher eventPublisher,
        ILogger<UpdateOrderStatusCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<OrderDto?> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.OrderId == request.OrderId, cancellationToken);

        if (order == null)
        {
            return null;
        }

        if (!order.CanTransitionTo(request.NewStatus))
        {
            _logger.LogWarning(
                "Invalid status transition from {CurrentStatus} to {NewStatus} for order {OrderId}",
                order.Status, request.NewStatus, order.OrderId);
            return null;
        }

        var previousStatus = order.Status;
        order.Status = request.NewStatus;
        order.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new OrderStatusChangedEvent
        {
            OrderId = order.OrderId,
            OrderNumber = order.OrderNumber,
            PreviousStatus = previousStatus.ToString(),
            NewStatus = request.NewStatus.ToString(),
            CustomerId = order.CustomerId,
            CustomerEmail = order.CustomerEmail
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published OrderStatusChangedEvent for order {OrderId}", order.OrderId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish OrderStatusChangedEvent for order {OrderId}", order.OrderId);
        }

        return order.ToDto();
    }
}
