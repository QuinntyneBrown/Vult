// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Model.DigitalAssetAggregate;

namespace Vult.Core.Tests.Models;

[TestFixture]
public class DigitalAssetTests
{
    [Test]
    public void DigitalAsset_DefaultValues_AreSetCorrectly()
    {
        // Arrange & Act
        var asset = new DigitalAsset();

        // Assert
        Assert.That(asset.DigitalAssetId, Is.EqualTo(Guid.Empty));
        Assert.That(asset.Name, Is.EqualTo(string.Empty));
        Assert.That(asset.Bytes, Is.EqualTo(Array.Empty<byte>()));
        Assert.That(asset.ContentType, Is.EqualTo(string.Empty));
        Assert.That(asset.Height, Is.EqualTo(0f));
        Assert.That(asset.Width, Is.EqualTo(0f));
    }

    [Test]
    public void DigitalAsset_SetDigitalAssetId_StoresValue()
    {
        // Arrange & Act
        var asset = new DigitalAsset();
        var id = Guid.NewGuid();
        asset.DigitalAssetId = id;

        // Assert
        Assert.That(asset.DigitalAssetId, Is.EqualTo(id));
    }

    [Test]
    public void DigitalAsset_SetName_StoresValue()
    {
        // Arrange & Act
        var asset = new DigitalAsset { Name = "test-image.jpg" };

        // Assert
        Assert.That(asset.Name, Is.EqualTo("test-image.jpg"));
    }

    [Test]
    public void DigitalAsset_SetBytes_StoresValue()
    {
        // Arrange
        var bytes = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 }; // JPEG magic bytes

        // Act
        var asset = new DigitalAsset { Bytes = bytes };

        // Assert
        Assert.That(asset.Bytes, Is.EqualTo(bytes));
        Assert.That(asset.Bytes.Length, Is.EqualTo(4));
    }

    [Test]
    public void DigitalAsset_SetContentType_StoresValue()
    {
        // Arrange & Act
        var asset = new DigitalAsset { ContentType = "image/jpeg" };

        // Assert
        Assert.That(asset.ContentType, Is.EqualTo("image/jpeg"));
    }

    [Test]
    public void DigitalAsset_SetHeight_StoresValue()
    {
        // Arrange & Act
        var asset = new DigitalAsset { Height = 800.5f };

        // Assert
        Assert.That(asset.Height, Is.EqualTo(800.5f));
    }

    [Test]
    public void DigitalAsset_SetWidth_StoresValue()
    {
        // Arrange & Act
        var asset = new DigitalAsset { Width = 1200.25f };

        // Assert
        Assert.That(asset.Width, Is.EqualTo(1200.25f));
    }

    [Test]
    public void DigitalAsset_SetDimensions_StoresBothValues()
    {
        // Arrange & Act
        var asset = new DigitalAsset
        {
            Width = 1920f,
            Height = 1080f
        };

        // Assert
        Assert.That(asset.Width, Is.EqualTo(1920f));
        Assert.That(asset.Height, Is.EqualTo(1080f));
    }

    [Test]
    public void DigitalAsset_SetCreatedDate_StoresValue()
    {
        // Arrange & Act
        var asset = new DigitalAsset();
        var now = DateTime.UtcNow;
        asset.CreatedDate = now;

        // Assert
        Assert.That(asset.CreatedDate, Is.EqualTo(now));
    }

    [Test]
    public void DigitalAsset_SetAllProperties_StoresAllValues()
    {
        // Arrange
        var id = Guid.NewGuid();
        var bytes = new byte[] { 1, 2, 3, 4, 5 };
        var now = DateTime.UtcNow;

        // Act
        var asset = new DigitalAsset
        {
            DigitalAssetId = id,
            Name = "product-photo.png",
            Bytes = bytes,
            ContentType = "image/png",
            Height = 600f,
            Width = 800f,
            CreatedDate = now
        };

        // Assert
        Assert.That(asset.DigitalAssetId, Is.EqualTo(id));
        Assert.That(asset.Name, Is.EqualTo("product-photo.png"));
        Assert.That(asset.Bytes, Is.EqualTo(bytes));
        Assert.That(asset.ContentType, Is.EqualTo("image/png"));
        Assert.That(asset.Height, Is.EqualTo(600f));
        Assert.That(asset.Width, Is.EqualTo(800f));
        Assert.That(asset.CreatedDate, Is.EqualTo(now));
    }

    [Test]
    public void DigitalAsset_BytesCanBeLarge()
    {
        // Arrange
        var largeBytes = new byte[1024 * 1024]; // 1MB
        for (int i = 0; i < largeBytes.Length; i++)
        {
            largeBytes[i] = (byte)(i % 256);
        }

        // Act
        var asset = new DigitalAsset { Bytes = largeBytes };

        // Assert
        Assert.That(asset.Bytes.Length, Is.EqualTo(1024 * 1024));
    }
}
