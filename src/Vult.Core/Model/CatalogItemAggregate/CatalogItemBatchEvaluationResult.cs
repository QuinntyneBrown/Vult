// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core;

public class CatalogItemBatchEvaluationResult
{
    public List<CatalogItem> CatalogItems { get; set; } = new();

    public bool Success { get; set; }

    public List<string> Errors { get; set; } = new();

    public int TotalProcessed { get; set; }

    public int SuccessfullyProcessed { get; set; }

    public int Failed { get; set; }
}
