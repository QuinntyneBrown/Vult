// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.CatalogItems;
using Vult.Core.Enums;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.CatalogItems;

[TestFixture]
public class CreateCatalogItemCommandHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldCreateCatalogItem_WhenValid()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new CreateCatalogItemCommandHandler(context);
        var command = new CreateCatalogItemCommand
        {
            CatalogItem = new CreateCatalogItemDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "Test Item",
                Size = "M",
                BrandName = "Nike",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.CatalogItem, Is.Not.Null);
        Assert.That(result.CatalogItem!.BrandName, Is.EqualTo("Nike"));
        Assert.That(result.Errors, Is.Empty);

        var itemInDb = await context.CatalogItems.FirstOrDefaultAsync();
        Assert.That(itemInDb, Is.Not.Null);
        Assert.That(itemInDb!.BrandName, Is.EqualTo("Nike"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenEstimatedMSRPIsZero()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new CreateCatalogItemCommandHandler(context);
        var command = new CreateCatalogItemCommand
        {
            CatalogItem = new CreateCatalogItemDto
            {
                EstimatedMSRP = 0m,
                EstimatedResaleValue = 50m,
                Description = "Test Item",
                Size = "M",
                BrandName = "Nike",
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
        var handler = new CreateCatalogItemCommandHandler(context);
        var command = new CreateCatalogItemCommand
        {
            CatalogItem = new CreateCatalogItemDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 0m,
                Description = "Test Item",
                Size = "M",
                BrandName = "Nike",
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
        var handler = new CreateCatalogItemCommandHandler(context);
        var command = new CreateCatalogItemCommand
        {
            CatalogItem = new CreateCatalogItemDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "",
                Size = "M",
                BrandName = "Nike",
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
        var handler = new CreateCatalogItemCommandHandler(context);
        var command = new CreateCatalogItemCommand
        {
            CatalogItem = new CreateCatalogItemDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = new string('a', 1001),
                Size = "M",
                BrandName = "Nike",
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
        var handler = new CreateCatalogItemCommandHandler(context);
        var command = new CreateCatalogItemCommand
        {
            CatalogItem = new CreateCatalogItemDto
            {
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "Test Item",
                Size = "",
                BrandName = "Nike",
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
        var handler = new CreateCatalogItemCommandHandler(context);
        var command = new CreateCatalogItemCommand
        {
            CatalogItem = new CreateCatalogItemDto
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
