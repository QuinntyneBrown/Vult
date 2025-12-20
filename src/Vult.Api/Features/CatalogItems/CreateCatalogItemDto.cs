// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core;

namespace Vult.Api.Features.CatalogItems;

public class CreateCatalogItemDto
{
    public decimal EstimatedMSRP { get; set; }
    public decimal EstimatedResaleValue { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string BrandName { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public ItemType ItemType { get; set; }
}
