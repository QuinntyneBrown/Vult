// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.Products;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.Products;

[TestFixture]
public class UpdateProductCommandHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldUpdateProduct_WhenValid()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var productId = Guid.NewGuid();

        var existingItem = new Product
        {
            ProductId = productId,
            EstimatedMSRP = 50m,
            EstimatedResaleValue = 25m,
            Description = "Old Description",
            Size = "S",
            BrandName = "Old Brand",
            Gender = Gender.Womens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow.AddDays(-10),
            UpdatedDate = DateTime.UtcNow.AddDays(-10)
        };

        context.Products.Add(existingItem);
        await context.SaveChangesAsync();

        var handler = new UpdateProductCommandHandler(context);
        var command = new UpdateProductCommand
        {
            Product = new UpdateProductDto
            {
                ProductId = productId,
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "New Description",
                Size = "M",
                BrandName = "Adidas",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.Product, Is.Not.Null);
        Assert.That(result.Product!.BrandName, Is.EqualTo("Adidas"));
        Assert.That(result.Product.EstimatedMSRP, Is.EqualTo(100m));
        Assert.That(result.Errors, Is.Empty);

        var itemInDb = await context.Products.FirstOrDefaultAsync(x => x.ProductId == productId);
        Assert.That(itemInDb, Is.Not.Null);
        Assert.That(itemInDb!.BrandName, Is.EqualTo("Adidas"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenProductNotFound()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UpdateProductCommandHandler(context);
        var command = new UpdateProductCommand
        {
            Product = new UpdateProductDto
            {
                ProductId = Guid.NewGuid(),
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "Test Item",
                Size = "M",
                BrandName = "Adidas",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Product not found"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenProductIdIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UpdateProductCommandHandler(context);
        var command = new UpdateProductCommand
        {
            Product = new UpdateProductDto
            {
                ProductId = Guid.Empty,
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "Test Item",
                Size = "M",
                BrandName = "Adidas",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("ProductId is required"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenEstimatedMSRPIsZero()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var productId = Guid.NewGuid();

        context.Products.Add(new Product
        {
            ProductId = productId,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Test Item",
            Size = "M",
            BrandName = "Adidas",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var handler = new UpdateProductCommandHandler(context);
        var command = new UpdateProductCommand
        {
            Product = new UpdateProductDto
            {
                ProductId = productId,
                EstimatedMSRP = 0m,
                EstimatedResaleValue = 50m,
                Description = "Test Item",
                Size = "M",
                BrandName = "Adidas",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Estimated MSRP must be greater than 0"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenDescriptionIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var productId = Guid.NewGuid();

        context.Products.Add(new Product
        {
            ProductId = productId,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Test Item",
            Size = "M",
            BrandName = "Adidas",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var handler = new UpdateProductCommandHandler(context);
        var command = new UpdateProductCommand
        {
            Product = new UpdateProductDto
            {
                ProductId = productId,
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "",
                Size = "M",
                BrandName = "Adidas",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Description is required"));
    }
}
