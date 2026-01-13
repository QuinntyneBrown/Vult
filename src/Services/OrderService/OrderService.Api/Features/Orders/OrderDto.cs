// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using OrderService.Api.Model;

namespace OrderService.Api.Features.Orders;

public class OrderDto
{
    public Guid OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public string CustomerEmail { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public decimal SubTotal { get; set; }
    public decimal Tax { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Total { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingAddressLine1 { get; set; } = string.Empty;
    public string? ShippingAddressLine2 { get; set; }
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingProvince { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ShippingCountry { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
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
    public decimal SubTotal { get; set; }
}

public class CreateOrderDto
{
    public Guid? CustomerId { get; set; }
    public string CustomerEmail { get; set; } = string.Empty;
    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingAddressLine1 { get; set; } = string.Empty;
    public string? ShippingAddressLine2 { get; set; }
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingProvince { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ShippingCountry { get; set; } = string.Empty;
    public string? ShippingPhone { get; set; }
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

public class UpdateOrderStatusDto
{
    public OrderStatus Status { get; set; }
}

public static class OrderExtensions
{
    public static OrderDto ToDto(this Order order)
    {
        return new OrderDto
        {
            OrderId = order.OrderId,
            OrderNumber = order.OrderNumber,
            CustomerId = order.CustomerId,
            CustomerEmail = order.CustomerEmail,
            Status = order.Status,
            SubTotal = order.SubTotal,
            Tax = order.Tax,
            ShippingCost = order.ShippingCost,
            Total = order.Total,
            Currency = order.Currency,
            ShippingFullName = order.ShippingFullName,
            ShippingAddressLine1 = order.ShippingAddressLine1,
            ShippingAddressLine2 = order.ShippingAddressLine2,
            ShippingCity = order.ShippingCity,
            ShippingProvince = order.ShippingProvince,
            ShippingPostalCode = order.ShippingPostalCode,
            ShippingCountry = order.ShippingCountry,
            CreatedDate = order.CreatedDate,
            UpdatedDate = order.UpdatedDate,
            LineItems = order.LineItems.Select(li => li.ToDto()).ToList()
        };
    }

    public static LineItemDto ToDto(this LineItem lineItem)
    {
        return new LineItemDto
        {
            LineItemId = lineItem.LineItemId,
            ProductId = lineItem.ProductId,
            ProductName = lineItem.ProductName,
            ProductSize = lineItem.ProductSize,
            ProductImageUrl = lineItem.ProductImageUrl,
            UnitPrice = lineItem.UnitPrice,
            Quantity = lineItem.Quantity,
            SubTotal = lineItem.SubTotal
        };
    }
}
