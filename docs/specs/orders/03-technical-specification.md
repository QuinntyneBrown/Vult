# Order and Payment System - Technical Specification

**Version:** 1.0
**Date:** December 2024
**Author:** Engineering Team
**Status:** Draft

---

## 1. Overview

This document provides the technical implementation details for the Order and Payment system, following the established patterns in the Vult codebase.

---

## 2. Architecture

### 2.1 Layer Responsibilities

| Layer | Project | Responsibility |
|-------|---------|----------------|
| Domain | Vult.Core | Order, LineItem entities, IPaymentService interface |
| Infrastructure | Vult.Infrastructure | EF configurations, Stripe service implementation |
| Application | Vult.Api | Commands, Queries, Handlers, DTOs, Controllers |

### 2.2 Pattern Adherence

Following existing codebase patterns:
- **CQS with MediatR** for commands/queries
- **Result objects** for operation outcomes
- **DTOs** for API contracts
- **Extension methods** for mapping
- **IEntityTypeConfiguration** for EF mappings

---

## 3. Domain Layer (Vult.Core)

### 3.1 Order Aggregate

**File:** `src/Vult.Core/OrderAggregate/Order.cs`

```csharp
namespace Vult.Core.OrderAggregate;

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
```

### 3.2 LineItem Entity

**File:** `src/Vult.Core/OrderAggregate/LineItem.cs`

```csharp
namespace Vult.Core.OrderAggregate;

public class LineItem
{
    public Guid LineItemId { get; set; }
    public Guid OrderId { get; set; }

    // Product snapshot (immutable at order time)
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductSize { get; set; }
    public string? ProductImageUrl { get; set; }
    public decimal UnitPrice { get; set; }

    // Order details
    public int Quantity { get; set; }
    public decimal SubTotal => UnitPrice * Quantity;

    // Navigation
    public Order Order { get; set; } = null!;
}
```

### 3.3 OrderStatus Enum

**File:** `src/Vult.Core/OrderAggregate/OrderStatus.cs`

```csharp
namespace Vult.Core.OrderAggregate;

public enum OrderStatus
{
    Pending = 0,
    PaymentProcessing = 1,
    Confirmed = 2,
    Processing = 3,
    Shipped = 4,
    Delivered = 5,
    Cancelled = 6,
    Failed = 7
}
```

### 3.4 Payment Service Interface

**File:** `src/Vult.Core/Services/IPaymentService.cs`

```csharp
namespace Vult.Core.Services;

public interface IPaymentService
{
    Task<PaymentIntentResult> CreatePaymentIntentAsync(
        decimal amount,
        string currency,
        Dictionary<string, string> metadata);

    Task<bool> CancelPaymentIntentAsync(string paymentIntentId);

    StripeWebhookEvent? ParseWebhookEvent(string payload, string signature);
}

public class PaymentIntentResult
{
    public bool Success { get; set; }
    public string? PaymentIntentId { get; set; }
    public string? ClientSecret { get; set; }
    public string? ErrorMessage { get; set; }
}

public class StripeWebhookEvent
{
    public string EventType { get; set; } = string.Empty;
    public string PaymentIntentId { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
}
```

---

## 4. Infrastructure Layer (Vult.Infrastructure)

### 4.1 EF Configuration - Order

