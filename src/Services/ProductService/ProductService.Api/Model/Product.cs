// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace ProductService.Api.Model;

public class Product
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
    public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
}

public class ProductImage
{
    public Guid ProductImageId { get; set; }
    public Guid ProductId { get; set; }
    public byte[] ImageData { get; set; } = Array.Empty<byte>();
    public string Url { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public Product? Product { get; set; }
}

public enum Gender
{
    Mens,
    Womens,
    Unisex
}

public enum ItemType
{
    Shoe,
    Pants,
    Jacket,
    Shirt,
    Shorts,
    Dress,
    Skirt,
    Sweater,
    Hoodie,
    Coat,
    Bag,
    Accessories,
    Hat,
    Book
}
