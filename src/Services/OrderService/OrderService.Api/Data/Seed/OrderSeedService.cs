// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using OrderService.Api.Model;

namespace OrderService.Api.Data.Seed;

public interface IOrderSeedService
{
    Task SeedAsync(CancellationToken cancellationToken = default);
}

public class OrderSeedService : IOrderSeedService
{
    private readonly OrderDbContext _context;
    private readonly ILogger<OrderSeedService> _logger;

    public OrderSeedService(OrderDbContext context, ILogger<OrderSeedService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _context.Orders.AnyAsync(cancellationToken))
        {
            _logger.LogInformation("Database already seeded, skipping...");
            return;
        }

        _logger.LogInformation("Seeding order database...");

        var orders = new List<Order>
        {
            new Order
            {
                OrderId = Guid.NewGuid(),
                OrderNumber = Order.GenerateOrderNumber(),
                CustomerEmail = "john.doe@example.com",
                Status = OrderStatus.Delivered,
                SubTotal = 310.00m,
                Tax = 24.80m,
                ShippingCost = 0m,
                Total = 334.80m,
                Currency = "USD",
                ShippingFullName = "John Doe",
                ShippingAddressLine1 = "123 Main Street",
                ShippingCity = "New York",
                ShippingProvince = "NY",
                ShippingPostalCode = "10001",
                ShippingCountry = "USA",
                ShippingPhone = "+1-555-123-4567",
                CreatedDate = DateTime.UtcNow.AddDays(-14),
                UpdatedDate = DateTime.UtcNow.AddDays(-7),
                LineItems = new List<LineItem>
                {
                    new LineItem
                    {
                        LineItemId = Guid.NewGuid(),
                        ProductId = Guid.NewGuid(),
                        ProductName = "Nike Air Max 90",
                        ProductSize = "10",
                        UnitPrice = 130.00m,
                        Quantity = 1
                    },
                    new LineItem
                    {
                        LineItemId = Guid.NewGuid(),
                        ProductId = Guid.NewGuid(),
                        ProductName = "Jordan 1 Retro High OG",
                        ProductSize = "10",
                        UnitPrice = 180.00m,
                        Quantity = 1
                    }
                }
            },
            new Order
            {
                OrderId = Guid.NewGuid(),
                OrderNumber = Order.GenerateOrderNumber(),
                CustomerEmail = "jane.smith@example.com",
                Status = OrderStatus.Processing,
                SubTotal = 190.00m,
                Tax = 15.20m,
                ShippingCost = 9.99m,
                Total = 215.19m,
                Currency = "USD",
                ShippingFullName = "Jane Smith",
                ShippingAddressLine1 = "456 Oak Avenue",
                ShippingAddressLine2 = "Apt 2B",
                ShippingCity = "Los Angeles",
                ShippingProvince = "CA",
                ShippingPostalCode = "90001",
                ShippingCountry = "USA",
                ShippingPhone = "+1-555-987-6543",
                CreatedDate = DateTime.UtcNow.AddDays(-2),
                UpdatedDate = DateTime.UtcNow,
                LineItems = new List<LineItem>
                {
                    new LineItem
                    {
                        LineItemId = Guid.NewGuid(),
                        ProductId = Guid.NewGuid(),
                        ProductName = "Adidas Ultraboost 22",
                        ProductSize = "9.5",
                        UnitPrice = 190.00m,
                        Quantity = 1
                    }
                }
            }
        };

        await _context.Orders.AddRangeAsync(orders, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} orders", orders.Count);
    }
}
