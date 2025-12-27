// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Model.OrderAggregate;

public class Order
{
    public Guid OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public string CustomerEmail { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    // Totals
    public decimal SubTotal { get; set; }
    public decimal Tax { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Total { get; set; }
    public string Currency { get; set; } = "USD";

    // Stripe
    public string? StripePaymentIntentId { get; set; }
    public string? StripePaymentStatus { get; set; }
    public string? PaymentErrorMessage { get; set; }

    // Addresses (embedded)
    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingAddressLine1 { get; set; } = string.Empty;
    public string? ShippingAddressLine2 { get; set; }
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingState { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ShippingCountry { get; set; } = string.Empty;
    public string? ShippingPhone { get; set; }

    // Billing (optional, separate)
    public bool UseSeparateBillingAddress { get; set; }
    public string? BillingFullName { get; set; }
    public string? BillingAddressLine1 { get; set; }
    public string? BillingAddressLine2 { get; set; }
    public string? BillingCity { get; set; }
    public string? BillingState { get; set; }
    public string? BillingPostalCode { get; set; }
    public string? BillingCountry { get; set; }
    public string? BillingPhone { get; set; }

    // Metadata
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }

    // Navigation
    public ICollection<LineItem> LineItems { get; set; } = new List<LineItem>();

    // Business methods
    public void CalculateTotals(decimal taxRate = 0.08m, decimal shippingCost = 0m)
    {
        SubTotal = LineItems.Sum(li => li.SubTotal);
        Tax = Math.Round(SubTotal * taxRate, 2);
        ShippingCost = shippingCost;
        Total = SubTotal + Tax + ShippingCost;
    }

    public bool CanTransitionTo(OrderStatus newStatus)
    {
        return (Status, newStatus) switch
        {
            (OrderStatus.Pending, OrderStatus.PaymentProcessing) => true,
            (OrderStatus.Pending, OrderStatus.Cancelled) => true,
            (OrderStatus.PaymentProcessing, OrderStatus.Confirmed) => true,
            (OrderStatus.PaymentProcessing, OrderStatus.Failed) => true,
            (OrderStatus.PaymentProcessing, OrderStatus.Cancelled) => true,
            (OrderStatus.Failed, OrderStatus.PaymentProcessing) => true,
            (OrderStatus.Failed, OrderStatus.Cancelled) => true,
            (OrderStatus.Confirmed, OrderStatus.Processing) => true,
            (OrderStatus.Confirmed, OrderStatus.Cancelled) => true,
            (OrderStatus.Processing, OrderStatus.Shipped) => true,
            (OrderStatus.Shipped, OrderStatus.Delivered) => true,
            _ => false
        };
    }

    public static string GenerateOrderNumber()
    {
        var date = DateTime.UtcNow.ToString("yyyyMMdd");
        var random = new Random().Next(100000, 999999);
        return $"VLT-{date}-{random}";
    }
}
