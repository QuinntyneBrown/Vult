// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Vult.Core;

namespace Vult.Api.Features.Products;

public class GetProductsQuery : IRequest<GetProductsQueryResult>
{
    private int _pageNumber = 1;
    private int _pageSize = 10;

    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = value >= 1 ? value : 1;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value switch
        {
            <= 0 => 10,
            > 100 => 100,
            _ => value
        };
    }

    public string? BrandName { get; set; }
    public ItemType? ItemType { get; set; }
    public Gender? Gender { get; set; }
    public string? SortBy { get; set; } // "price", "date", "price_desc", "date_desc"
}

public class GetProductsQueryResult
{
    public List<ProductDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
