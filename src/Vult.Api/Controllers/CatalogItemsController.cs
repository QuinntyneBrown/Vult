// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.CatalogItems;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CatalogItemsController : ControllerBase
{
    private readonly GetCatalogItemsQueryHandler _getCatalogItemsHandler;
    private readonly GetCatalogItemByIdQueryHandler _getCatalogItemByIdHandler;
    private readonly CreateCatalogItemCommandHandler _createCatalogItemHandler;
    private readonly UpdateCatalogItemCommandHandler _updateCatalogItemHandler;
    private readonly DeleteCatalogItemCommandHandler _deleteCatalogItemHandler;

    public CatalogItemsController(
        GetCatalogItemsQueryHandler getCatalogItemsHandler,
        GetCatalogItemByIdQueryHandler getCatalogItemByIdHandler,
        CreateCatalogItemCommandHandler createCatalogItemHandler,
        UpdateCatalogItemCommandHandler updateCatalogItemHandler,
        DeleteCatalogItemCommandHandler deleteCatalogItemHandler)
    {
        _getCatalogItemsHandler = getCatalogItemsHandler;
        _getCatalogItemByIdHandler = getCatalogItemByIdHandler;
        _createCatalogItemHandler = createCatalogItemHandler;
        _updateCatalogItemHandler = updateCatalogItemHandler;
        _deleteCatalogItemHandler = deleteCatalogItemHandler;
    }

    /// <summary>
    /// Gets a paginated list of catalog items
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10, max: 100)</param>
    /// <param name="brandName">Filter by brand name</param>
    /// <param name="itemType">Filter by item type</param>
    /// <param name="gender">Filter by gender</param>
    /// <param name="sortBy">Sort field (price, price_desc, date, date_desc)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated list of catalog items</returns>
    [HttpGet]
    [ProducesResponseType(typeof(GetCatalogItemsQueryResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetCatalogItemsQueryResult>> GetCatalogItems(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? brandName = null,
        [FromQuery] int? itemType = null,
        [FromQuery] int? gender = null,
        [FromQuery] string? sortBy = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetCatalogItemsQuery
        {
            PageNumber = pageNumber,
            PageSize = Math.Min(pageSize, 100), // Cap at 100
            BrandName = brandName,
            ItemType = itemType.HasValue ? (Vult.Core.Enums.ItemType)itemType.Value : null,
            Gender = gender.HasValue ? (Vult.Core.Enums.Gender)gender.Value : null,
            SortBy = sortBy
        };

        var result = await _getCatalogItemsHandler.HandleAsync(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a single catalog item by ID
    /// </summary>
    /// <param name="id">Catalog item ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Catalog item details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(GetCatalogItemByIdQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetCatalogItemByIdQueryResult>> GetCatalogItemById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetCatalogItemByIdQuery(id);
        var result = await _getCatalogItemByIdHandler.HandleAsync(query, cancellationToken);

        if (result.CatalogItem == null)
        {
            return NotFound(new { message = $"Catalog item with ID {id} not found" });
        }

        return Ok(result);
    }

    /// <summary>
    /// Creates a new catalog item
    /// </summary>
    /// <param name="dto">Catalog item data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created catalog item</returns>
    [HttpPost]
    [ProducesResponseType(typeof(CreateCatalogItemCommandResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateCatalogItemCommandResult>> CreateCatalogItem(
        [FromBody] CreateCatalogItemDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new CreateCatalogItemCommand { CatalogItem = dto };
        var result = await _createCatalogItemHandler.HandleAsync(command, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return CreatedAtAction(
            nameof(GetCatalogItemById),
            new { id = result.CatalogItem!.CatalogItemId },
            result);
    }

    /// <summary>
    /// Updates an existing catalog item
    /// </summary>
    /// <param name="id">Catalog item ID</param>
    /// <param name="dto">Updated catalog item data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated catalog item</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UpdateCatalogItemCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UpdateCatalogItemCommandResult>> UpdateCatalogItem(
        Guid id,
        [FromBody] UpdateCatalogItemDto dto,
        CancellationToken cancellationToken = default)
    {
        // Validate that the ID in the route matches the ID in the DTO (if provided)
        if (dto.CatalogItemId != Guid.Empty && dto.CatalogItemId != id)
        {
            return BadRequest(new { errors = new[] { "The ID in the URL does not match the ID in the request body" } });
        }
        
        // Set the ID from the route to ensure consistency
        dto.CatalogItemId = id;
        
        var command = new UpdateCatalogItemCommand
        {
            CatalogItem = dto
        };

        var result = await _updateCatalogItemHandler.HandleAsync(command, cancellationToken);

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
    /// Deletes a catalog item
    /// </summary>
    /// <param name="id">Catalog item ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCatalogItem(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var command = new DeleteCatalogItemCommand(id);
        var result = await _deleteCatalogItemHandler.HandleAsync(command, cancellationToken);

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
