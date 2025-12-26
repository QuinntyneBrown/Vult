// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.CatalogItems;
using Vult.Core;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.CatalogItems;

[TestFixture]
public class DeleteCatalogItemCommandHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldDeleteCatalogItem_WhenExists()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var catalogItemId = Guid.NewGuid();

        var catalogItem = new CatalogItem
        {
            CatalogItemId = catalogItemId,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Test Item",
            Size = "M",
            BrandName = "Adidas",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        context.CatalogItems.Add(catalogItem);
        await context.SaveChangesAsync();

        var handler = new DeleteCatalogItemCommandHandler(context);
        var command = new DeleteCatalogItemCommand(catalogItemId);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.Errors, Is.Empty);

        var itemInDb = await context.CatalogItems.FirstOrDefaultAsync(x => x.CatalogItemId == catalogItemId);
        Assert.That(itemInDb, Is.Null);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenCatalogItemNotFound()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new DeleteCatalogItemCommandHandler(context);
        var command = new DeleteCatalogItemCommand(Guid.NewGuid());

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Catalog item not found"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenCatalogItemIdIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new DeleteCatalogItemCommandHandler(context);
        var command = new DeleteCatalogItemCommand(Guid.Empty);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("CatalogItemId is required"));
    }

    [Test]
    public async Task HandleAsync_ShouldDeleteCatalogItemAndImages_WhenHasImages()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var catalogItemId = Guid.NewGuid();
        var imageId = Guid.NewGuid();
        
        var catalogItem = new CatalogItem
        {
            CatalogItemId = catalogItemId,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Test Item",
            Size = "M",
            BrandName = "Reebok",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var image = new CatalogItemImage
        {
            CatalogItemImageId = imageId,
            CatalogItemId = catalogItemId,
            ImageData = new byte[] { 1, 2, 3 },
            Description = "Test Image",
            CreatedDate = DateTime.UtcNow
        };

        context.CatalogItems.Add(catalogItem);
        context.CatalogItemImages.Add(image);
        await context.SaveChangesAsync();

        var handler = new DeleteCatalogItemCommandHandler(context);
        var command = new DeleteCatalogItemCommand(catalogItemId);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.Errors, Is.Empty);

        var itemInDb = await context.CatalogItems.FirstOrDefaultAsync(x => x.CatalogItemId == catalogItemId);
        Assert.That(itemInDb, Is.Null);

        // Due to cascade delete, images should also be removed
        var imageInDb = await context.CatalogItemImages.FirstOrDefaultAsync(x => x.CatalogItemImageId == imageId);
        Assert.That(imageInDb, Is.Null);
    }
}
