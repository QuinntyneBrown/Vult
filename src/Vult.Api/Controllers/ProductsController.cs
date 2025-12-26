// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.Products;
using Vult.Core;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Upload and ingest multiple photos to create products
    /// </summary>
    /// <param name="files">Photo files to upload</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Ingestion result with created products</returns>
    [HttpPost("photos")]
    [RequestSizeLimit(100_000_000)] // 100MB limit
    [ProducesResponseType(typeof(IngestProductPhotosCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IngestProductPhotosCommandResult>> UploadPhotos(
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

        var command = new IngestProductPhotosCommand { Photos = files };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success && result.Errors.Any())
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result);
    }

    /// <summary>
    /// Gets a paginated list of products
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10, max: 100)</param>
    /// <param name="brandName">Filter by brand name</param>
    /// <param name="itemType">Filter by item type</param>
    /// <param name="gender">Filter by gender</param>
    /// <param name="sortBy">Sort field (price, price_desc, date, date_desc)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated list of products</returns>
    [HttpGet]
    [ProducesResponseType(typeof(GetProductsQueryResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetProductsQueryResult>> GetProducts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? brandName = null,
        [FromQuery] int? itemType = null,
        [FromQuery] int? gender = null,
        [FromQuery] string? sortBy = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetProductsQuery
        {
            PageNumber = pageNumber,
            PageSize = Math.Min(pageSize, 100), // Cap at 100
            BrandName = brandName,
            ItemType = itemType.HasValue ? (ItemType)itemType.Value : null,
            Gender = gender.HasValue ? (Gender)gender.Value : null,
            SortBy = sortBy
        };

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a single product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Product details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(GetProductByIdQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetProductByIdQueryResult>> GetProductById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetProductByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);

        if (result.Product == null)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }

        return Ok(result);
    }

    /// <summary>
    /// Creates a new product
    /// </summary>
    /// <param name="dto">Product data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created product</returns>
    [HttpPost]
    [ProducesResponseType(typeof(CreateProductCommandResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateProductCommandResult>> CreateProduct(
        [FromBody] CreateProductDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new CreateProductCommand { Product = dto };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return CreatedAtAction(
            nameof(GetProductById),
            new { id = result.Product!.ProductId },
            result);
    }

    /// <summary>
    /// Updates an existing product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="dto">Updated product data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated product</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UpdateProductCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UpdateProductCommandResult>> UpdateProduct(
        Guid id,
        [FromBody] UpdateProductDto dto,
        CancellationToken cancellationToken = default)
    {
        // Validate that the ID in the route matches the ID in the DTO (if provided)
        if (dto.ProductId != Guid.Empty && dto.ProductId != id)
        {
            return BadRequest(new { errors = new[] { "The ID in the URL does not match the ID in the request body" } });
        }

        // Set the ID from the route to ensure consistency
        dto.ProductId = id;

        var command = new UpdateProductCommand
        {
            Product = dto
        };

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found")))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result);
    }

    /// <summary>
    /// Deletes a product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var command = new DeleteProductCommand(id);
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
