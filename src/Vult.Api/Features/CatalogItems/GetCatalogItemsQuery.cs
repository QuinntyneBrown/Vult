// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Enums;

namespace Vult.Api.Features.CatalogItems;

public class GetCatalogItemsQuery
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? BrandName { get; set; }
    public ItemType? ItemType { get; set; }
    public Gender? Gender { get; set; }
    public string? SortBy { get; set; } // "price", "date", "price_desc", "date_desc"
}

public class GetCatalogItemsQueryResult
{
    public List<CatalogItemDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
