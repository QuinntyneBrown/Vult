// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestimonialService.Api.Features.Testimonials;

namespace TestimonialService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TestimonialsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<GetTestimonialsQueryResult>> GetTestimonials(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? minRating = null,
        [FromQuery] string? sortBy = null)
    {
        var query = new GetTestimonialsQuery
        {
            PageNumber = Math.Max(1, pageNumber),
            PageSize = Math.Clamp(pageSize, 1, 100),
            MinRating = minRating,
            SortBy = sortBy
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TestimonialDto>> GetTestimonial(Guid id)
    {
        var query = new GetTestimonialByIdQuery { TestimonialId = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<TestimonialDto>> CreateTestimonial([FromBody] CreateTestimonialDto dto)
    {
        var command = new CreateTestimonialCommand { Testimonial = dto };
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetTestimonial), new { id = result.TestimonialId }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<TestimonialDto>> UpdateTestimonial(Guid id, [FromBody] UpdateTestimonialDto dto)
    {
        var command = new UpdateTestimonialCommand { TestimonialId = id, Testimonial = dto };
        var result = await _mediator.Send(command);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> DeleteTestimonial(Guid id)
    {
        var command = new DeleteTestimonialCommand { TestimonialId = id };
        var result = await _mediator.Send(command);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
