// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using DigitalAssetService.Api.Data;
using DigitalAssetService.Api.Model;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DigitalAssetService.Api.Features.DigitalAssets;

public class GetDigitalAssetsQuery : IRequest<GetDigitalAssetsQueryResult>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetDigitalAssetsQueryResult
{
    public List<DigitalAssetDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}

public class GetDigitalAssetsQueryHandler : IRequestHandler<GetDigitalAssetsQuery, GetDigitalAssetsQueryResult>
{
    private readonly DigitalAssetDbContext _context;

    public GetDigitalAssetsQueryHandler(DigitalAssetDbContext context)
    {
        _context = context;
    }

    public async Task<GetDigitalAssetsQueryResult> Handle(GetDigitalAssetsQuery query, CancellationToken cancellationToken)
    {
        var totalCount = await _context.DigitalAssets.CountAsync(cancellationToken);

        var items = await _context.DigitalAssets
            .OrderByDescending(a => a.CreatedDate)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new GetDigitalAssetsQueryResult
        {
            Items = items.Select(a => a.ToDto()).ToList(),
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}

public class GetDigitalAssetByIdQuery : IRequest<DigitalAsset?>
{
    public Guid DigitalAssetId { get; set; }
}

public class GetDigitalAssetByIdQueryHandler : IRequestHandler<GetDigitalAssetByIdQuery, DigitalAsset?>
{
    private readonly DigitalAssetDbContext _context;

    public GetDigitalAssetByIdQueryHandler(DigitalAssetDbContext context)
    {
        _context = context;
    }

    public async Task<DigitalAsset?> Handle(GetDigitalAssetByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.DigitalAssets
            .FirstOrDefaultAsync(a => a.DigitalAssetId == request.DigitalAssetId, cancellationToken);
    }
}

public class GetDigitalAssetByNameQuery : IRequest<DigitalAsset?>
{
    public string Name { get; set; } = string.Empty;
}

public class GetDigitalAssetByNameQueryHandler : IRequestHandler<GetDigitalAssetByNameQuery, DigitalAsset?>
{
    private readonly DigitalAssetDbContext _context;

    public GetDigitalAssetByNameQueryHandler(DigitalAssetDbContext context)
    {
        _context = context;
    }

    public async Task<DigitalAsset?> Handle(GetDigitalAssetByNameQuery request, CancellationToken cancellationToken)
    {
        return await _context.DigitalAssets
            .FirstOrDefaultAsync(a => a.Name == request.Name, cancellationToken);
    }
}
