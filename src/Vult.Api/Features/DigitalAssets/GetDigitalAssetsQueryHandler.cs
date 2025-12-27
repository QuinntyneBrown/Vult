// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.DigitalAssets;

public class GetDigitalAssetsQueryHandler : IRequestHandler<GetDigitalAssetsQuery, GetDigitalAssetsQueryResult>
{
    private readonly IVultContext _context;

    public GetDigitalAssetsQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetDigitalAssetsQueryResult> Handle(GetDigitalAssetsQuery query, CancellationToken cancellationToken)
    {
        var queryable = _context.DigitalAssets.AsQueryable();

        // Apply sorting
        queryable = query.SortBy?.ToLower() switch
        {
            "name" => queryable.OrderBy(x => x.Name),
            "name_desc" => queryable.OrderByDescending(x => x.Name),
            "date" => queryable.OrderBy(x => x.CreatedDate),
            "date_desc" => queryable.OrderByDescending(x => x.CreatedDate),
            _ => queryable.OrderByDescending(x => x.CreatedDate) // Default sort
        };

        var totalCount = await queryable.CountAsync(cancellationToken);

        // Select only necessary fields (excluding Bytes) for list responses
        var items = await queryable
            .Select(x => new DigitalAssetDto
            {
                DigitalAssetId = x.DigitalAssetId,
                Name = x.Name,
                ContentType = x.ContentType,
                Height = x.Height,
                Width = x.Width,
                CreatedDate = x.CreatedDate
            })
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new GetDigitalAssetsQueryResult
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}
