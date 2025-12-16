// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.CatalogItems;

public class CreateCatalogItemCommand : IRequest<CreateCatalogItemCommandResult>
{
    public CreateCatalogItemDto CatalogItem { get; set; } = null!;
}

public class CreateCatalogItemCommandResult
{
    public CatalogItemDto? CatalogItem { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
