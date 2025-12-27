// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Model.DigitalAssetAggregate;

namespace Vult.Api.Features.DigitalAssets;

public static class DigitalAssetExtensions
{
    /// <summary>
    /// Converts a DigitalAsset entity to DTO (without bytes for list responses).
    /// </summary>
    public static DigitalAssetDto ToDto(this DigitalAsset asset)
    {
        return new DigitalAssetDto
        {
            DigitalAssetId = asset.DigitalAssetId,
            Name = asset.Name,
            ContentType = asset.ContentType,
            Height = asset.Height,
            Width = asset.Width,
            CreatedDate = asset.CreatedDate
        };
    }

    /// <summary>
    /// Converts a DigitalAsset entity to DTO with bytes (for serving files).
    /// </summary>
    public static DigitalAssetWithBytesDto ToDtoWithBytes(this DigitalAsset asset)
    {
        return new DigitalAssetWithBytesDto
        {
            DigitalAssetId = asset.DigitalAssetId,
            Name = asset.Name,
            ContentType = asset.ContentType,
            Height = asset.Height,
            Width = asset.Width,
            CreatedDate = asset.CreatedDate,
            Bytes = asset.Bytes
        };
    }
}
