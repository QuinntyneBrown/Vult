// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Model.ProductAggregate;

namespace Vult.Api.Features.Products;

public static class ProductExtensions
{
    public static ProductDto ToDto(this Product product)
    {
        return new ProductDto
        {
            ProductId = product.ProductId,
            EstimatedMSRP = product.EstimatedMSRP,
            EstimatedResaleValue = product.EstimatedResaleValue,
            Description = product.Description,
            Size = product.Size,
            BrandName = product.BrandName,
            Gender = product.Gender,
            ItemType = product.ItemType,
            IsFeatured = product.IsFeatured,
            CreatedDate = product.CreatedDate,
            UpdatedDate = product.UpdatedDate,
            Images = product.ProductImages?.Select(x => x.ToDto()).ToList() ?? new List<ProductImageDto>()
        };
    }

    public static ProductImageDto ToDto(this ProductImage image)
    {
        return new ProductImageDto
        {
            ProductImageId = image.ProductImageId,
            ProductId = image.ProductId,
            ImageData = image.ImageData,
            Description = image.Description,
            CreatedDate = image.CreatedDate
        };
    }

    public static Product ToProduct(this CreateProductDto dto)
    {
        return new Product
        {
            ProductId = Guid.NewGuid(),
            EstimatedMSRP = dto.EstimatedMSRP,
            EstimatedResaleValue = dto.EstimatedResaleValue,
            Description = dto.Description,
            Size = dto.Size,
            BrandName = dto.BrandName,
            Gender = dto.Gender,
            ItemType = dto.ItemType,
            IsFeatured = dto.IsFeatured,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
    }

    public static void UpdateFromDto(this Product product, UpdateProductDto dto)
    {
        product.EstimatedMSRP = dto.EstimatedMSRP;
        product.EstimatedResaleValue = dto.EstimatedResaleValue;
        product.Description = dto.Description;
        product.Size = dto.Size;
        product.BrandName = dto.BrandName;
        product.Gender = dto.Gender;
        product.ItemType = dto.ItemType;
        product.IsFeatured = dto.IsFeatured;
        product.UpdatedDate = DateTime.UtcNow;
    }
}
