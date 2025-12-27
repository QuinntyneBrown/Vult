// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using Vult.Core.Services.Authorization;

namespace Vult.Api.Features.DigitalAssets;

/// <summary>
/// Command for uploading multiple digital assets in a single request
/// </summary>
[AuthorizeResourceOperation(Operations.Create, AggregateNames.DigitalAsset)]
public class UploadDigitalAssetsCommand : IRequest<UploadDigitalAssetsCommandResult>
{
    public IFormFileCollection? Files { get; set; }
}

public class UploadDigitalAssetsCommandResult
{
    public List<DigitalAssetDto> DigitalAssets { get; set; } = new();
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
    public int TotalProcessed { get; set; }
    public int SuccessfullyProcessed { get; set; }
    public int Failed { get; set; }
}
