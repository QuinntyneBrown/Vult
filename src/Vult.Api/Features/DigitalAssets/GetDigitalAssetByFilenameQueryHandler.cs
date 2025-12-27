// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.DigitalAssets;

public class GetDigitalAssetByFilenameQueryHandler : IRequestHandler<GetDigitalAssetByFilenameQuery, GetDigitalAssetByFilenameQueryResult>
{
    private readonly IVultContext _context;

    public GetDigitalAssetByFilenameQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetDigitalAssetByFilenameQueryResult> Handle(GetDigitalAssetByFilenameQuery query, CancellationToken cancellationToken)
    {
        // Case-insensitive search by filename
        var asset = await _context.DigitalAssets
            .FirstOrDefaultAsync(x => x.Name.ToLower() == query.Filename.ToLower(), cancellationToken);

        return new GetDigitalAssetByFilenameQueryResult
        {
            DigitalAsset = asset?.ToDtoWithBytes()
        };
    }
}
