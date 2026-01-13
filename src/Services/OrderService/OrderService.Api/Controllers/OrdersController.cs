// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Api.Features.Orders;
using OrderService.Api.Model;

namespace OrderService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<GetOrdersQueryResult>> GetOrders(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] Guid? customerId = null,
        [FromQuery] OrderStatus? status = null)
    {
        var query = new GetOrdersQuery
        {
            PageNumber = Math.Max(1, pageNumber),
            PageSize = Math.Clamp(pageSize, 1, 100),
            CustomerId = customerId,
            Status = status
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<OrderDto>> GetOrder(Guid id)
    {
        var query = new GetOrderByIdQuery { OrderId = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("number/{orderNumber}")]
    [Authorize]
    public async Task<ActionResult<OrderDto>> GetOrderByNumber(string orderNumber)
    {
        var query = new GetOrderByNumberQuery { OrderNumber = orderNumber };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var command = new CreateOrderCommand { Order = dto };
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetOrder), new { id = result.OrderId }, result);
    }

    [HttpPut("{id:guid}/status")]
    [Authorize]
    public async Task<ActionResult<OrderDto>> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
    {
        var command = new UpdateOrderStatusCommand
        {
            OrderId = id,
            NewStatus = dto.Status
        };

        var result = await _mediator.Send(command);

        if (result == null)
        {
            return BadRequest(new { message = "Invalid status transition or order not found" });
        }

        return Ok(result);
    }
}
