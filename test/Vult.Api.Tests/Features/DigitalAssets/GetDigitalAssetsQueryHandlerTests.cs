// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.DigitalAssets;
using Vult.Core.Model.DigitalAssetAggregate;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.DigitalAssets;

[TestFixture]
public class GetDigitalAssetsQueryHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnPagedResults()
    {
        // Arrange
        await using var context = GetInMemoryContext();

        for (int i = 0; i < 15; i++)
        {
            context.DigitalAssets.Add(new DigitalAsset
            {
                DigitalAssetId = Guid.NewGuid(),
                Name = $"image-{i}.jpg",
                Bytes = new byte[] { 0xFF, 0xD8, 0xFF },
                ContentType = "image/jpeg",
                Height = 800f,
                Width = 1200f,
                CreatedDate = DateTime.UtcNow.AddMinutes(-i)
            });
        }

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetsQueryHandler(context);
        var query = new GetDigitalAssetsQuery
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
    public async Task HandleAsync_ShouldReturnSecondPage()
    {
        // Arrange
        await using var context = GetInMemoryContext();

        for (int i = 0; i < 15; i++)
        {
            context.DigitalAssets.Add(new DigitalAsset
            {
                DigitalAssetId = Guid.NewGuid(),
                Name = $"image-{i}.jpg",
                Bytes = new byte[] { 0xFF, 0xD8, 0xFF },
                ContentType = "image/jpeg",
                Height = 800f,
                Width = 1200f,
                CreatedDate = DateTime.UtcNow.AddMinutes(-i)
            });
        }

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetsQueryHandler(context);
        var query = new GetDigitalAssetsQuery
        {
            PageNumber = 2,
            PageSize = 10
        };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(5));
        Assert.That(result.TotalCount, Is.EqualTo(15));
        Assert.That(result.PageNumber, Is.EqualTo(2));
    }

    [Test]
    public async Task HandleAsync_ShouldSortByNameAscending()
    {
        // Arrange
        await using var context = GetInMemoryContext();

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = "zebra.jpg",
            Bytes = new byte[] { 0xFF },
            ContentType = "image/jpeg",
            CreatedDate = DateTime.UtcNow
        });

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = "apple.jpg",
            Bytes = new byte[] { 0xFF },
            ContentType = "image/jpeg",
            CreatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetsQueryHandler(context);
        var query = new GetDigitalAssetsQuery
        {
            SortBy = "name"
        };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(2));
        Assert.That(result.Items[0].Name, Is.EqualTo("apple.jpg"));
        Assert.That(result.Items[1].Name, Is.EqualTo("zebra.jpg"));
    }

    [Test]
    public async Task HandleAsync_ShouldSortByDateDescending()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var olderDate = DateTime.UtcNow.AddDays(-1);
        var newerDate = DateTime.UtcNow;

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = "older.jpg",
            Bytes = new byte[] { 0xFF },
            ContentType = "image/jpeg",
            CreatedDate = olderDate
        });

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = "newer.jpg",
            Bytes = new byte[] { 0xFF },
            ContentType = "image/jpeg",
            CreatedDate = newerDate
        });

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetsQueryHandler(context);
        var query = new GetDigitalAssetsQuery
        {
            SortBy = "date_desc"
        };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Has.Count.EqualTo(2));
        Assert.That(result.Items[0].Name, Is.EqualTo("newer.jpg"));
        Assert.That(result.Items[1].Name, Is.EqualTo("older.jpg"));
    }

    [Test]
    public async Task HandleAsync_ShouldNotIncludeBytes_InListResponse()
    {
        // Arrange
        await using var context = GetInMemoryContext();

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = "test.jpg",
            Bytes = new byte[] { 0xFF, 0xD8, 0xFF },
            ContentType = "image/jpeg",
            Height = 100f,
            Width = 100f,
            CreatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetsQueryHandler(context);
        var query = new GetDigitalAssetsQuery();

        // Act
        var result = await handler.Handle(query, default);

        // Assert - DigitalAssetDto doesn't have Bytes property
        Assert.That(result.Items, Has.Count.EqualTo(1));
        Assert.That(result.Items[0], Is.TypeOf<DigitalAssetDto>());
    }

    [Test]
    public async Task HandleAsync_ShouldReturnEmpty_WhenNoAssets()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new GetDigitalAssetsQueryHandler(context);
        var query = new GetDigitalAssetsQuery();

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Items, Is.Empty);
        Assert.That(result.TotalCount, Is.EqualTo(0));
        Assert.That(result.TotalPages, Is.EqualTo(0));
    }
}
