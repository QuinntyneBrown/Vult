// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core;

namespace Vult.Core.Tests.Models;

[TestFixture]
public class ProductTests
{
    [Test]
    public void Product_ShouldHaveProductIdProperty()
    {
        // Arrange & Act
        var product = new Product();
        var id = Guid.NewGuid();
        product.ProductId = id;

        // Assert
        Assert.That(product.ProductId, Is.EqualTo(id));
    }

    [Test]
    public void Product_ShouldHaveEstimatedMSRPProperty()
    {
        // Arrange & Act
        var product = new Product { EstimatedMSRP = 99.99m };

        // Assert
        Assert.That(product.EstimatedMSRP, Is.EqualTo(99.99m));
    }

    [Test]
    public void Product_ShouldHaveEstimatedResaleValueProperty()
    {
        // Arrange & Act
        var product = new Product { EstimatedResaleValue = 59.99m };

        // Assert
        Assert.That(product.EstimatedResaleValue, Is.EqualTo(59.99m));
    }

    [Test]
    public void Product_ShouldHaveDescriptionProperty()
    {
        // Arrange & Act
        var product = new Product { Description = "Test description" };

        // Assert
        Assert.That(product.Description, Is.EqualTo("Test description"));
    }

    [Test]
    public void Product_ShouldHaveSizeProperty()
    {
        // Arrange & Act
        var product = new Product { Size = "M" };

        // Assert
        Assert.That(product.Size, Is.EqualTo("M"));
    }

    [Test]
    public void Product_ShouldHaveBrandNameProperty()
    {
        // Arrange & Act
        var product = new Product { BrandName = "Adidas" };

        // Assert
        Assert.That(product.BrandName, Is.EqualTo("Adidas"));
    }

    [Test]
    public void Product_ShouldHaveGenderProperty()
    {
        // Arrange & Act
        var product = new Product { Gender = Gender.Mens };

        // Assert
        Assert.That(product.Gender, Is.EqualTo(Gender.Mens));
    }

    [Test]
    public void Product_ShouldHaveItemTypeProperty()
    {
        // Arrange & Act
        var product = new Product { ItemType = ItemType.Shoe };

        // Assert
        Assert.That(product.ItemType, Is.EqualTo(ItemType.Shoe));
    }

    [Test]
    public void Product_ShouldHaveCreatedDateProperty()
    {
        // Arrange & Act
        var product = new Product();
        var now = DateTime.UtcNow;
        product.CreatedDate = now;

        // Assert
        Assert.That(product.CreatedDate, Is.EqualTo(now));
    }

    [Test]
    public void Product_ShouldHaveUpdatedDateProperty()
    {
        // Arrange & Act
        var product = new Product();
        var now = DateTime.UtcNow;
        product.UpdatedDate = now;

        // Assert
        Assert.That(product.UpdatedDate, Is.EqualTo(now));
    }

    [Test]
    public void Product_ShouldHaveProductImagesNavigationProperty()
    {
        // Arrange & Act
        var product = new Product();

        // Assert
        Assert.That(product.ProductImages, Is.Not.Null);
        Assert.That(product.ProductImages, Is.InstanceOf<ICollection<ProductImage>>());
    }

    [Test]
    public void Product_ShouldAllowAddingProductImages()
    {
        // Arrange
        var product = new Product();
        var image = new ProductImage
        {
            ProductImageId = Guid.NewGuid(),
            ImageData = new byte[] { 1, 2, 3 },
            Description = "Test image"
        };

        // Act
        product.ProductImages.Add(image);

        // Assert
        Assert.That(product.ProductImages.Count, Is.EqualTo(1));
        Assert.That(product.ProductImages.First(), Is.EqualTo(image));
    }

    [Test]
    public void Gender_ShouldHaveMensValue()
    {
        // Arrange & Act
        var gender = Gender.Mens;

        // Assert
        Assert.That(gender, Is.EqualTo(Gender.Mens));
    }

    [Test]
    public void Gender_ShouldHaveWomensValue()
    {
        // Arrange & Act
        var gender = Gender.Womens;

        // Assert
        Assert.That(gender, Is.EqualTo(Gender.Womens));
    }

    [Test]
    public void Gender_ShouldHaveUnisexValue()
    {
        // Arrange & Act
        var gender = Gender.Unisex;

        // Assert
        Assert.That(gender, Is.EqualTo(Gender.Unisex));
    }

    [Test]
    public void ItemType_ShouldHaveShoeValue()
    {
        // Arrange & Act
        var type = ItemType.Shoe;

        // Assert
        Assert.That(type, Is.EqualTo(ItemType.Shoe));
    }

    [Test]
    public void ItemType_ShouldHavePantsValue()
    {
        // Arrange & Act
        var type = ItemType.Pants;

        // Assert
        Assert.That(type, Is.EqualTo(ItemType.Pants));
    }

    [Test]
    public void ItemType_ShouldHaveJacketValue()
    {
        // Arrange & Act
        var type = ItemType.Jacket;

        // Assert
        Assert.That(type, Is.EqualTo(ItemType.Jacket));
    }

    [Test]
    public void ItemType_ShouldHaveBagValue()
    {
        // Arrange & Act
        var type = ItemType.Bag;

        // Assert
        Assert.That(type, Is.EqualTo(ItemType.Bag));
    }

    [Test]
    public void ItemType_ShouldHaveAccessoriesValue()
    {
        // Arrange & Act
        var type = ItemType.Accessories;

        // Assert
        Assert.That(type, Is.EqualTo(ItemType.Accessories));
    }

    [Test]
    public void ItemType_ShouldHaveHatValue()
    {
        // Arrange & Act
        var type = ItemType.Hat;

        // Assert
        Assert.That(type, Is.EqualTo(ItemType.Hat));
    }

    [Test]
    public void ItemType_ShouldHaveBookValue()
    {
        // Arrange & Act
        var type = ItemType.Book;

        // Assert
        Assert.That(type, Is.EqualTo(ItemType.Book));
    }
}
