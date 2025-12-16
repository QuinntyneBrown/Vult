// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.CatalogItems;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PhotoUploadController : ControllerBase
{
    private readonly IngestPhotosCommandHandler _handler;
    private readonly ILogger<PhotoUploadController> _logger;

    public PhotoUploadController(
        IngestPhotosCommandHandler handler,
        ILogger<PhotoUploadController> logger)
    {
        _handler = handler;
        _logger = logger;
    }

    /// <summary>
    /// Upload and ingest multiple photos to create catalog items
    /// </summary>
    /// <param name="files">Photo files to upload</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Ingestion result with created catalog items</returns>
    [HttpPost]
    [ProducesResponseType(typeof(IngestPhotosCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IngestPhotosCommandResult>> UploadPhotos(
        [FromForm] List<IFormFile> files,
        CancellationToken cancellationToken = default)
    {
        if (files == null || !files.Any())
        {
            return BadRequest(new { errors = new[] { "No files provided" } });
        }

        // Validate file types
        var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };
        var invalidFiles = files.Where(f => 
            !validExtensions.Contains(Path.GetExtension(f.FileName).ToLowerInvariant()))
            .ToList();

        if (invalidFiles.Any())
        {
            return BadRequest(new 
            { 
                errors = new[] 
                { 
                    $"Invalid file types. Only image files are allowed: {string.Join(", ", validExtensions)}" 
                } 
            });
        }

        _logger.LogInformation("Uploading {Count} photos for ingestion", files.Count);

        var command = new IngestPhotosCommand { Photos = files };
        var result = await _handler.HandleAsync(command, cancellationToken);

        if (!result.Success && result.Errors.Any())
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result);
    }
}
