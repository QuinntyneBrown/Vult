// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.DigitalAssets;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DigitalAssetsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<DigitalAssetsController> _logger;

    public DigitalAssetsController(IMediator mediator, ILogger<DigitalAssetsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Upload a digital asset
    /// </summary>
    /// <param name="file">File to upload</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created digital asset</returns>
    [HttpPost]
    [RequestSizeLimit(10_000_000)] // 10MB limit
    [ProducesResponseType(typeof(UploadDigitalAssetCommandResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UploadDigitalAssetCommandResult>> UploadDigitalAsset(
        [FromForm] IFormFile file,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Uploading digital asset: {FileName}", file?.FileName ?? "null");

        var command = new UploadDigitalAssetCommand { File = file };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return CreatedAtAction(
            nameof(GetDigitalAssetById),
            new { id = result.DigitalAsset!.DigitalAssetId },
            result);
    }

    /// <summary>
    /// Get paginated list of digital assets
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10, max: 100)</param>
    /// <param name="sortBy">Sort field (name, name_desc, date, date_desc)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated list of digital assets</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(GetDigitalAssetsQueryResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetDigitalAssetsQueryResult>> GetDigitalAssets(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? sortBy = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetDigitalAssetsQuery
        {
            PageNumber = pageNumber,
            PageSize = Math.Min(pageSize, 100),
            SortBy = sortBy
        };

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get digital asset by ID
    /// </summary>
    /// <param name="id">Digital asset ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Digital asset details</returns>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(GetDigitalAssetByIdQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetDigitalAssetByIdQueryResult>> GetDigitalAssetById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetDigitalAssetByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);

        if (result.DigitalAsset == null)
        {
            return NotFound(new { message = $"Digital asset with ID {id} not found" });
        }

        return Ok(new { digitalAsset = result.DigitalAsset.ToMetadataDto() });
    }

    /// <summary>
    /// Get digital asset by filename
    /// </summary>
    /// <param name="filename">Filename to search for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Digital asset details</returns>
    [HttpGet("filename/{filename}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(GetDigitalAssetByFilenameQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetDigitalAssetByFilenameQueryResult>> GetDigitalAssetByFilename(
        string filename,
        CancellationToken cancellationToken = default)
    {
        var query = new GetDigitalAssetByFilenameQuery(filename);
        var result = await _mediator.Send(query, cancellationToken);

        if (result.DigitalAsset == null)
        {
            return NotFound(new { message = $"Digital asset with filename '{filename}' not found" });
        }

        return Ok(new { digitalAsset = result.DigitalAsset.ToMetadataDto() });
    }

    /// <summary>
    /// Serve digital asset by ID (returns raw file content)
    /// </summary>
    /// <param name="id">Digital asset ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Raw file content with appropriate content type</returns>
    [HttpGet("{id:guid}/serve")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ServeDigitalAsset(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetDigitalAssetByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);

        if (result.DigitalAsset == null)
        {
            return NotFound();
        }

        Response.Headers["Cache-Control"] = "public, max-age=86400";

        return File(result.DigitalAsset.Bytes, result.DigitalAsset.ContentType);
    }

    /// <summary>
    /// Serve digital asset by filename (returns raw file content)
    /// </summary>
    /// <param name="filename">Filename of the asset</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Raw file content with appropriate content type</returns>
    [HttpGet("serve/{filename}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ServeDigitalAssetByFilename(
        string filename,
        CancellationToken cancellationToken = default)
    {
        var query = new GetDigitalAssetByFilenameQuery(filename);
        var result = await _mediator.Send(query, cancellationToken);

        if (result.DigitalAsset == null)
        {
            return NotFound();
        }

        Response.Headers["Cache-Control"] = "public, max-age=86400";

        return File(result.DigitalAsset.Bytes, result.DigitalAsset.ContentType);
    }

    /// <summary>
    /// Delete digital asset
    /// </summary>
    /// <param name="id">Digital asset ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content</returns>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteDigitalAsset(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var command = new DeleteDigitalAssetCommand(id);
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found")))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        return NoContent();
    }
}

// Extension method to convert DTO with bytes to metadata-only DTO for JSON responses
internal static class DigitalAssetDtoExtensions
{
    public static DigitalAssetDto ToMetadataDto(this DigitalAssetWithBytesDto dto)
    {
        return new DigitalAssetDto
        {
            DigitalAssetId = dto.DigitalAssetId,
            Name = dto.Name,
            ContentType = dto.ContentType,
            Height = dto.Height,
            Width = dto.Width,
            CreatedDate = dto.CreatedDate
        };
    }
}
