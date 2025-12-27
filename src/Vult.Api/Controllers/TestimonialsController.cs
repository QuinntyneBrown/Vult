// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.Testimonials;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<TestimonialsController> _logger;

    public TestimonialsController(IMediator mediator, ILogger<TestimonialsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Gets a paginated list of testimonials
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10, max: 100)</param>
    /// <param name="minRating">Filter by minimum rating (1-5)</param>
    /// <param name="sortBy">Sort field (rating, rating_desc, date, date_desc, name, name_desc)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated list of testimonials</returns>
    [HttpGet]
    [ProducesResponseType(typeof(GetTestimonialsQueryResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetTestimonialsQueryResult>> GetTestimonials(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? minRating = null,
        [FromQuery] string? sortBy = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetTestimonialsQuery
        {
            PageNumber = pageNumber,
            PageSize = Math.Min(pageSize, 100),
            MinRating = minRating,
            SortBy = sortBy
        };

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a single testimonial by ID
    /// </summary>
    /// <param name="id">Testimonial ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Testimonial details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(GetTestimonialByIdQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetTestimonialByIdQueryResult>> GetTestimonialById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetTestimonialByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);

        if (result.Testimonial == null)
        {
            return NotFound(new { message = $"Testimonial with ID {id} not found" });
        }

        return Ok(result);
    }

    /// <summary>
    /// Creates a new testimonial
    /// </summary>
    /// <param name="dto">Testimonial data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created testimonial</returns>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(CreateTestimonialCommandResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateTestimonialCommandResult>> CreateTestimonial(
        [FromBody] CreateTestimonialDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new CreateTestimonialCommand { Testimonial = dto };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return CreatedAtAction(
            nameof(GetTestimonialById),
            new { id = result.Testimonial!.TestimonialId },
            result);
    }

    /// <summary>
    /// Updates an existing testimonial
    /// </summary>
    /// <param name="id">Testimonial ID</param>
    /// <param name="dto">Updated testimonial data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated testimonial</returns>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(UpdateTestimonialCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UpdateTestimonialCommandResult>> UpdateTestimonial(
        Guid id,
        [FromBody] UpdateTestimonialDto dto,
        CancellationToken cancellationToken = default)
    {
        // Validate that the ID in the route matches the ID in the DTO (if provided)
        if (dto.TestimonialId != Guid.Empty && dto.TestimonialId != id)
        {
            return BadRequest(new { errors = new[] { "The ID in the URL does not match the ID in the request body" } });
        }

        // Set the ID from the route to ensure consistency
        dto.TestimonialId = id;

        var command = new UpdateTestimonialCommand
        {
            Testimonial = dto
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
    /// Deletes a testimonial
    /// </summary>
    /// <param name="id">Testimonial ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTestimonial(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var command = new DeleteTestimonialCommand(id);
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
