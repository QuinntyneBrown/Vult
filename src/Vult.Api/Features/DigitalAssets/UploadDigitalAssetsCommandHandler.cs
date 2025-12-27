// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Vult.Core;
using Vult.Core.Model.DigitalAssetAggregate;

namespace Vult.Api.Features.DigitalAssets;

public class UploadDigitalAssetsCommandHandler : IRequestHandler<UploadDigitalAssetsCommand, UploadDigitalAssetsCommandResult>
{
    private readonly IVultContext _context;
    private static readonly string[] ValidExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
    private static readonly Dictionary<string, string> MimeTypes = new()
    {
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".png", "image/png" },
        { ".gif", "image/gif" },
        { ".bmp", "image/bmp" },
        { ".webp", "image/webp" }
    };
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB per file

    public UploadDigitalAssetsCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<UploadDigitalAssetsCommandResult> Handle(UploadDigitalAssetsCommand command, CancellationToken cancellationToken)
    {
        var result = new UploadDigitalAssetsCommandResult();

        // Validate files are provided
        if (command.Files == null || command.Files.Count == 0)
        {
            result.Success = false;
            result.Errors.Add("No files provided");
            return result;
        }

        result.TotalProcessed = command.Files.Count;
        var processedAssets = new List<DigitalAsset>();

        foreach (var file in command.Files)
        {
            var fileResult = await ProcessFileAsync(file, cancellationToken);

            if (fileResult.Asset != null)
            {
                processedAssets.Add(fileResult.Asset);
                result.SuccessfullyProcessed++;
            }
            else
            {
                result.Failed++;
                result.Errors.AddRange(fileResult.Errors.Select(e => $"{file.FileName}: {e}"));
            }
        }

        // Save all successful assets to database
        if (processedAssets.Count > 0)
        {
            _context.DigitalAssets.AddRange(processedAssets);
            await _context.SaveChangesAsync(cancellationToken);

            result.DigitalAssets = processedAssets.Select(a => a.ToDto()).ToList();
        }

        result.Success = result.SuccessfullyProcessed > 0;

        return result;
    }

    private async Task<FileProcessingResult> ProcessFileAsync(Microsoft.AspNetCore.Http.IFormFile file, CancellationToken cancellationToken)
    {
        var result = new FileProcessingResult();

        // Validate file is not empty
        if (file.Length == 0)
        {
            result.Errors.Add("File is empty");
            return result;
        }

        // Validate file size
        if (file.Length > MaxFileSizeBytes)
        {
            result.Errors.Add($"File size exceeds maximum allowed size of {MaxFileSizeBytes / 1024 / 1024}MB");
            return result;
        }

        // Validate file extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!ValidExtensions.Contains(extension))
        {
            result.Errors.Add($"Invalid file type. Allowed types: {string.Join(", ", ValidExtensions)}");
            return result;
        }

        // Read file bytes
        byte[] bytes;
        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream, cancellationToken);
            bytes = memoryStream.ToArray();
        }

        // Validate file signature (magic bytes)
        if (!ValidateFileSignature(bytes, extension))
        {
            result.Errors.Add("File content does not match the declared file type");
            return result;
        }

        // Get image dimensions
        var (width, height) = GetImageDimensions(bytes, extension);

        // Determine content type
        var contentType = MimeTypes.GetValueOrDefault(extension, "application/octet-stream");

        // Create digital asset
        result.Asset = new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = file.FileName,
            Bytes = bytes,
            ContentType = contentType,
            Width = width,
            Height = height,
            CreatedDate = DateTime.UtcNow
        };

        return result;
    }

    private static bool ValidateFileSignature(byte[] bytes, string extension)
    {
        if (bytes.Length < 4) return false;

        return extension switch
        {
            ".jpg" or ".jpeg" => bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF,
            ".png" => bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47,
            ".gif" => bytes[0] == 0x47 && bytes[1] == 0x49 && bytes[2] == 0x46,
            ".bmp" => bytes[0] == 0x42 && bytes[1] == 0x4D,
            ".webp" => bytes.Length >= 12 && bytes[0] == 0x52 && bytes[1] == 0x49 && bytes[2] == 0x46 && bytes[3] == 0x46,
            _ => true // Allow unknown extensions to pass
        };
    }

    private static (float Width, float Height) GetImageDimensions(byte[] bytes, string extension)
    {
        try
        {
            return extension switch
            {
                ".png" => GetPngDimensions(bytes),
                ".jpg" or ".jpeg" => GetJpegDimensions(bytes),
                ".gif" => GetGifDimensions(bytes),
                ".bmp" => GetBmpDimensions(bytes),
                _ => (0, 0)
            };
        }
        catch
        {
            return (0, 0);
        }
    }

    private static (float Width, float Height) GetPngDimensions(byte[] bytes)
    {
        if (bytes.Length < 24) return (0, 0);

        // PNG dimensions are at bytes 16-23 (big endian)
        var width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
        var height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];

        return (width, height);
    }

    private static (float Width, float Height) GetJpegDimensions(byte[] bytes)
    {
        // JPEG dimension parsing is complex; return 0 for now
        // In production, use System.Drawing or ImageSharp
        return (0, 0);
    }

    private static (float Width, float Height) GetGifDimensions(byte[] bytes)
    {
        if (bytes.Length < 10) return (0, 0);

        // GIF dimensions are at bytes 6-9 (little endian)
        var width = bytes[6] | (bytes[7] << 8);
        var height = bytes[8] | (bytes[9] << 8);

        return (width, height);
    }

    private static (float Width, float Height) GetBmpDimensions(byte[] bytes)
    {
        if (bytes.Length < 26) return (0, 0);

        // BMP dimensions are at bytes 18-25 (little endian)
        var width = bytes[18] | (bytes[19] << 8) | (bytes[20] << 16) | (bytes[21] << 24);
        var height = bytes[22] | (bytes[23] << 8) | (bytes[24] << 16) | (bytes[25] << 24);

        return (width, Math.Abs(height));
    }

    private class FileProcessingResult
    {
        public DigitalAsset? Asset { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
