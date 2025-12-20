// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Api.Features.CatalogItems;
using Vult.Core;
using Vult.Core;

namespace Vult.Api.Tests.Features.CatalogItems;

[TestFixture]
public class CatalogItemExtensionsTests
{
    [Test]
    public void ToDto_ShouldMapAllProperties_WhenCatalogItemIsValid()
    {
        // Arrange
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 100.50m,
            EstimatedResaleValue = 75.25m,
            Description = "Test Description",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            CatalogItemImages = new List<CatalogItemImage>()
        };

        // Act
        var dto = catalogItem.ToDto();

        // Assert
        Assert.That(dto.CatalogItemId, Is.EqualTo(catalogItem.CatalogItemId));
        Assert.That(dto.EstimatedMSRP, Is.EqualTo(catalogItem.EstimatedMSRP));
        Assert.That(dto.EstimatedResaleValue, Is.EqualTo(catalogItem.EstimatedResaleValue));
        Assert.That(dto.Description, Is.EqualTo(catalogItem.Description));
        Assert.That(dto.Size, Is.EqualTo(catalogItem.Size));
        Assert.That(dto.BrandName, Is.EqualTo(catalogItem.BrandName));
        Assert.That(dto.Gender, Is.EqualTo(catalogItem.Gender));
        Assert.That(dto.ItemType, Is.EqualTo(catalogItem.ItemType));
        Assert.That(dto.CreatedDate, Is.EqualTo(catalogItem.CreatedDate));
        Assert.That(dto.UpdatedDate, Is.EqualTo(catalogItem.UpdatedDate));
        Assert.That(dto.Images, Is.Not.Null);
    }

    [Test]
    public void ToDto_ShouldMapImages_WhenCatalogItemHasImages()
    {
        // Arrange
        var imageId = Guid.NewGuid();
        var catalogItemId = Guid.NewGuid();
        var catalogItem = new CatalogItem
        {
            CatalogItemId = catalogItemId,
            EstimatedMSRP = 100.50m,
            EstimatedResaleValue = 75.25m,
            Description = "Test Description",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            CatalogItemImages = new List<CatalogItemImage>
            {
                new CatalogItemImage
                {
                    CatalogItemImageId = imageId,
                    CatalogItemId = catalogItemId,
                    ImageData = new byte[] { 1, 2, 3 },
                    Description = "Test Image",
                    CreatedDate = DateTime.UtcNow
                }
            }
        };

        // Act
        var dto = catalogItem.ToDto();

        // Assert
        Assert.That(dto.Images, Has.Count.EqualTo(1));
        Assert.That(dto.Images[0].CatalogItemImageId, Is.EqualTo(imageId));
        Assert.That(dto.Images[0].CatalogItemId, Is.EqualTo(catalogItemId));
        Assert.That(dto.Images[0].ImageData, Is.EqualTo(new byte[] { 1, 2, 3 }));
    }

    [Test]
    public void CatalogItemImageToDto_ShouldMapAllProperties()
    {
        // Arrange
        var image = new CatalogItemImage
        {
            CatalogItemImageId = Guid.NewGuid(),
            CatalogItemId = Guid.NewGuid(),
            ImageData = new byte[] { 1, 2, 3, 4 },
            Description = "Test Image Description",
            CreatedDate = DateTime.UtcNow
        };

        // Act
        var dto = image.ToDto();

        // Assert
        Assert.That(dto.CatalogItemImageId, Is.EqualTo(image.CatalogItemImageId));
        Assert.That(dto.CatalogItemId, Is.EqualTo(image.CatalogItemId));
        Assert.That(dto.ImageData, Is.EqualTo(image.ImageData));
        Assert.That(dto.Description, Is.EqualTo(image.Description));
        Assert.That(dto.CreatedDate, Is.EqualTo(image.CreatedDate));
    }

    [Test]
    public void ToCatalogItem_ShouldCreateCatalogItem_FromCreateDto()
    {
        // Arrange
        var dto = new CreateCatalogItemDto
        {
            EstimatedMSRP = 100.50m,
            EstimatedResaleValue = 75.25m,
            Description = "Test Description",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe
        };

        // Act
        var catalogItem = dto.ToCatalogItem();

        // Assert
        Assert.That(catalogItem.CatalogItemId, Is.Not.EqualTo(Guid.Empty));
        Assert.That(catalogItem.EstimatedMSRP, Is.EqualTo(dto.EstimatedMSRP));
        Assert.That(catalogItem.EstimatedResaleValue, Is.EqualTo(dto.EstimatedResaleValue));
        Assert.That(catalogItem.Description, Is.EqualTo(dto.Description));
        Assert.That(catalogItem.Size, Is.EqualTo(dto.Size));
        Assert.That(catalogItem.BrandName, Is.EqualTo(dto.BrandName));
        Assert.That(catalogItem.Gender, Is.EqualTo(dto.Gender));
        Assert.That(catalogItem.ItemType, Is.EqualTo(dto.ItemType));
        Assert.That(catalogItem.CreatedDate, Is.Not.EqualTo(default(DateTime)));
        Assert.That(catalogItem.UpdatedDate, Is.Not.EqualTo(default(DateTime)));
    }

    [Test]
    public void UpdateFromDto_ShouldUpdateCatalogItem_FromUpdateDto()
    {
        // Arrange
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 50.00m,
            EstimatedResaleValue = 30.00m,
            Description = "Old Description",
            Size = "S",
            BrandName = "Old Brand",
            Gender = Gender.Womens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow.AddDays(-10),
            UpdatedDate = DateTime.UtcNow.AddDays(-10)
        };

        var dto = new UpdateCatalogItemDto
        {
            CatalogItemId = catalogItem.CatalogItemId,
            EstimatedMSRP = 100.50m,
            EstimatedResaleValue = 75.25m,
            Description = "New Description",
            Size = "M",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe
        };

        var originalCreatedDate = catalogItem.CreatedDate;
        var originalUpdatedDate = catalogItem.UpdatedDate;

        // Act
        catalogItem.UpdateFromDto(dto);

        // Assert
        Assert.That(catalogItem.EstimatedMSRP, Is.EqualTo(dto.EstimatedMSRP));
        Assert.That(catalogItem.EstimatedResaleValue, Is.EqualTo(dto.EstimatedResaleValue));
        Assert.That(catalogItem.Description, Is.EqualTo(dto.Description));
        Assert.That(catalogItem.Size, Is.EqualTo(dto.Size));
        Assert.That(catalogItem.BrandName, Is.EqualTo(dto.BrandName));
        Assert.That(catalogItem.Gender, Is.EqualTo(dto.Gender));
        Assert.That(catalogItem.ItemType, Is.EqualTo(dto.ItemType));
        Assert.That(catalogItem.CreatedDate, Is.EqualTo(originalCreatedDate)); // Should not change
        Assert.That(catalogItem.UpdatedDate, Is.GreaterThan(originalUpdatedDate)); // Should be updated
    }
}