**File:** `src/Vult.Infrastructure/Data/Configurations/OrderConfiguration.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.OrderAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(o => o.OrderId);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(o => o.OrderNumber)
            .IsUnique();

        builder.Property(o => o.CustomerEmail)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(o => o.SubTotal)
            .HasPrecision(18, 2);

        builder.Property(o => o.Tax)
            .HasPrecision(18, 2);

        builder.Property(o => o.ShippingCost)
            .HasPrecision(18, 2);

        builder.Property(o => o.Total)
            .HasPrecision(18, 2);

        builder.Property(o => o.Currency)
            .HasMaxLength(3)
            .HasDefaultValue("USD");

        builder.Property(o => o.StripePaymentIntentId)
            .HasMaxLength(255);

        builder.HasIndex(o => o.StripePaymentIntentId);

        builder.Property(o => o.StripePaymentStatus)
            .HasMaxLength(50);

        builder.Property(o => o.PaymentErrorMessage)
            .HasMaxLength(1000);

        // Shipping address
        builder.Property(o => o.ShippingFullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(o => o.ShippingAddressLine1)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(o => o.ShippingAddressLine2)
            .HasMaxLength(500);

        builder.Property(o => o.ShippingCity)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(o => o.ShippingState)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(o => o.ShippingPostalCode)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(o => o.ShippingCountry)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(o => o.ShippingPhone)
            .HasMaxLength(50);

        // Billing address
        builder.Property(o => o.BillingFullName)
            .HasMaxLength(200);

        builder.Property(o => o.BillingAddressLine1)
            .HasMaxLength(500);

        builder.Property(o => o.BillingAddressLine2)
            .HasMaxLength(500);

        builder.Property(o => o.BillingCity)
            .HasMaxLength(100);

        builder.Property(o => o.BillingState)
            .HasMaxLength(100);

        builder.Property(o => o.BillingPostalCode)
            .HasMaxLength(20);

        builder.Property(o => o.BillingCountry)
            .HasMaxLength(100);

        builder.Property(o => o.BillingPhone)
            .HasMaxLength(50);

        // Relationships
        builder.HasMany(o => o.LineItems)
            .WithOne(li => li.Order)
            .HasForeignKey(li => li.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(o => o.CustomerId);
        builder.HasIndex(o => o.CustomerEmail);
        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => o.CreatedDate);
    }
}
```

### 4.2 EF Configuration - LineItem

**File:** `src/Vult.Infrastructure/Data/Configurations/LineItemConfiguration.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.OrderAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class LineItemConfiguration : IEntityTypeConfiguration<LineItem>
{
    public void Configure(EntityTypeBuilder<LineItem> builder)
    {
        builder.ToTable("LineItems");

        builder.HasKey(li => li.LineItemId);

        builder.Property(li => li.ProductName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(li => li.ProductSize)
            .HasMaxLength(50);

        builder.Property(li => li.ProductImageUrl)
            .HasMaxLength(2000);

        builder.Property(li => li.UnitPrice)
            .HasPrecision(18, 2);

        // SubTotal is computed, not stored
        builder.Ignore(li => li.SubTotal);

        // Indexes
        builder.HasIndex(li => li.OrderId);
        builder.HasIndex(li => li.ProductId);
    }
}
```

### 4.3 Stripe Payment Service

**File:** `src/Vult.Infrastructure/Services/StripePaymentService.cs`

```csharp
using Microsoft.Extensions.Configuration;
using Stripe;
using Vult.Core.Services;

namespace Vult.Infrastructure.Services;

public class StripePaymentService : IPaymentService
{
    private readonly string _webhookSecret;

    public StripePaymentService(IConfiguration configuration)
    {
        StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];
        _webhookSecret = configuration["Stripe:WebhookSecret"] ?? "";
    }

    public async Task<PaymentIntentResult> CreatePaymentIntentAsync(
        decimal amount,
        string currency,
        Dictionary<string, string> metadata)
    {
        try
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100), // Convert to cents
                Currency = currency.ToLower(),
                PaymentMethodTypes = new List<string> { "card" },
                Metadata = metadata
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return new PaymentIntentResult
            {
                Success = true,
                PaymentIntentId = paymentIntent.Id,
                ClientSecret = paymentIntent.ClientSecret
            };
        }
        catch (StripeException ex)
        {
            return new PaymentIntentResult
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<bool> CancelPaymentIntentAsync(string paymentIntentId)
    {
        try
        {
            var service = new PaymentIntentService();
            await service.CancelAsync(paymentIntentId);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public StripeWebhookEvent? ParseWebhookEvent(string payload, string signature)
    {
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                payload,
                signature,
                _webhookSecret);

            if (stripeEvent.Data.Object is PaymentIntent paymentIntent)
            {
                return new StripeWebhookEvent
                {
                    EventType = stripeEvent.Type,
                    PaymentIntentId = paymentIntent.Id,
                    ErrorMessage = paymentIntent.LastPaymentError?.Message
                };
            }

            return null;
        }
        catch
        {
            return null;
        }
    }
}
```

### 4.4 DbContext Updates

**Add to:** `src/Vult.Infrastructure/Data/VultContext.cs`

```csharp
// Add DbSets
public DbSet<Order> Orders => Set<Order>();
public DbSet<LineItem> LineItems => Set<LineItem>();

// In OnModelCreating, add:
modelBuilder.ApplyConfiguration(new OrderConfiguration());
modelBuilder.ApplyConfiguration(new LineItemConfiguration());
```

