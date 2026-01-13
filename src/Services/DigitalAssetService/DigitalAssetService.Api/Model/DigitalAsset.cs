// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace DigitalAssetService.Api.Model;

public class DigitalAsset
{
    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = string.Empty;
    public float Height { get; set; }
    public float Width { get; set; }
    public DateTime CreatedDate { get; set; }
}
