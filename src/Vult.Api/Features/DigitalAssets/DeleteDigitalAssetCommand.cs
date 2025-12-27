// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Vult.Core.Services.Authorization;

namespace Vult.Api.Features.DigitalAssets;

[AuthorizeResourceOperation(Operations.Delete, AggregateNames.DigitalAsset)]
public class DeleteDigitalAssetCommand : IRequest<DeleteDigitalAssetCommandResult>
{
    public Guid DigitalAssetId { get; set; }

    public DeleteDigitalAssetCommand()
    {
    }

    public DeleteDigitalAssetCommand(Guid digitalAssetId)
    {
        DigitalAssetId = digitalAssetId;
    }
}

public class DeleteDigitalAssetCommandResult
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
