// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using ProductService.Api.Model;

namespace ProductService.Api.Features.Products;

public class ProductDto
{
    public Guid ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal EstimatedMSRP { get; set; }
    public decimal EstimatedResaleValue { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string BrandName { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public ItemType ItemType { get; set; }
    public bool IsFeatured { get; set; }
    public string Benefits { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string Shipping { get; set; } = string.Empty;
    public string PromotionalMessage { get; set; } = string.Empty;
    public bool IsMemberExclusive { get; set; }
    public bool IsNew { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public List<ProductImageDto> ProductImages { get; set; } = new();
}

public class ProductImageDto
{
    public Guid ProductImageId { get; set; }
    public Guid ProductId { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public decimal EstimatedMSRP { get; set; }
    public decimal EstimatedResaleValue { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string BrandName { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public ItemType ItemType { get; set; }
    public bool IsFeatured { get; set; }
    public string Benefits { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string Shipping { get; set; } = string.Empty;
    public string PromotionalMessage { get; set; } = string.Empty;
    public bool IsMemberExclusive { get; set; }
    public bool IsNew { get; set; }
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public decimal EstimatedMSRP { get; set; }
    public decimal EstimatedResaleValue { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string BrandName { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public ItemType ItemType { get; set; }
    public bool IsFeatured { get; set; }
    public string Benefits { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string Shipping { get; set; } = string.Empty;
    public string PromotionalMessage { get; set; } = string.Empty;
    public bool IsMemberExclusive { get; set; }
    public bool IsNew { get; set; }
}

public static class ProductExtensions
{
    public static ProductDto ToDto(this Product product)
    {
        return new ProductDto
        {
            ProductId = product.ProductId,
            Name = product.Name,
            EstimatedMSRP = product.EstimatedMSRP,
            EstimatedResaleValue = product.EstimatedResaleValue,
            Description = product.Description,
            ShortDescription = product.ShortDescription,
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
            ProductImages = product.ProductImages.Select(pi => pi.ToDto()).ToList()
        };
    }

    public static ProductImageDto ToDto(this ProductImage productImage)
    {
        return new ProductImageDto
        {
            ProductImageId = productImage.ProductImageId,
            ProductId = productImage.ProductId,
            Url = productImage.Url,
            Description = productImage.Description,
            CreatedDate = productImage.CreatedDate
        };
    }
}
