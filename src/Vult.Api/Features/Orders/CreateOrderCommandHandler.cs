// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.Extensions.Logging;
using Vult.Core;
using Vult.Core.Model.OrderAggregate;
using Vult.Core.Services;

namespace Vult.Api.Features.Orders;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreateOrderCommandResult>
{
    private readonly IVultContext _context;
    private readonly IStripePaymentService _stripeService;
    private readonly ILogger<CreateOrderCommandHandler> _logger;

    public CreateOrderCommandHandler(
        IVultContext context,
        IStripePaymentService stripeService,
        ILogger<CreateOrderCommandHandler> logger)
    {
        _context = context;
        _stripeService = stripeService;
        _logger = logger;
    }

    public async Task<CreateOrderCommandResult> Handle(CreateOrderCommand command, CancellationToken cancellationToken)
    {
        var result = new CreateOrderCommandResult();

        var errors = ValidateCommand(command);
        if (errors.Any())
        {
            result.Success = false;
            result.Errors = errors;
            return result;
        }

        var order = command.Order.ToOrder();

        _logger.LogInformation(
            "Creating order {OrderNumber} for {CustomerEmail}, total: {Total}",
            order.OrderNumber, order.CustomerEmail, order.Total);

        // Create Stripe PaymentIntent
        var amountInCents = (long)(order.Total * 100);
        var paymentResult = await _stripeService.CreatePaymentIntentAsync(
            amountInCents,
            order.Currency.ToLower(),
            order.CustomerEmail,
            order.OrderId,
            cancellationToken);

        if (!paymentResult.Success)
        {
            _logger.LogError("Failed to create PaymentIntent for order {OrderNumber}: {Error}",
                order.OrderNumber, paymentResult.ErrorMessage);
            result.Success = false;
            result.Errors.Add($"Payment initialization failed: {paymentResult.ErrorMessage}");
            return result;
        }

        order.StripePaymentIntentId = paymentResult.PaymentIntentId;
        order.StripePaymentStatus = paymentResult.Status;
        order.Status = OrderStatus.PaymentProcessing;
        order.UpdatedDate = DateTime.UtcNow;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Created order {OrderNumber} with PaymentIntent {PaymentIntentId}",
            order.OrderNumber, paymentResult.PaymentIntentId);

        result.Success = true;
        result.Order = order.ToDto();
        result.ClientSecret = paymentResult.ClientSecret;
        result.PaymentIntentId = paymentResult.PaymentIntentId;

        return result;
    }

    private List<string> ValidateCommand(CreateOrderCommand command)
    {
        var errors = new List<string>();

        if (command.Order == null)
        {
            errors.Add("Order is required");
            return errors;
        }

        if (string.IsNullOrWhiteSpace(command.Order.CustomerEmail))
            errors.Add("Customer email is required");

        if (string.IsNullOrWhiteSpace(command.Order.ShippingFullName))
            errors.Add("Shipping name is required");

        if (string.IsNullOrWhiteSpace(command.Order.ShippingAddressLine1))
            errors.Add("Shipping address is required");

        if (string.IsNullOrWhiteSpace(command.Order.ShippingCity))
            errors.Add("Shipping city is required");

        if (string.IsNullOrWhiteSpace(command.Order.ShippingProvince))
            errors.Add("Shipping province is required");

        if (string.IsNullOrWhiteSpace(command.Order.ShippingPostalCode))
            errors.Add("Shipping postal code is required");

        if (command.Order.LineItems == null || !command.Order.LineItems.Any())
        {
            errors.Add("At least one line item is required");
        }
        else
        {
            foreach (var item in command.Order.LineItems)
            {
                if (item.Quantity <= 0)
                    errors.Add($"Invalid quantity for product {item.ProductName}");
                if (item.UnitPrice <= 0)
                    errors.Add($"Invalid price for product {item.ProductName}");
            }
        }

        return errors;
    }
}
