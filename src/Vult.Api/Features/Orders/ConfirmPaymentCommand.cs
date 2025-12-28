// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Vult.Core;
using Vult.Core.Model.OrderAggregate;
using Vult.Core.Services;

namespace Vult.Api.Features.Orders;

public class ConfirmPaymentCommand : IRequest<ConfirmPaymentCommandResult>
{
    public Guid OrderId { get; set; }
    public string PaymentIntentId { get; set; } = string.Empty;
}

public class ConfirmPaymentCommandResult
{
    public bool Success { get; set; }
    public OrderDto? Order { get; set; }
    public string? Message { get; set; }
    public List<string> Errors { get; set; } = new();
}

public class ConfirmPaymentCommandHandler : IRequestHandler<ConfirmPaymentCommand, ConfirmPaymentCommandResult>
{
    private readonly IVultContext _context;
    private readonly IStripePaymentService _stripeService;
    private readonly ILogger<ConfirmPaymentCommandHandler> _logger;

    public ConfirmPaymentCommandHandler(
        IVultContext context,
        IStripePaymentService stripeService,
        ILogger<ConfirmPaymentCommandHandler> logger)
    {
        _context = context;
        _stripeService = stripeService;
        _logger = logger;
    }

    public async Task<ConfirmPaymentCommandResult> Handle(
        ConfirmPaymentCommand command,
        CancellationToken cancellationToken)
    {
        var result = new ConfirmPaymentCommandResult();

        var order = await _context.Orders
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.OrderId == command.OrderId, cancellationToken);

        if (order == null)
        {
            result.Success = false;
            result.Errors.Add($"Order with ID {command.OrderId} not found");
            return result;
        }

        if (order.StripePaymentIntentId != command.PaymentIntentId)
        {
            result.Success = false;
            result.Errors.Add("Payment intent does not match this order");
            return result;
        }

        var paymentResult = await _stripeService.GetPaymentIntentAsync(command.PaymentIntentId, cancellationToken);

        if (!paymentResult.Success)
        {
            _logger.LogError(
                "Failed to get PaymentIntent {PaymentIntentId} from Stripe: {Error}",
                command.PaymentIntentId, paymentResult.ErrorMessage);

            result.Success = false;
            result.Errors.Add($"Failed to verify payment: {paymentResult.ErrorMessage}");
            return result;
        }

        var now = DateTime.UtcNow;
        order.StripePaymentStatus = paymentResult.Status;
        order.UpdatedDate = now;

        switch (paymentResult.Status)
        {
            case "succeeded":
                order.Status = OrderStatus.Confirmed;
                result.Message = "Payment confirmed successfully";
                break;

            case "processing":
                result.Message = "Payment is being processed";
                break;

            case "requires_action":
                result.Message = "Additional action required to complete payment";
                break;

            case "requires_payment_method":
                result.Message = "Payment method required";
                break;

            case "canceled":
                order.Status = OrderStatus.Cancelled;
                result.Message = "Payment was cancelled";
                break;

            default:
                _logger.LogWarning("Unknown payment status {Status} for order {OrderNumber}",
                    paymentResult.Status, order.OrderNumber);
                result.Message = $"Payment status: {paymentResult.Status}";
                break;
        }

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Confirmed payment for order {OrderNumber}, status: {Status}",
            order.OrderNumber, paymentResult.Status);

        result.Success = true;
        result.Order = order.ToDto();

        return result;
    }
}
