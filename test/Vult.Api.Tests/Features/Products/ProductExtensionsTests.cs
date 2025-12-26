// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Api.Features.Products;
using Vult.Core;

namespace Vult.Api.Tests.Features.Products;

[TestFixture]
public class ProductExtensionsTests
{
    [Test]
    public void ToDto_ShouldMapAllProperties_WhenProductIsValid()
    {
        // Arrange
        var product = new Product
        {
            ProductId = Guid.NewGuid(),
            EstimatedMSRP = 100.50m,
            EstimatedResaleValue = 75.25m,
            Description = "Test Description",
            Size = "M",
            BrandName = "Adidas",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            ProductImages = new List<ProductImage>()
        };

        // Act
        var dto = product.ToDto();

        // Assert
        Assert.That(dto.ProductId, Is.EqualTo(product.ProductId));
        Assert.That(dto.EstimatedMSRP, Is.EqualTo(product.EstimatedMSRP));
        Assert.That(dto.EstimatedResaleValue, Is.EqualTo(product.EstimatedResaleValue));
        Assert.That(dto.Description, Is.EqualTo(product.Description));
        Assert.That(dto.Size, Is.EqualTo(product.Size));
        Assert.That(dto.BrandName, Is.EqualTo(product.BrandName));
        Assert.That(dto.Gender, Is.EqualTo(product.Gender));
        Assert.That(dto.ItemType, Is.EqualTo(product.ItemType));
        Assert.That(dto.CreatedDate, Is.EqualTo(product.CreatedDate));
        Assert.That(dto.UpdatedDate, Is.EqualTo(product.UpdatedDate));
        Assert.That(dto.Images, Is.Not.Null);
    }

    [Test]
    public void ToDto_ShouldMapImages_WhenProductHasImages()
    {
        // Arrange
        var imageId = Guid.NewGuid();
        var productId = Guid.NewGuid();
        var product = new Product
        {
            ProductId = productId,
            EstimatedMSRP = 100.50m,
            EstimatedResaleValue = 75.25m,
            Description = "Test Description",
            Size = "M",
            BrandName = "Puma",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            ProductImages = new List<ProductImage>
            {
                new ProductImage
                {
                    ProductImageId = imageId,
                    ProductId = productId,
                    ImageData = new byte[] { 1, 2, 3 },
                    Description = "Test Image",
                    CreatedDate = DateTime.UtcNow
                }
            }
        };

        // Act
        var dto = product.ToDto();

        // Assert
        Assert.That(dto.Images, Has.Count.EqualTo(1));
        Assert.That(dto.Images[0].ProductImageId, Is.EqualTo(imageId));
        Assert.That(dto.Images[0].ProductId, Is.EqualTo(productId));
        Assert.That(dto.Images[0].ImageData, Is.EqualTo(new byte[] { 1, 2, 3 }));
    }

    [Test]
    public void ProductImageToDto_ShouldMapAllProperties()
    {
        // Arrange
        var image = new ProductImage
        {
            ProductImageId = Guid.NewGuid(),
            ProductId = Guid.NewGuid(),
            ImageData = new byte[] { 1, 2, 3, 4 },
            Description = "Test Image Description",
            CreatedDate = DateTime.UtcNow
        };

        // Act
        var dto = image.ToDto();

        // Assert
        Assert.That(dto.ProductImageId, Is.EqualTo(image.ProductImageId));
        Assert.That(dto.ProductId, Is.EqualTo(image.ProductId));
        Assert.That(dto.ImageData, Is.EqualTo(image.ImageData));
        Assert.That(dto.Description, Is.EqualTo(image.Description));
        Assert.That(dto.CreatedDate, Is.EqualTo(image.CreatedDate));
    }

    [Test]
    public void ToProduct_ShouldCreateProduct_FromCreateDto()
    {
        // Arrange
        var dto = new CreateProductDto
        {
            EstimatedMSRP = 100.50m,
            EstimatedResaleValue = 75.25m,
            Description = "Test Description",
            Size = "M",
            BrandName = "Reebok",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe
        };

        // Act
        var product = dto.ToProduct();

        // Assert
        Assert.That(product.ProductId, Is.Not.EqualTo(Guid.Empty));
        Assert.That(product.EstimatedMSRP, Is.EqualTo(dto.EstimatedMSRP));
        Assert.That(product.EstimatedResaleValue, Is.EqualTo(dto.EstimatedResaleValue));
        Assert.That(product.Description, Is.EqualTo(dto.Description));
        Assert.That(product.Size, Is.EqualTo(dto.Size));
        Assert.That(product.BrandName, Is.EqualTo(dto.BrandName));
        Assert.That(product.Gender, Is.EqualTo(dto.Gender));
        Assert.That(product.ItemType, Is.EqualTo(dto.ItemType));
        Assert.That(product.CreatedDate, Is.Not.EqualTo(default(DateTime)));
        Assert.That(product.UpdatedDate, Is.Not.EqualTo(default(DateTime)));
    }

    [Test]
    public void UpdateFromDto_ShouldUpdateProduct_FromUpdateDto()
    {
        // Arrange
        var product = new Product
        {
            ProductId = Guid.NewGuid(),
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

        var dto = new UpdateProductDto
        {
            ProductId = product.ProductId,
            EstimatedMSRP = 100.50m,
            EstimatedResaleValue = 75.25m,
            Description = "New Description",
            Size = "M",
            BrandName = "New Balance",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe
        };

        var originalCreatedDate = product.CreatedDate;
        var originalUpdatedDate = product.UpdatedDate;

        // Act
        product.UpdateFromDto(dto);

        // Assert
        Assert.That(product.EstimatedMSRP, Is.EqualTo(dto.EstimatedMSRP));
        Assert.That(product.EstimatedResaleValue, Is.EqualTo(dto.EstimatedResaleValue));
        Assert.That(product.Description, Is.EqualTo(dto.Description));
        Assert.That(product.Size, Is.EqualTo(dto.Size));
        Assert.That(product.BrandName, Is.EqualTo(dto.BrandName));
        Assert.That(product.Gender, Is.EqualTo(dto.Gender));
        Assert.That(product.ItemType, Is.EqualTo(dto.ItemType));
        Assert.That(product.CreatedDate, Is.EqualTo(originalCreatedDate)); // Should not change
        Assert.That(product.UpdatedDate, Is.GreaterThan(originalUpdatedDate)); // Should be updated
    }
}
