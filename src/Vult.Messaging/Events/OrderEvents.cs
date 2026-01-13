// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MessagePack;

namespace Vult.Messaging.Events;

[MessagePackObject]
public class OrderCreatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid OrderId { get; set; }

    [Key(4)]
    public string OrderNumber { get; set; } = string.Empty;

    [Key(5)]
    public Guid? CustomerId { get; set; }

    [Key(6)]
    public string CustomerEmail { get; set; } = string.Empty;

    [Key(7)]
    public decimal Total { get; set; }

    [Key(8)]
    public string Status { get; set; } = string.Empty;

    [Key(9)]
    public List<OrderLineItemData> LineItems { get; set; } = new();
}

[MessagePackObject]
public class OrderLineItemData
{
    [Key(0)]
    public Guid ProductId { get; set; }

    [Key(1)]
    public string ProductName { get; set; } = string.Empty;

    [Key(2)]
    public int Quantity { get; set; }

    [Key(3)]
    public decimal UnitPrice { get; set; }
}

[MessagePackObject]
public class OrderStatusChangedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid OrderId { get; set; }

    [Key(4)]
    public string OrderNumber { get; set; } = string.Empty;

    [Key(5)]
    public string PreviousStatus { get; set; } = string.Empty;

    [Key(6)]
    public string NewStatus { get; set; } = string.Empty;

    [Key(7)]
    public Guid? CustomerId { get; set; }

    [Key(8)]
    public string CustomerEmail { get; set; } = string.Empty;
}
