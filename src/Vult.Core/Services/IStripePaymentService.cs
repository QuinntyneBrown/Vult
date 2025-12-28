// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Services;

public interface IStripePaymentService
{
    /// <summary>
    /// Creates a Stripe PaymentIntent for the specified amount
    /// </summary>
    Task<PaymentIntentResult> CreatePaymentIntentAsync(
        long amount,
        string currency,
        string customerEmail,
        Guid orderId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a PaymentIntent by its ID
    /// </summary>
    Task<PaymentIntentResult> GetPaymentIntentAsync(
        string paymentIntentId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Cancels a PaymentIntent
    /// </summary>
    Task<bool> CancelPaymentIntentAsync(
        string paymentIntentId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a refund for a payment
    /// </summary>
    Task<RefundResult> CreateRefundAsync(
        string paymentIntentId,
        long? amount,
        string? reason,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates a Stripe webhook signature
    /// </summary>
    StripeWebhookEvent? ValidateWebhookSignature(string payload, string signature);
}

public class PaymentIntentResult
{
    public bool Success { get; set; }
    public string? PaymentIntentId { get; set; }
    public string? ClientSecret { get; set; }
    public string? Status { get; set; }
    public long Amount { get; set; }
    public string? Currency { get; set; }
    public string? ReceiptUrl { get; set; }
    public string? ErrorMessage { get; set; }
}

public class RefundResult
{
    public bool Success { get; set; }
    public string? RefundId { get; set; }
    public long Amount { get; set; }
    public string? Status { get; set; }
    public string? ErrorMessage { get; set; }
}

public class StripeWebhookEvent
{
    public string EventId { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public string PaymentIntentId { get; set; } = string.Empty;
    public string? Status { get; set; }
    public long Amount { get; set; }
    public string? Currency { get; set; }
    public string? ReceiptUrl { get; set; }
    public string? FailureMessage { get; set; }
    public Dictionary<string, string> Metadata { get; set; } = new();
}
