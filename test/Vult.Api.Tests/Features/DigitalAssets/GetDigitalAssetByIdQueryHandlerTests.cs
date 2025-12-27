// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.DigitalAssets;
using Vult.Core.Model.DigitalAssetAggregate;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.DigitalAssets;

[TestFixture]
public class GetDigitalAssetByIdQueryHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnDigitalAsset_WhenExists()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var assetId = Guid.NewGuid();

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = assetId,
            Name = "test-image.jpg",
            Bytes = new byte[] { 0xFF, 0xD8, 0xFF },
            ContentType = "image/jpeg",
            Height = 800f,
            Width = 1200f,
            CreatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetByIdQueryHandler(context);
        var query = new GetDigitalAssetByIdQuery(assetId);

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.DigitalAsset, Is.Not.Null);
        Assert.That(result.DigitalAsset!.DigitalAssetId, Is.EqualTo(assetId));
        Assert.That(result.DigitalAsset.Name, Is.EqualTo("test-image.jpg"));
        Assert.That(result.DigitalAsset.ContentType, Is.EqualTo("image/jpeg"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new GetDigitalAssetByIdQueryHandler(context);
        var query = new GetDigitalAssetByIdQuery(Guid.NewGuid());

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.DigitalAsset, Is.Null);
    }

    [Test]
    public async Task HandleAsync_ShouldIncludeBytes_InResult()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var assetId = Guid.NewGuid();
        var bytes = new byte[] { 0x89, 0x50, 0x4E, 0x47 }; // PNG magic bytes

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = assetId,
            Name = "test-image.png",
            Bytes = bytes,
            ContentType = "image/png",
            Height = 100f,
            Width = 100f,
            CreatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new GetDigitalAssetByIdQueryHandler(context);
        var query = new GetDigitalAssetByIdQuery(assetId);

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.DigitalAsset, Is.Not.Null);
        Assert.That(result.DigitalAsset!.Bytes, Is.EqualTo(bytes));
    }
}
