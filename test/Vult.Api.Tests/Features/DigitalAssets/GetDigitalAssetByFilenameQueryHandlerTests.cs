// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.DigitalAssets;
using Vult.Core.Model.DigitalAssetAggregate;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.DigitalAssets;

[TestFixture]
public class GetDigitalAssetByFilenameQueryHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnDigitalAsset_WhenFilenameMatches()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var assetId = Guid.NewGuid();

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = assetId,
            Name = "product-image.jpg",
            Bytes = new byte[] { 0xFF, 0xD8, 0xFF },
            ContentType = "image/jpeg",
            Height = 800f,
            Width = 1200f,
            CreatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetByFilenameQueryHandler(context);
        var query = new GetDigitalAssetByFilenameQuery("product-image.jpg");

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.DigitalAsset, Is.Not.Null);
        Assert.That(result.DigitalAsset!.DigitalAssetId, Is.EqualTo(assetId));
        Assert.That(result.DigitalAsset.Name, Is.EqualTo("product-image.jpg"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnNull_WhenFilenameNotFound()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new GetDigitalAssetByFilenameQueryHandler(context);
        var query = new GetDigitalAssetByFilenameQuery("non-existent.jpg");

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.DigitalAsset, Is.Null);
    }

    [Test]
    public async Task HandleAsync_ShouldBeCaseInsensitive()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var assetId = Guid.NewGuid();

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = assetId,
            Name = "Product-Image.JPG",
            Bytes = new byte[] { 0xFF, 0xD8, 0xFF },
            ContentType = "image/jpeg",
            Height = 800f,
            Width = 1200f,
            CreatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetByFilenameQueryHandler(context);
        var query = new GetDigitalAssetByFilenameQuery("product-image.jpg");

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.DigitalAsset, Is.Not.Null);
        Assert.That(result.DigitalAsset!.DigitalAssetId, Is.EqualTo(assetId));
    }

    [Test]
    public async Task HandleAsync_ShouldIncludeBytes_InResult()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var assetId = Guid.NewGuid();
        var bytes = new byte[] { 0x89, 0x50, 0x4E, 0x47 };

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = assetId,
            Name = "test.png",
            Bytes = bytes,
            ContentType = "image/png",
            Height = 100f,
            Width = 100f,
            CreatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetByFilenameQueryHandler(context);
        var query = new GetDigitalAssetByFilenameQuery("test.png");

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.DigitalAsset, Is.Not.Null);
        Assert.That(result.DigitalAsset!.Bytes, Is.EqualTo(bytes));
    }
}
