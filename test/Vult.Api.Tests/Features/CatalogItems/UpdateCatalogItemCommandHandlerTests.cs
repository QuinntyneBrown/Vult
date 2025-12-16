// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.CatalogItems;
using Vult.Core.Enums;
using Vult.Core.Models;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.CatalogItems;

[TestFixture]
public class UpdateCatalogItemCommandHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldUpdateCatalogItem_WhenValid()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var catalogItemId = Guid.NewGuid();
        
        var existingItem = new CatalogItem
        {
            CatalogItemId = catalogItemId,
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

        context.CatalogItems.Add(existingItem);
        await context.SaveChangesAsync();

        var handler = new UpdateCatalogItemCommandHandler(context);
        var command = new UpdateCatalogItemCommand
        {
            CatalogItem = new UpdateCatalogItemDto
            {
                CatalogItemId = catalogItemId,
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 50m,
                Description = "New Description",
                Size = "M",
                BrandName = "Nike",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe
            }
        };

        // Act
        var result = await handler.HandleAsync(command);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.CatalogItem, Is.Not.Null);
        Assert.That(result.CatalogItem!.BrandName, Is.EqualTo("Nike"));
        Assert.That(result.CatalogItem.EstimatedMSRP, Is.EqualTo(100m));
        Assert.That(result.Errors, Is.Empty);

        var itemInDb = await context.CatalogItems.FirstOrDefaultAsync(x => x.CatalogItemId == catalogItemId);
        Assert.That(itemInDb, Is.Not.Null);
        Assert.That(itemInDb!.BrandName, Is.EqualTo("Nike"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenCatalogItemNotFound()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UpdateCatalogItemCommandHandler(context);
        var command = new UpdateCatalogItemCommand
        {
            CatalogItem = new UpdateCatalogItemDto
            {
                CatalogItemId = Guid.NewGuid(),
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
        var result = await handler.HandleAsync(command);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Catalog item not found"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenCatalogItemIdIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UpdateCatalogItemCommandHandler(context);
        var command = new UpdateCatalogItemCommand
        {
            CatalogItem = new UpdateCatalogItemDto
            {
                CatalogItemId = Guid.Empty,
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
        var result = await handler.HandleAsync(command);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("CatalogItemId is required"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenEstimatedMSRPIsZero()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var catalogItemId = Guid.NewGuid();
        
        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = catalogItemId,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Test Item",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var handler = new UpdateCatalogItemCommandHandler(context);
        var command = new UpdateCatalogItemCommand
        {
            CatalogItem = new UpdateCatalogItemDto
            {
                CatalogItemId = catalogItemId,
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
        var result = await handler.HandleAsync(command);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Estimated MSRP must be greater than 0"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenDescriptionIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var catalogItemId = Guid.NewGuid();
        
        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = catalogItemId,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Test Item",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var handler = new UpdateCatalogItemCommandHandler(context);
        var command = new UpdateCatalogItemCommand
        {
            CatalogItem = new UpdateCatalogItemDto
            {
                CatalogItemId = catalogItemId,
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
        var result = await handler.HandleAsync(command);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Description is required"));
    }
}
