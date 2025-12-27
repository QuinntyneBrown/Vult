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
            Benefits = product.Benefits,
            Details = product.Details,
            Shipping = product.Shipping,
            PromotionalMessage = product.PromotionalMessage,
            IsMemberExclusive = product.IsMemberExclusive,
            IsNew = product.IsNew,
            CreatedDate = product.CreatedDate,
            UpdatedDate = product.UpdatedDate,
            ProductImages = product.ProductImages?.Select(x => x.ToDto()).ToList() ?? new List<ProductImageDto>()
        };
    }

    public static ProductImageDto ToDto(this ProductImage image)
    {
        return new ProductImageDto
        {
            ProductImageId = image.ProductImageId,
            ProductId = image.ProductId,
            ImageData = image.ImageData,
            Url = image.Url,
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
            Benefits = dto.Benefits,
            Details = dto.Details,
            Shipping = dto.Shipping,
            PromotionalMessage = dto.PromotionalMessage,
            IsMemberExclusive = dto.IsMemberExclusive,
            IsNew = dto.IsNew,
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
        product.Benefits = dto.Benefits;
        product.Details = dto.Details;
        product.Shipping = dto.Shipping;
        product.PromotionalMessage = dto.PromotionalMessage;
        product.IsMemberExclusive = dto.IsMemberExclusive;
        product.IsNew = dto.IsNew;
        product.UpdatedDate = DateTime.UtcNow;
    }
}
