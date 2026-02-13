// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Model.OrderAggregate;

namespace Vult.Api.Features.Orders;

public class OrderDto
{
    public Guid OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public string CustomerEmail { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
    public decimal Tax { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Total { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string? StripePaymentIntentId { get; set; }
    public string? StripePaymentStatus { get; set; }
    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingAddressLine1 { get; set; } = string.Empty;
    public string? ShippingAddressLine2 { get; set; }
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingProvince { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ShippingCountry { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public List<LineItemDto> LineItems { get; set; } = new();
}

public class LineItemDto
{
    public Guid LineItemId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductSize { get; set; }
    public string? ProductImageUrl { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal SubTotal => UnitPrice * Quantity;
}

public class CreateOrderDto
{
    public string CustomerEmail { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingAddressLine1 { get; set; } = string.Empty;
    public string? ShippingAddressLine2 { get; set; }
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingProvince { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ShippingCountry { get; set; } = string.Empty;
    public string? ShippingPhone { get; set; }
    public bool UseSeparateBillingAddress { get; set; }
    public string? BillingFullName { get; set; }
    public string? BillingAddressLine1 { get; set; }
    public string? BillingAddressLine2 { get; set; }
    public string? BillingCity { get; set; }
    public string? BillingProvince { get; set; }
    public string? BillingPostalCode { get; set; }
    public string? BillingCountry { get; set; }
    public decimal ShippingCost { get; set; }
    public List<CreateLineItemDto> LineItems { get; set; } = new();
}

public class CreateLineItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductSize { get; set; }
    public string? ProductImageUrl { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

public static class OrderMappingExtensions
{
    public static OrderDto ToDto(this Order order)
    {
        return new OrderDto
        {
            OrderId = order.OrderId,
            OrderNumber = order.OrderNumber,
            CustomerId = order.CustomerId,
            CustomerEmail = order.CustomerEmail,
            Status = order.Status.ToString(),
            SubTotal = order.SubTotal,
            Tax = order.Tax,
            ShippingCost = order.ShippingCost,
            Total = order.Total,
            Currency = order.Currency,
            StripePaymentIntentId = order.StripePaymentIntentId,
            StripePaymentStatus = order.StripePaymentStatus,
            ShippingFullName = order.ShippingFullName,
            ShippingAddressLine1 = order.ShippingAddressLine1,
            ShippingAddressLine2 = order.ShippingAddressLine2,
            ShippingCity = order.ShippingCity,
            ShippingProvince = order.ShippingProvince,
            ShippingPostalCode = order.ShippingPostalCode,
            ShippingCountry = order.ShippingCountry,
            CreatedDate = order.CreatedDate,
            LineItems = order.LineItems.Select(li => li.ToDto()).ToList()
        };
    }

    public static LineItemDto ToDto(this LineItem item)
    {
        return new LineItemDto
        {
            LineItemId = item.LineItemId,
            ProductId = item.ProductId,
            ProductName = item.ProductName,
            ProductSize = item.ProductSize,
            ProductImageUrl = item.ProductImageUrl,
            UnitPrice = item.UnitPrice,
            Quantity = item.Quantity
        };
    }

    public static Order ToOrder(this CreateOrderDto dto)
    {
        var now = DateTime.UtcNow;
        var order = new Order
        {
            OrderId = Guid.NewGuid(),
            OrderNumber = Order.GenerateOrderNumber(),
            CustomerId = dto.CustomerId,
            CustomerEmail = dto.CustomerEmail,
            Status = OrderStatus.Pending,
            ShippingFullName = dto.ShippingFullName,
            ShippingAddressLine1 = dto.ShippingAddressLine1,
            ShippingAddressLine2 = dto.ShippingAddressLine2,
            ShippingCity = dto.ShippingCity,
            ShippingProvince = dto.ShippingProvince,
            ShippingPostalCode = dto.ShippingPostalCode,
            ShippingCountry = dto.ShippingCountry,
            ShippingPhone = dto.ShippingPhone,
            UseSeparateBillingAddress = dto.UseSeparateBillingAddress,
            BillingFullName = dto.BillingFullName,
            BillingAddressLine1 = dto.BillingAddressLine1,
            BillingAddressLine2 = dto.BillingAddressLine2,
            BillingCity = dto.BillingCity,
            BillingProvince = dto.BillingProvince,
            BillingPostalCode = dto.BillingPostalCode,
            BillingCountry = dto.BillingCountry,
            Currency = "CAD",
            CreatedDate = now,
            UpdatedDate = now
        };

        foreach (var itemDto in dto.LineItems)
        {
            order.LineItems.Add(new LineItem
            {
                LineItemId = Guid.NewGuid(),
                OrderId = order.OrderId,
                ProductId = itemDto.ProductId,
                ProductName = itemDto.ProductName,
                ProductSize = itemDto.ProductSize,
                ProductImageUrl = itemDto.ProductImageUrl,
                UnitPrice = itemDto.UnitPrice,
                Quantity = itemDto.Quantity
            });
        }

        order.CalculateTotals(0.13m, dto.ShippingCost); // 13% HST

        return order;
    }
}
