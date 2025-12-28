// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stripe;
using Vult.Core.Services;

namespace Vult.Infrastructure.Services;

public class StripeSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string PublishableKey { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
}

public class StripePaymentService : IStripePaymentService
{
    private readonly StripeSettings _settings;
    private readonly ILogger<StripePaymentService> _logger;
    private readonly PaymentIntentService _paymentIntentService;
    private readonly RefundService _refundService;

    public StripePaymentService(
        IOptions<StripeSettings> settings,
        ILogger<StripePaymentService> logger)
    {
        _settings = settings.Value;
        _logger = logger;

        StripeConfiguration.ApiKey = _settings.SecretKey;

        _paymentIntentService = new PaymentIntentService();
        _refundService = new RefundService();
    }

    public async Task<PaymentIntentResult> CreatePaymentIntentAsync(
        long amount,
        string currency,
        string customerEmail,
        Guid orderId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation(
                "Creating PaymentIntent for order {OrderId}, amount: {Amount} {Currency}",
                orderId, amount, currency);

            var options = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = currency.ToLower(),
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
                ReceiptEmail = customerEmail,
                Metadata = new Dictionary<string, string>
                {
                    { "order_id", orderId.ToString() }
                }
            };

            var paymentIntent = await _paymentIntentService.CreateAsync(options, cancellationToken: cancellationToken);

            _logger.LogInformation(
                "Created PaymentIntent {PaymentIntentId} for order {OrderId}",
                paymentIntent.Id, orderId);

            return new PaymentIntentResult
            {
                Success = true,
                PaymentIntentId = paymentIntent.Id,
                ClientSecret = paymentIntent.ClientSecret,
                Status = paymentIntent.Status,
                Amount = paymentIntent.Amount,
                Currency = paymentIntent.Currency
            };
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Failed to create PaymentIntent for order {OrderId}", orderId);
            return new PaymentIntentResult
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<PaymentIntentResult> GetPaymentIntentAsync(
        string paymentIntentId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var paymentIntent = await _paymentIntentService.GetAsync(paymentIntentId, cancellationToken: cancellationToken);

            return new PaymentIntentResult
            {
                Success = true,
                PaymentIntentId = paymentIntent.Id,
                ClientSecret = paymentIntent.ClientSecret,
                Status = paymentIntent.Status,
                Amount = paymentIntent.Amount,
                Currency = paymentIntent.Currency,
                ReceiptUrl = paymentIntent.LatestCharge?.ReceiptUrl
            };
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Failed to get PaymentIntent {PaymentIntentId}", paymentIntentId);
            return new PaymentIntentResult
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<bool> CancelPaymentIntentAsync(
        string paymentIntentId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Cancelling PaymentIntent {PaymentIntentId}", paymentIntentId);

            await _paymentIntentService.CancelAsync(paymentIntentId, cancellationToken: cancellationToken);

            _logger.LogInformation("Cancelled PaymentIntent {PaymentIntentId}", paymentIntentId);
            return true;
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Failed to cancel PaymentIntent {PaymentIntentId}", paymentIntentId);
            return false;
        }
    }

    public async Task<RefundResult> CreateRefundAsync(
        string paymentIntentId,
        long? amount,
        string? reason,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation(
                "Creating refund for PaymentIntent {PaymentIntentId}, amount: {Amount}",
                paymentIntentId, amount ?? -1);

            var options = new RefundCreateOptions
            {
                PaymentIntent = paymentIntentId,
                Amount = amount,
                Reason = reason
            };

            var refund = await _refundService.CreateAsync(options, cancellationToken: cancellationToken);

            _logger.LogInformation(
                "Created refund {RefundId} for PaymentIntent {PaymentIntentId}",
                refund.Id, paymentIntentId);

            return new RefundResult
            {
                Success = true,
                RefundId = refund.Id,
                Amount = refund.Amount,
                Status = refund.Status
            };
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Failed to create refund for PaymentIntent {PaymentIntentId}", paymentIntentId);
            return new RefundResult
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public StripeWebhookEvent? ValidateWebhookSignature(string payload, string signature)
    {
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                payload,
                signature,
                _settings.WebhookSecret
            );

            _logger.LogInformation(
                "Validated webhook event {EventId} of type {EventType}",
                stripeEvent.Id, stripeEvent.Type);

            var webhookEvent = new StripeWebhookEvent
            {
                EventId = stripeEvent.Id,
                EventType = stripeEvent.Type
            };

            if (stripeEvent.Data.Object is PaymentIntent paymentIntent)
            {
                webhookEvent.PaymentIntentId = paymentIntent.Id;
                webhookEvent.Status = paymentIntent.Status;
                webhookEvent.Amount = paymentIntent.Amount;
                webhookEvent.Currency = paymentIntent.Currency;
                webhookEvent.ReceiptUrl = paymentIntent.LatestCharge?.ReceiptUrl;
                webhookEvent.FailureMessage = paymentIntent.LastPaymentError?.Message;

                if (paymentIntent.Metadata != null)
                {
                    webhookEvent.Metadata = new Dictionary<string, string>(paymentIntent.Metadata);
                }
            }

            return webhookEvent;
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Failed to validate webhook signature");
            return null;
        }
    }
}
