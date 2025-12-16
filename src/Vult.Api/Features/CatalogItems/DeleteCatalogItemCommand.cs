// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Api.Features.CatalogItems;

public class DeleteCatalogItemCommand
{
    public Guid CatalogItemId { get; set; }

    public DeleteCatalogItemCommand(Guid catalogItemId)
    {
        CatalogItemId = catalogItemId;
    }
}

public class DeleteCatalogItemCommandResult
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
