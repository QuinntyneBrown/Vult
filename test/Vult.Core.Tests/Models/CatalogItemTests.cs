// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Enums;
using Vult.Core.Models;

namespace Vult.Core.Tests.Models;

[TestFixture]
public class CatalogItemTests
{
    [Test]
    public void CatalogItem_ShouldHaveCatalogItemIdProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem();
        var id = Guid.NewGuid();
        catalogItem.CatalogItemId = id;

        // Assert
        Assert.That(catalogItem.CatalogItemId, Is.EqualTo(id));
    }

    [Test]
    public void CatalogItem_ShouldHaveEstimatedMSRPProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem { EstimatedMSRP = 99.99m };

        // Assert
        Assert.That(catalogItem.EstimatedMSRP, Is.EqualTo(99.99m));
    }

    [Test]
    public void CatalogItem_ShouldHaveEstimatedResaleValueProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem { EstimatedResaleValue = 59.99m };

        // Assert
        Assert.That(catalogItem.EstimatedResaleValue, Is.EqualTo(59.99m));
    }

    [Test]
    public void CatalogItem_ShouldHaveDescriptionProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem { Description = "Test description" };

        // Assert
        Assert.That(catalogItem.Description, Is.EqualTo("Test description"));
    }

    [Test]
    public void CatalogItem_ShouldHaveSizeProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem { Size = "M" };

        // Assert
        Assert.That(catalogItem.Size, Is.EqualTo("M"));
    }

    [Test]
    public void CatalogItem_ShouldHaveBrandNameProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem { BrandName = "Nike" };

        // Assert
        Assert.That(catalogItem.BrandName, Is.EqualTo("Nike"));
    }

    [Test]
    public void CatalogItem_ShouldHaveGenderProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem { Gender = Gender.Mens };

        // Assert
        Assert.That(catalogItem.Gender, Is.EqualTo(Gender.Mens));
    }

    [Test]
    public void CatalogItem_ShouldHaveItemTypeProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem { ItemType = ItemType.Shoe };

        // Assert
        Assert.That(catalogItem.ItemType, Is.EqualTo(ItemType.Shoe));
    }

    [Test]
    public void CatalogItem_ShouldHaveCreatedDateProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem();
        var now = DateTime.UtcNow;
        catalogItem.CreatedDate = now;

        // Assert
        Assert.That(catalogItem.CreatedDate, Is.EqualTo(now));
    }

    [Test]
    public void CatalogItem_ShouldHaveUpdatedDateProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem();
        var now = DateTime.UtcNow;
        catalogItem.UpdatedDate = now;

        // Assert
        Assert.That(catalogItem.UpdatedDate, Is.EqualTo(now));
    }

    [Test]
    public void CatalogItem_ShouldHaveCatalogItemImagesNavigationProperty()
    {
        // Arrange & Act
        var catalogItem = new CatalogItem();

        // Assert
        Assert.That(catalogItem.CatalogItemImages, Is.Not.Null);
        Assert.That(catalogItem.CatalogItemImages, Is.InstanceOf<ICollection<CatalogItemImage>>());
    }

    [Test]
    public void CatalogItem_ShouldAllowAddingCatalogItemImages()
    {
        // Arrange
        var catalogItem = new CatalogItem();
        var image = new CatalogItemImage
        {
            CatalogItemImageId = Guid.NewGuid(),
            ImageData = new byte[] { 1, 2, 3 },
            Description = "Test image"
        };

        // Act
        catalogItem.CatalogItemImages.Add(image);

        // Assert
        Assert.That(catalogItem.CatalogItemImages.Count, Is.EqualTo(1));
        Assert.That(catalogItem.CatalogItemImages.First(), Is.EqualTo(image));
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
}
