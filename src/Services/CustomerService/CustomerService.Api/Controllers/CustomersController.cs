// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using CustomerService.Api.Features.Customers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CustomerService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<CustomerDto>>> GetCustomers([FromQuery] bool includeDeleted = false)
    {
        var query = new GetCustomersQuery { IncludeDeleted = includeDeleted };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<CustomerDto>> GetCustomer(Guid id)
    {
        var query = new GetCustomerByIdQuery { CustomerId = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("user/{userId:guid}")]
    [Authorize]
    public async Task<ActionResult<CustomerDto>> GetCustomerByUserId(Guid userId)
    {
        var query = new GetCustomerByUserIdQuery { UserId = userId };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CustomerDto>> CreateCustomer([FromBody] CreateCustomerDto dto)
    {
        var command = new CreateCustomerCommand { Customer = dto };
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCustomer), new { id = result.CustomerId }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<CustomerDto>> UpdateCustomer(Guid id, [FromBody] UpdateCustomerDto dto)
    {
        var command = new UpdateCustomerCommand { CustomerId = id, Customer = dto };
        var result = await _mediator.Send(command);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> DeleteCustomer(Guid id)
    {
        var command = new DeleteCustomerCommand { CustomerId = id };
        var result = await _mediator.Send(command);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("{id:guid}/addresses")]
    [Authorize]
    public async Task<ActionResult<CustomerAddressDto>> AddAddress(Guid id, [FromBody] CreateCustomerAddressDto dto)
    {
        var command = new AddCustomerAddressCommand { CustomerId = id, Address = dto };
        var result = await _mediator.Send(command);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}
