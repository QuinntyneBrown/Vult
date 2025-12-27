// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using Vult.Core.Services.Authorization;

namespace Vult.Api.Features.DigitalAssets;

[AuthorizeResourceOperation(Operations.Create, AggregateNames.DigitalAsset)]
public class UploadDigitalAssetCommand : IRequest<UploadDigitalAssetCommandResult>
{
    public IFormFile? File { get; set; }
}

public class UploadDigitalAssetCommandResult
{
    public DigitalAssetDto? DigitalAsset { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
