// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Api.Features.DigitalAssets;
using Vult.Core.Model.DigitalAssetAggregate;

namespace Vult.Api.Tests.Features.DigitalAssets;

[TestFixture]
public class DigitalAssetExtensionsTests
{
    [Test]
    public void ToDto_ShouldMapAllProperties()
    {
        // Arrange
        var assetId = Guid.NewGuid();
        var createdDate = DateTime.UtcNow;

        var asset = new DigitalAsset
        {
            DigitalAssetId = assetId,
            Name = "test-image.jpg",
            Bytes = new byte[] { 0xFF, 0xD8, 0xFF },
            ContentType = "image/jpeg",
            Height = 800f,
            Width = 1200f,
            CreatedDate = createdDate
        };

        // Act
        var dto = asset.ToDto();

        // Assert
        Assert.That(dto.DigitalAssetId, Is.EqualTo(assetId));
        Assert.That(dto.Name, Is.EqualTo("test-image.jpg"));
        Assert.That(dto.ContentType, Is.EqualTo("image/jpeg"));
        Assert.That(dto.Height, Is.EqualTo(800f));
        Assert.That(dto.Width, Is.EqualTo(1200f));
        Assert.That(dto.CreatedDate, Is.EqualTo(createdDate));
    }

    [Test]
    public void ToDto_ShouldNotIncludeBytes()
    {
        // Arrange
        var asset = new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = "test-image.jpg",
            Bytes = new byte[] { 0xFF, 0xD8, 0xFF },
            ContentType = "image/jpeg",
            Height = 800f,
            Width = 1200f,
            CreatedDate = DateTime.UtcNow
        };

        // Act
        var dto = asset.ToDto();

        // Assert - DigitalAssetDto does not have a Bytes property
        Assert.That(dto, Is.TypeOf<DigitalAssetDto>());
        Assert.That(dto, Is.Not.TypeOf<DigitalAssetWithBytesDto>());
    }

    [Test]
    public void ToDtoWithBytes_ShouldMapAllProperties()
    {
        // Arrange
        var assetId = Guid.NewGuid();
        var createdDate = DateTime.UtcNow;
        var bytes = new byte[] { 0xFF, 0xD8, 0xFF };

        var asset = new DigitalAsset
        {
            DigitalAssetId = assetId,
            Name = "test-image.jpg",
            Bytes = bytes,
            ContentType = "image/jpeg",
            Height = 800f,
            Width = 1200f,
            CreatedDate = createdDate
        };

        // Act
        var dto = asset.ToDtoWithBytes();

        // Assert
        Assert.That(dto.DigitalAssetId, Is.EqualTo(assetId));
        Assert.That(dto.Name, Is.EqualTo("test-image.jpg"));
        Assert.That(dto.ContentType, Is.EqualTo("image/jpeg"));
        Assert.That(dto.Height, Is.EqualTo(800f));
        Assert.That(dto.Width, Is.EqualTo(1200f));
        Assert.That(dto.CreatedDate, Is.EqualTo(createdDate));
        Assert.That(dto.Bytes, Is.EqualTo(bytes));
    }

    [Test]
    public void ToDtoWithBytes_ShouldIncludeBytes()
    {
        // Arrange
        var bytes = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
        var asset = new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = "test-image.png",
            Bytes = bytes,
            ContentType = "image/png",
            Height = 100f,
            Width = 100f,
            CreatedDate = DateTime.UtcNow
        };

        // Act
        var dto = asset.ToDtoWithBytes();

        // Assert
        Assert.That(dto, Is.TypeOf<DigitalAssetWithBytesDto>());
        Assert.That(dto.Bytes, Is.EqualTo(bytes));
        Assert.That(dto.Bytes.Length, Is.EqualTo(8));
    }

    [Test]
    public void ToDtoWithBytes_ShouldHandleEmptyBytes()
    {
        // Arrange
        var asset = new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = "empty.jpg",
            Bytes = Array.Empty<byte>(),
            ContentType = "image/jpeg",
            Height = 0f,
            Width = 0f,
            CreatedDate = DateTime.UtcNow
        };

        // Act
        var dto = asset.ToDtoWithBytes();

        // Assert
        Assert.That(dto.Bytes, Is.Empty);
    }

    [Test]
    public void ToDto_ShouldHandleDefaultValues()
    {
        // Arrange
        var asset = new DigitalAsset();

        // Act
        var dto = asset.ToDto();

        // Assert
        Assert.That(dto.DigitalAssetId, Is.EqualTo(Guid.Empty));
        Assert.That(dto.Name, Is.EqualTo(string.Empty));
        Assert.That(dto.ContentType, Is.EqualTo(string.Empty));
        Assert.That(dto.Height, Is.EqualTo(0f));
        Assert.That(dto.Width, Is.EqualTo(0f));
    }
}
