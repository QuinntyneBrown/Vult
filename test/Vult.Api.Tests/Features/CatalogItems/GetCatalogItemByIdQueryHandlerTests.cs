// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.CatalogItems;
using Vult.Core;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.CatalogItems;

[TestFixture]
public class GetCatalogItemByIdQueryHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnCatalogItem_WhenExists()
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
            BrandName = "Adidas",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetCatalogItemByIdQueryHandler(context);
        var query = new GetCatalogItemByIdQuery(catalogItemId);

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.CatalogItem, Is.Not.Null);
        Assert.That(result.CatalogItem!.CatalogItemId, Is.EqualTo(catalogItemId));
        Assert.That(result.CatalogItem.BrandName, Is.EqualTo("Adidas"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new GetCatalogItemByIdQueryHandler(context);
        var query = new GetCatalogItemByIdQuery(Guid.NewGuid());

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.CatalogItem, Is.Null);
    }

    [Test]
    public async Task HandleAsync_ShouldIncludeImages_WhenCatalogItemHasImages()
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
            BrandName = "Puma",
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

        var handler = new GetCatalogItemByIdQueryHandler(context);
        var query = new GetCatalogItemByIdQuery(catalogItemId);

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.CatalogItem, Is.Not.Null);
        Assert.That(result.CatalogItem!.Images, Has.Count.EqualTo(1));
        Assert.That(result.CatalogItem.Images[0].CatalogItemImageId, Is.EqualTo(imageId));
    }
}
