// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Model.ProductAggregate.Enums;

namespace Vult.Core.Model.ProductAggregate;

public class ProductAnalysisResult
{
    public decimal EstimatedMSRP { get; set; }

    public decimal EstimatedResaleValue { get; set; }

    public string Description { get; set; } = string.Empty;

    public string Size { get; set; } = string.Empty;

    public string BrandName { get; set; } = string.Empty;

    public Gender Gender { get; set; }

    public ItemType ItemType { get; set; }

    public string ImageDescription { get; set; } = string.Empty;

    public bool Success { get; set; }

    public string ErrorMessage { get; set; } = string.Empty;
}
