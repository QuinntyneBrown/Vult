// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using DigitalAssetService.Api.Features.DigitalAssets;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigitalAssetService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DigitalAssetsController : ControllerBase
{
    private readonly IMediator _mediator;
    private const long MaxFileSize = 10 * 1024 * 1024; // 10MB

    public DigitalAssetsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<GetDigitalAssetsQueryResult>> GetDigitalAssets(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = new GetDigitalAssetsQuery
        {
            PageNumber = Math.Max(1, pageNumber),
            PageSize = Math.Clamp(pageSize, 1, 100)
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DigitalAssetDto>> GetDigitalAsset(Guid id)
    {
        var query = new GetDigitalAssetByIdQuery { DigitalAssetId = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result.ToDto());
    }

    [HttpGet("{id:guid}/serve")]
    [ResponseCache(Duration = 3600)]
    public async Task<ActionResult> ServeDigitalAsset(Guid id)
    {
        var query = new GetDigitalAssetByIdQuery { DigitalAssetId = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return File(result.Bytes, result.ContentType, result.Name);
    }

    [HttpGet("serve/{filename}")]
    [ResponseCache(Duration = 3600)]
    public async Task<ActionResult> ServeDigitalAssetByName(string filename)
    {
        var query = new GetDigitalAssetByNameQuery { Name = filename };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return File(result.Bytes, result.ContentType, result.Name);
    }

    [HttpPost]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<ActionResult<DigitalAssetDto>> UploadDigitalAsset(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file provided" });
        }

        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        var command = new UploadDigitalAssetCommand
        {
            Name = file.FileName,
            Bytes = memoryStream.ToArray(),
            ContentType = file.ContentType,
            Height = 0,
            Width = 0
        };

        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetDigitalAsset), new { id = result.DigitalAssetId }, result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> DeleteDigitalAsset(Guid id)
    {
        var command = new DeleteDigitalAssetCommand { DigitalAssetId = id };
        var result = await _mediator.Send(command);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