---

## 5. Application Layer (Vult.Api)

### 5.1 DTOs

**File:** `src/Vult.Api/Dtos/OrderDtos.cs`

```csharp
namespace Vult.Api.Dtos;

// Request DTOs
public record CreateOrderDto(
    string CustomerEmail,
    ShippingAddressDto ShippingAddress,
    BillingAddressDto? BillingAddress,
    List<CreateLineItemDto> LineItems
);

public record ShippingAddressDto(
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string State,
    string PostalCode,
    string Country,
    string? Phone
);

public record BillingAddressDto(
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string State,
    string PostalCode,
    string Country,
    string? Phone
);

public record CreateLineItemDto(
    Guid ProductId,
    int Quantity,
    string? Size
);

// Response DTOs
public record OrderDto(
    Guid OrderId,
    string OrderNumber,
    string CustomerEmail,
    string Status,
    decimal SubTotal,
    decimal Tax,
    decimal ShippingCost,
    decimal Total,
    string Currency,
    ShippingAddressDto ShippingAddress,
    BillingAddressDto? BillingAddress,
    List<LineItemDto> LineItems,
    DateTime CreatedDate,
    DateTime UpdatedDate
);

public record LineItemDto(
    Guid LineItemId,
    Guid ProductId,
    string ProductName,
    string? ProductSize,
    string? ProductImageUrl,
    decimal UnitPrice,
    int Quantity,
    decimal SubTotal
);

public record PaymentIntentDto(
    string ClientSecret,
    string PaymentIntentId,
    long Amount,
    string Currency
);
```

### 5.2 Create Order Command

**File:** `src/Vult.Api/Features/Orders/CreateOrderCommand.cs`

```csharp
using MediatR;
using Vult.Api.Dtos;
using Vult.Core.Data;
using Vult.Core.OrderAggregate;
using Vult.Core.ProductAggregate;
using Microsoft.EntityFrameworkCore;

namespace Vult.Api.Features.Orders;

public record CreateOrderCommand(CreateOrderDto Order) : IRequest<CreateOrderResult>;

public class CreateOrderResult
{
    public OrderDto? Order { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, CreateOrderResult>
{
    private readonly IVultContext _context;

    public CreateOrderHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<CreateOrderResult> Handle(
        CreateOrderCommand request,
        CancellationToken cancellationToken)
    {
        var dto = request.Order;
        var result = new CreateOrderResult();

        // Validate line items
        if (dto.LineItems == null || !dto.LineItems.Any())
        {
            result.Errors.Add("Order must contain at least one line item");
            return result;
        }

        // Get all products for validation and snapshot
        var productIds = dto.LineItems.Select(li => li.ProductId).ToList();
        var products = await _context.Products
            .Include(p => p.ProductImages)
            .Where(p => productIds.Contains(p.ProductId))
            .ToDictionaryAsync(p => p.ProductId, cancellationToken);

        // Validate all products exist
        foreach (var lineItemDto in dto.LineItems)
        {
            if (!products.ContainsKey(lineItemDto.ProductId))
            {
                result.Errors.Add($"Product not found: {lineItemDto.ProductId}");
            }
            if (lineItemDto.Quantity < 1)
            {
                result.Errors.Add($"Invalid quantity for product: {lineItemDto.ProductId}");
            }
        }

        if (result.Errors.Any())
            return result;

        // Create order
        var order = new Order
        {
            OrderId = Guid.NewGuid(),
            OrderNumber = Order.GenerateOrderNumber(),
            CustomerEmail = dto.CustomerEmail,
            Status = OrderStatus.Pending,
            Currency = "USD",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,

            // Shipping
            ShippingFullName = dto.ShippingAddress.FullName,
            ShippingAddressLine1 = dto.ShippingAddress.AddressLine1,
            ShippingAddressLine2 = dto.ShippingAddress.AddressLine2,
            ShippingCity = dto.ShippingAddress.City,
            ShippingState = dto.ShippingAddress.State,
            ShippingPostalCode = dto.ShippingAddress.PostalCode,
            ShippingCountry = dto.ShippingAddress.Country,
            ShippingPhone = dto.ShippingAddress.Phone
        };

        // Billing (if separate)
        if (dto.BillingAddress != null)
        {
            order.UseSeparateBillingAddress = true;
            order.BillingFullName = dto.BillingAddress.FullName;
            order.BillingAddressLine1 = dto.BillingAddress.AddressLine1;
            order.BillingAddressLine2 = dto.BillingAddress.AddressLine2;
            order.BillingCity = dto.BillingAddress.City;
            order.BillingState = dto.BillingAddress.State;
            order.BillingPostalCode = dto.BillingAddress.PostalCode;
            order.BillingCountry = dto.BillingAddress.Country;
            order.BillingPhone = dto.BillingAddress.Phone;
        }

        // Create line items with product snapshots
        foreach (var lineItemDto in dto.LineItems)
        {
            var product = products[lineItemDto.ProductId];
            var primaryImage = product.ProductImages?.FirstOrDefault()?.Url;

            var lineItem = new LineItem
            {
                LineItemId = Guid.NewGuid(),
                OrderId = order.OrderId,
                ProductId = product.ProductId,
                ProductName = product.Name,
                ProductSize = lineItemDto.Size ?? product.Size,
                ProductImageUrl = primaryImage,
                UnitPrice = product.EstimatedMSRP,
                Quantity = lineItemDto.Quantity
            };

            order.LineItems.Add(lineItem);
        }

        // Calculate totals
        order.CalculateTotals();

        // Save
        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.Order = order.ToDto();

        return result;
    }
}
```

