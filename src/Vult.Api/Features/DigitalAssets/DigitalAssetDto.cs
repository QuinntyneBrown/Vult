// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Api.Features.DigitalAssets;

/// <summary>
/// Data transfer object for digital asset responses.
/// Note: Bytes are excluded from list responses to reduce payload size.
/// </summary>
public class DigitalAssetDto
{
    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public float Height { get; set; }
    public float Width { get; set; }
    public DateTime CreatedDate { get; set; }
}

/// <summary>
/// Extended DTO that includes binary content for serving files.
/// </summary>
public class DigitalAssetWithBytesDto : DigitalAssetDto
{
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
}
