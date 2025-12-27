// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Model.ProductAggregate;

public class ProductEvaluationResult
{
    public Product? Product { get; set; }

    public bool Success { get; set; }

    public List<string> Errors { get; set; } = new();
}
