// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Model.ProductAggregate;

public class ProductImage
{
    public Guid ProductImageId { get; set; }
    public Guid ProductId { get; set; }
    public byte[] ImageData { get; set; } = Array.Empty<byte>();
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }

    // Navigation property
    public Product? Product { get; set; }
}
