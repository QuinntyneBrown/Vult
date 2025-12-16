// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.CatalogItems;

public class GetCatalogItemByIdQuery : IRequest<GetCatalogItemByIdQueryResult>
{
    public Guid CatalogItemId { get; set; }

    public GetCatalogItemByIdQuery(Guid catalogItemId)
    {
        CatalogItemId = catalogItemId;
    }
}

public class GetCatalogItemByIdQueryResult
{
    public CatalogItemDto? CatalogItem { get; set; }
}