### 5.3 Create Payment Command

**File:** `src/Vult.Api/Features/Orders/CreatePaymentCommand.cs`

```csharp
using MediatR;
using Vult.Api.Dtos;
using Vult.Core.Data;
using Vult.Core.OrderAggregate;
using Vult.Core.Services;
using Microsoft.EntityFrameworkCore;

namespace Vult.Api.Features.Orders;

public record CreatePaymentCommand(Guid OrderId) : IRequest<CreatePaymentResult>;

public class CreatePaymentResult
{
    public PaymentIntentDto? PaymentIntent { get; set; }
    public bool Success { get; set; }
    public string? Error { get; set; }
}

public class CreatePaymentHandler : IRequestHandler<CreatePaymentCommand, CreatePaymentResult>
{
    private readonly IVultContext _context;
    private readonly IPaymentService _paymentService;

    public CreatePaymentHandler(IVultContext context, IPaymentService paymentService)
    {
        _context = context;
        _paymentService = paymentService;
    }

    public async Task<CreatePaymentResult> Handle(
        CreatePaymentCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.OrderId == request.OrderId, cancellationToken);

        if (order == null)
        {
            return new CreatePaymentResult
            {
                Success = false,
                Error = "Order not found"
            };
        }

        // Can only pay for Pending or Failed orders
        if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Failed)
        {
            return new CreatePaymentResult
            {
                Success = false,
                Error = $"Cannot process payment for order with status: {order.Status}"
            };
        }

        // Create Stripe PaymentIntent
        var metadata = new Dictionary<string, string>
        {
            { "order_id", order.OrderId.ToString() },
            { "order_number", order.OrderNumber }
        };

        var paymentResult = await _paymentService.CreatePaymentIntentAsync(
            order.Total,
            order.Currency,
            metadata);

        if (!paymentResult.Success)
        {
            return new CreatePaymentResult
            {
                Success = false,
                Error = paymentResult.ErrorMessage
            };
        }

        // Update order
        order.StripePaymentIntentId = paymentResult.PaymentIntentId;
        order.Status = OrderStatus.PaymentProcessing;
        order.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new CreatePaymentResult
        {
            Success = true,
            PaymentIntent = new PaymentIntentDto(
                paymentResult.ClientSecret!,
                paymentResult.PaymentIntentId!,
                (long)(order.Total * 100),
                order.Currency.ToLower()
            )
        };
    }
}
```

### 5.4 Handle Webhook Command

**File:** `src/Vult.Api/Features/Orders/HandleStripeWebhookCommand.cs`

