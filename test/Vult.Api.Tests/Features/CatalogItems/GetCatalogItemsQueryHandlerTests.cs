// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.CatalogItems;
using Vult.Core;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.CatalogItems;

[TestFixture]
public class GetCatalogItemsQueryHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnPaginatedResults()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        for (int i = 0; i < 15; i++)
        {
            context.CatalogItems.Add(new CatalogItem
            {
                CatalogItemId = Guid.NewGuid(),
                EstimatedMSRP = 100m + i,
                EstimatedResaleValue = 50m + i,
                Description = $"Item {i}",
                Size = "M",
                BrandName = "Nike",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe,
                CreatedDate = DateTime.UtcNow.AddDays(-i),
                UpdatedDate = DateTime.UtcNow.AddDays(-i)
            });
        }
        await context.SaveChangesAsync();

        var handler = new GetCatalogItemsQueryHandler(context);
        var query = new GetCatalogItemsQuery
        {
            PageNumber = 1,
            PageSize = 10
        };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(10));
        Assert.That(result.TotalCount, Is.EqualTo(15));
        Assert.That(result.PageNumber, Is.EqualTo(1));
        Assert.That(result.PageSize, Is.EqualTo(10));
        Assert.That(result.TotalPages, Is.EqualTo(2));
    }

    [Test]
    public async Task HandleAsync_ShouldFilterByBrand()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Nike Item",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 120m,
            EstimatedResaleValue = 60m,
            Description = "Adidas Item",
            Size = "M",
            BrandName = "Adidas",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetCatalogItemsQueryHandler(context);
        var query = new GetCatalogItemsQuery
        {
            BrandName = "Nike"
        };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(1));
        Assert.That(result.Items[0].BrandName, Is.EqualTo("Nike"));
    }

    [Test]
    public async Task HandleAsync_ShouldFilterByItemType()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Shoe",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 120m,
            EstimatedResaleValue = 60m,
            Description = "Shirt",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetCatalogItemsQueryHandler(context);
        var query = new GetCatalogItemsQuery
        {
            ItemType = ItemType.Shoe
        };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(1));
        Assert.That(result.Items[0].ItemType, Is.EqualTo(ItemType.Shoe));
    }

    [Test]
    public async Task HandleAsync_ShouldFilterByGender()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Mens Item",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 120m,
            EstimatedResaleValue = 60m,
            Description = "Womens Item",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Womens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetCatalogItemsQueryHandler(context);
        var query = new GetCatalogItemsQuery
        {
            Gender = Gender.Mens
        };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(1));
        Assert.That(result.Items[0].Gender, Is.EqualTo(Gender.Mens));
    }

    [Test]
    public async Task HandleAsync_ShouldSortByPriceAscending()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 150m,
            EstimatedResaleValue = 75m,
            Description = "Expensive",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 50m,
            EstimatedResaleValue = 25m,
            Description = "Cheap",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetCatalogItemsQueryHandler(context);
        var query = new GetCatalogItemsQuery
        {
            SortBy = "price"
        };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(2));
        Assert.That(result.Items[0].EstimatedMSRP, Is.EqualTo(50m));
        Assert.That(result.Items[1].EstimatedMSRP, Is.EqualTo(150m));
    }

    [Test]
    public async Task HandleAsync_ShouldSortByPriceDescending()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 50m,
            EstimatedResaleValue = 25m,
            Description = "Cheap",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 150m,
            EstimatedResaleValue = 75m,
            Description = "Expensive",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetCatalogItemsQueryHandler(context);
        var query = new GetCatalogItemsQuery
        {
            SortBy = "price_desc"
        };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(2));
        Assert.That(result.Items[0].EstimatedMSRP, Is.EqualTo(150m));
        Assert.That(result.Items[1].EstimatedMSRP, Is.EqualTo(50m));
    }

    [Test]
    public async Task HandleAsync_ShouldSortByDateDescendingByDefault()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var oldDate = DateTime.UtcNow.AddDays(-5);
        var newDate = DateTime.UtcNow;

        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Old Item",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = oldDate,
            UpdatedDate = oldDate
        });

        context.CatalogItems.Add(new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 120m,
            EstimatedResaleValue = 60m,
            Description = "New Item",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = newDate,
            UpdatedDate = newDate
        });

        await context.SaveChangesAsync();

        var handler = new GetCatalogItemsQueryHandler(context);
        var query = new GetCatalogItemsQuery();

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(2));
        Assert.That(result.Items[0].Description, Is.EqualTo("New Item"));
        Assert.That(result.Items[1].Description, Is.EqualTo("Old Item"));
    }
}
