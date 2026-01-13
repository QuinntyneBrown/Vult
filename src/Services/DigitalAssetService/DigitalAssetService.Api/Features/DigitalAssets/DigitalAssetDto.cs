// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using DigitalAssetService.Api.Model;

namespace DigitalAssetService.Api.Features.DigitalAssets;

public class DigitalAssetDto
{
    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public int Size { get; set; }
    public float Height { get; set; }
    public float Width { get; set; }
    public DateTime CreatedDate { get; set; }
}

public static class DigitalAssetExtensions
{
    public static DigitalAssetDto ToDto(this DigitalAsset asset)
    {
        return new DigitalAssetDto
        {
            DigitalAssetId = asset.DigitalAssetId,
            Name = asset.Name,
            ContentType = asset.ContentType,
            Size = asset.Bytes.Length,
            Height = asset.Height,
            Width = asset.Width,
            CreatedDate = asset.CreatedDate
        };
    }
}
