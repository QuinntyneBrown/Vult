// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Models;

namespace Vult.Core.Tests.Models;

[TestFixture]
public class CatalogItemImageTests
{
    [Test]
    public void CatalogItemImage_ShouldHaveCatalogItemImageIdProperty()
    {
        // Arrange & Act
        var image = new CatalogItemImage();
        var id = Guid.NewGuid();
        image.CatalogItemImageId = id;

        // Assert
        Assert.That(image.CatalogItemImageId, Is.EqualTo(id));
    }

    [Test]
    public void CatalogItemImage_ShouldHaveCatalogItemIdProperty()
    {
        // Arrange & Act
        var image = new CatalogItemImage();
        var catalogItemId = Guid.NewGuid();
        image.CatalogItemId = catalogItemId;

        // Assert
        Assert.That(image.CatalogItemId, Is.EqualTo(catalogItemId));
    }

    [Test]
    public void CatalogItemImage_ShouldHaveImageDataProperty()
    {
        // Arrange & Act
        var image = new CatalogItemImage();
        var imageData = new byte[] { 1, 2, 3, 4, 5 };
        image.ImageData = imageData;

        // Assert
        Assert.That(image.ImageData, Is.EqualTo(imageData));
    }

    [Test]
    public void CatalogItemImage_ShouldInitializeImageDataAsEmptyArray()
    {
        // Arrange & Act
        var image = new CatalogItemImage();

        // Assert
        Assert.That(image.ImageData, Is.Not.Null);
        Assert.That(image.ImageData, Is.Empty);
    }

    [Test]
    public void CatalogItemImage_ShouldHaveDescriptionProperty()
    {
        // Arrange & Act
        var image = new CatalogItemImage { Description = "AI-generated description" };

        // Assert
        Assert.That(image.Description, Is.EqualTo("AI-generated description"));
    }

    [Test]
    public void CatalogItemImage_ShouldInitializeDescriptionAsEmptyString()
    {
        // Arrange & Act
        var image = new CatalogItemImage();

        // Assert
        Assert.That(image.Description, Is.Not.Null);
        Assert.That(image.Description, Is.Empty);
    }

    [Test]
    public void CatalogItemImage_ShouldHaveCreatedDateProperty()
    {
        // Arrange & Act
        var image = new CatalogItemImage();
        var now = DateTime.UtcNow;
        image.CreatedDate = now;

        // Assert
        Assert.That(image.CreatedDate, Is.EqualTo(now));
    }

    [Test]
    public void CatalogItemImage_ShouldHaveCatalogItemNavigationProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem();
        var image = new CatalogItemImage { CatalogItem = catalogItem };

        // Assert
        Assert.That(image.CatalogItem, Is.Not.Null);
        Assert.That(image.CatalogItem, Is.EqualTo(catalogItem));
    }

    [Test]
    public void CatalogItemImage_ShouldAllowNullCatalogItemNavigationProperty()
    {
        // Arrange & Act
        var image = new CatalogItemImage();

        // Assert
        Assert.That(image.CatalogItem, Is.Null);
    }

    [Test]
    public void CatalogItemImage_ShouldStoreRawImageDataAsBytes()
    {
        // Arrange
        var image = new CatalogItemImage();
        var rawImageData = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 }; // JPEG header bytes

        // Act
        image.ImageData = rawImageData;

        // Assert
        Assert.That(image.ImageData.Length, Is.EqualTo(4));
        Assert.That(image.ImageData[0], Is.EqualTo(0xFF));
    }
}
