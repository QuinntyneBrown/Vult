// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.Orders;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/webhooks/stripe")]
public class StripeWebhookController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<StripeWebhookController> _logger;

    public StripeWebhookController(IMediator mediator, ILogger<StripeWebhookController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Handles Stripe webhook events
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> HandleWebhook(CancellationToken cancellationToken = default)
    {
        string payload;
        using (var reader = new StreamReader(Request.Body))
        {
            payload = await reader.ReadToEndAsync(cancellationToken);
        }

        var signature = Request.Headers["Stripe-Signature"].FirstOrDefault();

        if (string.IsNullOrEmpty(signature))
        {
            _logger.LogWarning("Stripe webhook received without signature");
            return BadRequest(new { error = "Missing Stripe signature" });
        }

        var command = new ProcessStripeWebhookCommand
        {
            Payload = payload,
            Signature = signature
        };

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            _logger.LogWarning("Failed to process Stripe webhook: {Message}", result.Message);
            return BadRequest(new { error = result.Message });
        }

        _logger.LogInformation(
            "Successfully processed Stripe webhook event: {EventType}",
            result.EventType);

        return Ok(new { received = true, eventType = result.EventType });
    }
}