```csharp
using MediatR;
using Vult.Core.Data;
using Vult.Core.OrderAggregate;
using Vult.Core.Services;
using Microsoft.EntityFrameworkCore;

namespace Vult.Api.Features.Orders;

public record HandleStripeWebhookCommand(
    string Payload,
    string Signature
) : IRequest<HandleWebhookResult>;

public class HandleWebhookResult
{
    public bool Success { get; set; }
    public string? Error { get; set; }
}

public class HandleStripeWebhookHandler
    : IRequestHandler<HandleStripeWebhookCommand, HandleWebhookResult>
{
    private readonly IVultContext _context;
    private readonly IPaymentService _paymentService;

    public HandleStripeWebhookHandler(
        IVultContext context,
        IPaymentService paymentService)
    {
        _context = context;
        _paymentService = paymentService;
    }

    public async Task<HandleWebhookResult> Handle(
        HandleStripeWebhookCommand request,
        CancellationToken cancellationToken)
    {
        var webhookEvent = _paymentService.ParseWebhookEvent(
            request.Payload,
            request.Signature);

        if (webhookEvent == null)
        {
            return new HandleWebhookResult
            {
                Success = false,
                Error = "Invalid webhook signature"
            };
        }

        var order = await _context.Orders
            .FirstOrDefaultAsync(
                o => o.StripePaymentIntentId == webhookEvent.PaymentIntentId,
                cancellationToken);

        if (order == null)
        {
            // Order not found - return success to prevent Stripe retries
            // This can happen if webhook arrives before order is created
            return new HandleWebhookResult { Success = true };
        }

        switch (webhookEvent.EventType)
        {
            case "payment_intent.succeeded":
                if (order.Status != OrderStatus.Confirmed)
                {
                    order.Status = OrderStatus.Confirmed;
                    order.StripePaymentStatus = "succeeded";
                    order.UpdatedDate = DateTime.UtcNow;
                }
                break;

            case "payment_intent.payment_failed":
                if (order.Status != OrderStatus.Failed)
                {
                    order.Status = OrderStatus.Failed;
                    order.StripePaymentStatus = "failed";
                    order.PaymentErrorMessage = webhookEvent.ErrorMessage;
                    order.UpdatedDate = DateTime.UtcNow;
                }
                break;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new HandleWebhookResult { Success = true };
    }
}
```

### 5.5 Get Order Query

**File:** `src/Vult.Api/Features/Orders/GetOrderQuery.cs`

```csharp
using MediatR;
using Vult.Api.Dtos;
using Vult.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace Vult.Api.Features.Orders;

public record GetOrderQuery(Guid OrderId) : IRequest<OrderDto?>;

public class GetOrderHandler : IRequestHandler<GetOrderQuery, OrderDto?>
{
    private readonly IVultContext _context;

    public GetOrderHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<OrderDto?> Handle(
        GetOrderQuery request,
        CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.OrderId == request.OrderId, cancellationToken);

        return order?.ToDto();
    }
}
```

### 5.6 Orders Controller

**File:** `src/Vult.Api/Controllers/OrdersController.cs`

```csharp
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Dtos;
using Vult.Api.Features.Orders;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var result = await _mediator.Send(new CreateOrderCommand(dto));

        if (!result.Success)
            return BadRequest(new { errors = result.Errors });

        return CreatedAtAction(
            nameof(GetOrder),
            new { id = result.Order!.OrderId },
            result.Order);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var order = await _mediator.Send(new GetOrderQuery(id));

        if (order == null)
            return NotFound();

        return Ok(order);
    }

    [HttpPost("{id:guid}/payment")]
    [ProducesResponseType(typeof(PaymentIntentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreatePayment(Guid id)
    {
        var result = await _mediator.Send(new CreatePaymentCommand(id));

        if (!result.Success)
        {
            if (result.Error == "Order not found")
                return NotFound();

            return BadRequest(new { error = result.Error });
        }

        return Ok(result.PaymentIntent);
    }

    [HttpPost("{id:guid}/cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var result = await _mediator.Send(new CancelOrderCommand(id));

        if (!result.Success)
        {
            if (result.Error == "Order not found")
                return NotFound();

            return BadRequest(new { error = result.Error });
        }

        return NoContent();
    }
}
```

### 5.7 Webhooks Controller

**File:** `src/Vult.Api/Controllers/WebhooksController.cs`

```csharp
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.Orders;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly IMediator _mediator;

    public WebhooksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("stripe")]
    public async Task<IActionResult> HandleStripeWebhook()
    {
        var payload = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"].FirstOrDefault() ?? "";

        var result = await _mediator.Send(
            new HandleStripeWebhookCommand(payload, signature));

        if (!result.Success)
            return Unauthorized(new { error = result.Error });

        return Ok();
    }
}
```

### 5.8 Extension Methods

**File:** `src/Vult.Api/Extensions/OrderExtensions.cs`

