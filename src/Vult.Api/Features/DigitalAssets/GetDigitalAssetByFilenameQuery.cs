// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.DigitalAssets;

public class GetDigitalAssetByFilenameQuery : IRequest<GetDigitalAssetByFilenameQueryResult>
{
    public string Filename { get; set; } = string.Empty;

    public GetDigitalAssetByFilenameQuery()
    {
    }

    public GetDigitalAssetByFilenameQuery(string filename)
    {
        Filename = filename;
    }
}

public class GetDigitalAssetByFilenameQueryResult
{
    public DigitalAssetWithBytesDto? DigitalAsset { get; set; }
}
