// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.Products;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.Products;

[TestFixture]
public class CreateProductCommandHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldCreateProduct_WhenValid()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new CreateProductCommandHandler(context);
        var command = new CreateProductCommand
        {
            Product = new CreateProductDto
            {
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
        Assert.That(result.Success, Is.True);
        Assert.That(result.Product, Is.Not.Null);
        Assert.That(result.Product!.BrandName, Is.EqualTo("Adidas"));
        Assert.That(result.Errors, Is.Empty);

        var itemInDb = await context.Products.FirstOrDefaultAsync();
        Assert.That(itemInDb, Is.Not.Null);
        Assert.That(itemInDb!.BrandName, Is.EqualTo("Adidas"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenEstimatedMSRPIsZero()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new CreateProductCommandHandler(context);
        var command = new CreateProductCommand
        {
            Product = new CreateProductDto
            {
                EstimatedMSRP = 0m,
                EstimatedResaleValue = 50m,
                Description = "Test Item",
                Size = "M",
                BrandName = "Puma",
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
    public async Task HandleAsync_ShouldReturnError_WhenEstimatedResaleValueIsZero()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new CreateProductCommandHandler(context);
        var command = new CreateProductCommand
        {
            Product = new CreateProductDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 0m,
                Description = "Test Item",
                Size = "M",
                BrandName = "Reebok",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Estimated Resale Value must be greater than 0"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenDescriptionIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new CreateProductCommandHandler(context);
        var command = new CreateProductCommand
        {
            Product = new CreateProductDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "",
                Size = "M",
                BrandName = "New Balance",
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

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenDescriptionIsTooLong()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new CreateProductCommandHandler(context);
        var command = new CreateProductCommand
        {
            Product = new CreateProductDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = new string('a', 1001),
                Size = "M",
                BrandName = "Under Armour",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Description cannot exceed 1000 characters"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenSizeIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new CreateProductCommandHandler(context);
        var command = new CreateProductCommand
        {
            Product = new CreateProductDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "Test Item",
                Size = "",
                BrandName = "Converse",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Size is required"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenBrandNameIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new CreateProductCommandHandler(context);
        var command = new CreateProductCommand
        {
            Product = new CreateProductDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "Test Item",
                Size = "M",
                BrandName = "",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Brand Name is required"));
    }
}