```csharp
using Vult.Api.Dtos;
using Vult.Core.OrderAggregate;

namespace Vult.Api.Extensions;

public static class OrderExtensions
{
    public static OrderDto ToDto(this Order order)
    {
        return new OrderDto(
            order.OrderId,
            order.OrderNumber,
            order.CustomerEmail,
            order.Status.ToString(),
            order.SubTotal,
            order.Tax,
            order.ShippingCost,
            order.Total,
            order.Currency,
            new ShippingAddressDto(
                order.ShippingFullName,
                order.ShippingAddressLine1,
                order.ShippingAddressLine2,
                order.ShippingCity,
                order.ShippingState,
                order.ShippingPostalCode,
                order.ShippingCountry,
                order.ShippingPhone
            ),
            order.UseSeparateBillingAddress
                ? new BillingAddressDto(
                    order.BillingFullName!,
                    order.BillingAddressLine1!,
                    order.BillingAddressLine2,
                    order.BillingCity!,
                    order.BillingState!,
                    order.BillingPostalCode!,
                    order.BillingCountry!,
                    order.BillingPhone
                )
                : null,
            order.LineItems.Select(li => li.ToDto()).ToList(),
            order.CreatedDate,
            order.UpdatedDate
        );
    }

    public static LineItemDto ToDto(this LineItem lineItem)
    {
        return new LineItemDto(
            lineItem.LineItemId,
            lineItem.ProductId,
            lineItem.ProductName,
            lineItem.ProductSize,
            lineItem.ProductImageUrl,
            lineItem.UnitPrice,
            lineItem.Quantity,
            lineItem.SubTotal
        );
    }
}
```

---

## 6. Configuration

### 6.1 App Settings

**Add to:** `appsettings.json`

```json
{
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_...",
    "WebhookSecret": "whsec_..."
  }
}
```

### 6.2 Service Registration

**Add to:** `src/Vult.Api/ConfigureServices.cs`

```csharp
// Add Stripe service
services.AddScoped<IPaymentService, StripePaymentService>();
```

### 6.3 NuGet Package

```bash
dotnet add src/Vult.Infrastructure/Vult.Infrastructure.csproj package Stripe.net
```

---

## 7. Database Migration

```bash
# Create migration
dotnet ef migrations add AddOrdersAndLineItems \
    --project src/Vult.Infrastructure \
    --startup-project src/Vult.Api

# Apply migration
dotnet ef database update \
    --project src/Vult.Infrastructure \
    --startup-project src/Vult.Api
```

---

## 8. Testing Strategy

### 8.1 Unit Tests

| Test Class | Coverage |
|------------|----------|
| CreateOrderHandlerTests | Order creation, validation, totals |
| CreatePaymentHandlerTests | PaymentIntent creation, status updates |
| HandleWebhookHandlerTests | Webhook parsing, status transitions |
| OrderTests | CalculateTotals, CanTransitionTo |

### 8.2 Integration Tests

| Test | Description |
|------|-------------|
| CreateOrder_WithValidProducts_ReturnsOrder | End-to-end order creation |
| CreatePayment_ForPendingOrder_ReturnsClientSecret | Payment flow |
| Webhook_PaymentSucceeded_UpdatesOrderStatus | Webhook handling |

### 8.3 Stripe Testing

```bash
# Listen to webhooks locally
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

---

## 9. Frontend Integration

### 9.1 Install Stripe.js

```bash
npm install @stripe/stripe-js
```

### 9.2 Angular Service

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private stripe: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    this.stripe = loadStripe(environment.stripePublishableKey);
  }

  async processPayment(orderId: string): Promise<void> {
    // 1. Get client secret from backend
    const { clientSecret } = await this.http
      .post<{ clientSecret: string }>(`/api/orders/${orderId}/payment`, {})
      .toPromise();

    // 2. Confirm payment with Stripe
    const stripe = await this.stripe;
    const result = await stripe!.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.cardElement, // Stripe Elements card
      }
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  }
}
```

---

## 10. Deployment Checklist

- [ ] Set production Stripe API keys
- [ ] Configure webhook endpoint in Stripe Dashboard
- [ ] Set webhook signing secret
- [ ] Run database migrations
- [ ] Enable HTTPS for webhook endpoint
- [ ] Configure CORS for frontend domain
- [ ] Set up monitoring/alerting for payment failures
