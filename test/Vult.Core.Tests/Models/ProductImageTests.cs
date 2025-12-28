// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core;
using Vult.Core.Model.ProductAggregate;

namespace Vult.Core.Tests.Models;

[TestFixture]
public class ProductImageTests
{
    [Test]
    public void ProductImage_ShouldHaveProductImageIdProperty()
    {
        // Arrange & Act
        var image = new ProductImage();
        var id = Guid.NewGuid();
        image.ProductImageId = id;

        // Assert
        Assert.That(image.ProductImageId, Is.EqualTo(id));
    }

    [Test]
    public void ProductImage_ShouldHaveProductIdProperty()
    {
        // Arrange & Act
        var image = new ProductImage();
        var productId = Guid.NewGuid();
        image.ProductId = productId;

        // Assert
        Assert.That(image.ProductId, Is.EqualTo(productId));
    }

    [Test]
    public void ProductImage_ShouldHaveImageDataProperty()
    {
        // Arrange & Act
        var image = new ProductImage();
        var imageData = new byte[] { 1, 2, 3, 4, 5 };
        image.ImageData = imageData;

        // Assert
        Assert.That(image.ImageData, Is.EqualTo(imageData));
    }

    [Test]
    public void ProductImage_ShouldInitializeImageDataAsEmptyArray()
    {
        // Arrange & Act
        var image = new ProductImage();

        // Assert
        Assert.That(image.ImageData, Is.Not.Null);
        Assert.That(image.ImageData, Is.Empty);
    }

    [Test]
    public void ProductImage_ShouldHaveUrlProperty()
    {
        // Arrange & Act
        var image = new ProductImage { Url = "https://example.com/images/product.jpg" };

        // Assert
        Assert.That(image.Url, Is.EqualTo("https://example.com/images/product.jpg"));
    }

    [Test]
    public void ProductImage_ShouldInitializeUrlAsEmptyString()
    {
        // Arrange & Act
        var image = new ProductImage();

        // Assert
        Assert.That(image.Url, Is.Not.Null);
        Assert.That(image.Url, Is.Empty);
    }

    [Test]
    public void ProductImage_ShouldHaveDescriptionProperty()
    {
        // Arrange & Act
        var image = new ProductImage { Description = "AI-generated description" };

        // Assert
        Assert.That(image.Description, Is.EqualTo("AI-generated description"));
    }

    [Test]
    public void ProductImage_ShouldInitializeDescriptionAsEmptyString()
    {
        // Arrange & Act
        var image = new ProductImage();

        // Assert
        Assert.That(image.Description, Is.Not.Null);
        Assert.That(image.Description, Is.Empty);
    }

    [Test]
    public void ProductImage_ShouldHaveCreatedDateProperty()
    {
        // Arrange & Act
        var image = new ProductImage();
        var now = DateTime.UtcNow;
        image.CreatedDate = now;

        // Assert
        Assert.That(image.CreatedDate, Is.EqualTo(now));
    }

    [Test]
    public void ProductImage_ShouldHaveProductNavigationProperty()
    {
        // Arrange & Act
        var product = new Product();
        var image = new ProductImage { Product = product };

        // Assert
        Assert.That(image.Product, Is.Not.Null);
        Assert.That(image.Product, Is.EqualTo(product));
    }

    [Test]
    public void ProductImage_ShouldAllowNullProductNavigationProperty()
    {
        // Arrange & Act
        var image = new ProductImage();

        // Assert
        Assert.That(image.Product, Is.Null);
    }

    [Test]
    public void ProductImage_ShouldStoreRawImageDataAsBytes()
    {
        // Arrange
        var image = new ProductImage();
        var rawImageData = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 }; // JPEG header bytes

        // Act
        image.ImageData = rawImageData;

        // Assert
        Assert.That(image.ImageData.Length, Is.EqualTo(4));
        Assert.That(image.ImageData[0], Is.EqualTo(0xFF));
    }
}
