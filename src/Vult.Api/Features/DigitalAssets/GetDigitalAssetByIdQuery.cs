// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.DigitalAssets;

public class GetDigitalAssetByIdQuery : IRequest<GetDigitalAssetByIdQueryResult>
{
    public Guid DigitalAssetId { get; set; }

    public GetDigitalAssetByIdQuery()
    {
    }

    public GetDigitalAssetByIdQuery(Guid digitalAssetId)
    {
        DigitalAssetId = digitalAssetId;
    }
}

public class GetDigitalAssetByIdQueryResult
{
    public DigitalAssetWithBytesDto? DigitalAsset { get; set; }
}
