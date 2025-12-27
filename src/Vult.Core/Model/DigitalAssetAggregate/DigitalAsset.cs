// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Model.DigitalAssetAggregate;

/// <summary>
/// Represents a digital asset (image/file) stored in the system.
/// Based on Coop repository's DigitalAsset implementation.
/// </summary>
public class DigitalAsset
{
    /// <summary>
    /// Unique identifier for the digital asset.
    /// </summary>
    public Guid DigitalAssetId { get; set; }

    /// <summary>
    /// Asset filename/designation.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Binary file content.
    /// </summary>
    public byte[] Bytes { get; set; } = Array.Empty<byte>();

    /// <summary>
    /// MIME content type (e.g., "image/jpeg").
    /// </summary>
    public string ContentType { get; set; } = string.Empty;

    /// <summary>
    /// Image height in pixels.
    /// </summary>
    public float Height { get; set; }

    /// <summary>
    /// Image width in pixels.
    /// </summary>
    public float Width { get; set; }

    /// <summary>
    /// Timestamp when the asset was created.
    /// </summary>
    public DateTime CreatedDate { get; set; }
}
