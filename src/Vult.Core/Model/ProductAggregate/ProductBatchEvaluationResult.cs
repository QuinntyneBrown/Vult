// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Model.ProductAggregate;

public class ProductBatchEvaluationResult
{
    public List<Product> Products { get; set; } = new();

    public bool Success { get; set; }

    public List<string> Errors { get; set; } = new();

    public int TotalProcessed { get; set; }

    public int SuccessfullyProcessed { get; set; }

    public int Failed { get; set; }
}
