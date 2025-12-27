// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.DigitalAssets;
using Vult.Core.Model.DigitalAssetAggregate;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.DigitalAssets;

[TestFixture]
public class DeleteDigitalAssetCommandHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldDeleteDigitalAsset_WhenExists()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var assetId = Guid.NewGuid();

        var asset = new DigitalAsset
        {
            DigitalAssetId = assetId,
            Name = "test-image.jpg",
            Bytes = new byte[] { 0xFF, 0xD8, 0xFF },
            ContentType = "image/jpeg",
            Height = 800f,
            Width = 1200f,
            CreatedDate = DateTime.UtcNow
        };

        context.DigitalAssets.Add(asset);
        await context.SaveChangesAsync();

        var handler = new DeleteDigitalAssetCommandHandler(context);
        var command = new DeleteDigitalAssetCommand(assetId);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.Errors, Is.Empty);

        var assetInDb = await context.DigitalAssets.FirstOrDefaultAsync(x => x.DigitalAssetId == assetId);
        Assert.That(assetInDb, Is.Null);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenDigitalAssetNotFound()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new DeleteDigitalAssetCommandHandler(context);
        var command = new DeleteDigitalAssetCommand(Guid.NewGuid());

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Digital asset not found"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenDigitalAssetIdIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new DeleteDigitalAssetCommandHandler(context);
        var command = new DeleteDigitalAssetCommand(Guid.Empty);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("DigitalAssetId is required"));
    }

    [Test]
    public async Task HandleAsync_ShouldNotAffectOtherAssets_WhenDeleting()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var assetIdToDelete = Guid.NewGuid();
        var assetIdToKeep = Guid.NewGuid();

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = assetIdToDelete,
            Name = "to-delete.jpg",
            Bytes = new byte[] { 0xFF },
            ContentType = "image/jpeg",
            CreatedDate = DateTime.UtcNow
        });

        context.DigitalAssets.Add(new DigitalAsset
        {
            DigitalAssetId = assetIdToKeep,
            Name = "to-keep.jpg",
            Bytes = new byte[] { 0xFF },
            ContentType = "image/jpeg",
            CreatedDate = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var handler = new DeleteDigitalAssetCommandHandler(context);
        var command = new DeleteDigitalAssetCommand(assetIdToDelete);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);

        var deletedAsset = await context.DigitalAssets.FirstOrDefaultAsync(x => x.DigitalAssetId == assetIdToDelete);
        var keptAsset = await context.DigitalAssets.FirstOrDefaultAsync(x => x.DigitalAssetId == assetIdToKeep);

        Assert.That(deletedAsset, Is.Null);
        Assert.That(keptAsset, Is.Not.Null);
    }
}
