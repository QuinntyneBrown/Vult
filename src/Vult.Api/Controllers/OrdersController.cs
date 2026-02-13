// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.Orders;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IMediator mediator, ILogger<OrdersController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new order and initializes Stripe payment
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CreateOrderCommandResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateOrderCommandResult>> CreateOrder(
        [FromBody] CreateOrderDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new CreateOrderCommand { Order = dto };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return CreatedAtAction(
            nameof(GetOrderById),
            new { id = result.Order!.OrderId },
            result);
    }

    /// <summary>
    /// Gets an order by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(GetOrderByIdQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetOrderByIdQueryResult>> GetOrderById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetOrderByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);

        if (!result.Success)
        {
            return NotFound(new { message = result.ErrorMessage });
        }

        return Ok(result);
    }

    /// <summary>
    /// Gets an order by order number
    /// </summary>
    [HttpGet("by-number/{orderNumber}")]
    [ProducesResponseType(typeof(GetOrderByNumberQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetOrderByNumberQueryResult>> GetOrderByNumber(
        string orderNumber,
        CancellationToken cancellationToken = default)
    {
        var query = new GetOrderByNumberQuery(orderNumber);
        var result = await _mediator.Send(query, cancellationToken);

        if (!result.Success)
        {
            return NotFound(new { message = result.ErrorMessage });
        }

        return Ok(result);
    }

    /// <summary>
    /// Confirms a payment after Stripe payment completion
    /// </summary>
    [HttpPost("{id:guid}/confirm-payment")]
    [ProducesResponseType(typeof(ConfirmPaymentCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ConfirmPaymentCommandResult>> ConfirmPayment(
        Guid id,
        [FromBody] ConfirmPaymentRequest request,
        CancellationToken cancellationToken = default)
    {
        var command = new ConfirmPaymentCommand
        {
            OrderId = id,
            PaymentIntentId = request.PaymentIntentId
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
}

public class ConfirmPaymentRequest
{
    public string PaymentIntentId { get; set; } = string.Empty;
}
