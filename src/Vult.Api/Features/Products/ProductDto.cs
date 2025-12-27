// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Model.ProductAggregate.Enums;

namespace Vult.Api.Features.Products;

public class ProductDto
{
    public Guid ProductId { get; set; }
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
