// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core;

public class CatalogItemImage
{
    public Guid CatalogItemImageId { get; set; }
    public Guid CatalogItemId { get; set; }
    public byte[] ImageData { get; set; } = Array.Empty<byte>();
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }

    // Navigation property
    public CatalogItem? CatalogItem { get; set; }
}
