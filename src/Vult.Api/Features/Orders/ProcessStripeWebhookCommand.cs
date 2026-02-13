// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Vult.Core;
using Vult.Core.Model.OrderAggregate;
using Vult.Core.Services;

namespace Vult.Api.Features.Orders;

public class ProcessStripeWebhookCommand : IRequest<ProcessStripeWebhookCommandResult>
{
    public string Payload { get; set; } = string.Empty;
    public string Signature { get; set; } = string.Empty;
}

public class ProcessStripeWebhookCommandResult
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public string? EventType { get; set; }
}

public class ProcessStripeWebhookCommandHandler : IRequestHandler<ProcessStripeWebhookCommand, ProcessStripeWebhookCommandResult>
{
    private readonly IVultContext _context;
    private readonly IStripePaymentService _stripeService;
    private readonly ILogger<ProcessStripeWebhookCommandHandler> _logger;

    public ProcessStripeWebhookCommandHandler(
        IVultContext context,
        IStripePaymentService stripeService,
        ILogger<ProcessStripeWebhookCommandHandler> logger)
    {
        _context = context;
        _stripeService = stripeService;
        _logger = logger;
    }

    public async Task<ProcessStripeWebhookCommandResult> Handle(
        ProcessStripeWebhookCommand command,
        CancellationToken cancellationToken)
    {
        var stripeEvent = _stripeService.ValidateWebhookSignature(command.Payload, command.Signature);

        if (stripeEvent == null)
        {
            _logger.LogWarning("Invalid Stripe webhook signature");
            return new ProcessStripeWebhookCommandResult
            {
                Success = false,
                Message = "Invalid webhook signature"
            };
        }

        _logger.LogInformation(
            "Processing Stripe webhook event {EventId} of type {EventType}",
            stripeEvent.EventId, stripeEvent.EventType);

        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.StripePaymentIntentId == stripeEvent.PaymentIntentId, cancellationToken);

        if (order == null)
        {
            _logger.LogWarning(
                "Order not found for PaymentIntent {PaymentIntentId}",
                stripeEvent.PaymentIntentId);

            return new ProcessStripeWebhookCommandResult
            {
                Success = true,
                Message = "Order not found, ignoring event",
                EventType = stripeEvent.EventType
            };
        }

        var now = DateTime.UtcNow;

        switch (stripeEvent.EventType)
        {
            case "payment_intent.succeeded":
                _logger.LogInformation("Payment succeeded for order {OrderNumber}", order.OrderNumber);
                order.StripePaymentStatus = "succeeded";
                order.Status = OrderStatus.Confirmed;
                order.UpdatedDate = now;
                break;

            case "payment_intent.payment_failed":
                _logger.LogWarning("Payment failed for order {OrderNumber}: {Message}",
                    order.OrderNumber, stripeEvent.FailureMessage);
                order.StripePaymentStatus = "failed";
                order.PaymentErrorMessage = stripeEvent.FailureMessage;
                order.Status = OrderStatus.Failed;
                order.UpdatedDate = now;
                break;

            case "payment_intent.canceled":
                _logger.LogInformation("Payment cancelled for order {OrderNumber}", order.OrderNumber);
                order.StripePaymentStatus = "canceled";
                order.Status = OrderStatus.Cancelled;
                order.UpdatedDate = now;
                break;

            case "payment_intent.processing":
                _logger.LogInformation("Payment processing for order {OrderNumber}", order.OrderNumber);
                order.StripePaymentStatus = "processing";
                break;

            default:
                _logger.LogDebug("Unhandled Stripe event type: {EventType}", stripeEvent.EventType);
                break;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new ProcessStripeWebhookCommandResult
        {
            Success = true,
            Message = $"Processed {stripeEvent.EventType}",
            EventType = stripeEvent.EventType
        };
    }
}
