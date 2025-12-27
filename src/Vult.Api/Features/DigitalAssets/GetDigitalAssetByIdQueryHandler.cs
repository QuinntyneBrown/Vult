// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.DigitalAssets;

public class GetDigitalAssetByIdQueryHandler : IRequestHandler<GetDigitalAssetByIdQuery, GetDigitalAssetByIdQueryResult>
{
    private readonly IVultContext _context;

    public GetDigitalAssetByIdQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetDigitalAssetByIdQueryResult> Handle(GetDigitalAssetByIdQuery query, CancellationToken cancellationToken)
    {
        var asset = await _context.DigitalAssets
            .FirstOrDefaultAsync(x => x.DigitalAssetId == query.DigitalAssetId, cancellationToken);

        return new GetDigitalAssetByIdQueryResult
        {
            DigitalAsset = asset?.ToDtoWithBytes()
        };
    }
}
