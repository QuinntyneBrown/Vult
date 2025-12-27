# Order and Payment System Specification

## Overview

This specification defines the backend implementation for an Order and Payment system for the Vult e-commerce platform. The workflow is modeled after Nike.com's checkout experience, providing a streamlined path from product selection to payment confirmation.

## Documents

| Document | Description |
|----------|-------------|
| [01-requirements.md](./01-requirements.md) | Functional and non-functional requirements with acceptance criteria |
| [02-use-case-diagrams.md](./02-use-case-diagrams.md) | Use case diagrams, sequence diagrams, and state machines |
| [03-technical-specification.md](./03-technical-specification.md) | Technical implementation details, code samples, and architecture |

## Quick Summary

### Core Entities

```
Order (1) ──────── (*) LineItem
  │                      │
  │                      └── references Product (snapshot)
  │
  ├── ShippingAddress (embedded)
  ├── BillingAddress (optional, embedded)
  └── StripePaymentIntentId
```

### Order Flow

```
┌─────────┐   ┌──────────────────┐   ┌───────────┐   ┌───────────┐
│ Pending │ → │ PaymentProcessing │ → │ Confirmed │ → │ Delivered │
└─────────┘   └──────────────────┘   └───────────┘   └───────────┘
     │                │                    │
     ▼                ▼                    ▼
┌───────────┐   ┌──────────┐         ┌───────────┐
│ Cancelled │   │  Failed  │ ───────→│ Cancelled │
└───────────┘   └──────────┘ (retry) └───────────┘
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/{id}` | Get order by ID |
| POST | `/api/orders/{id}/payment` | Create Stripe PaymentIntent |
| POST | `/api/orders/{id}/cancel` | Cancel order |
| POST | `/api/webhooks/stripe` | Handle Stripe webhooks |

### Stripe Integration (Simplest Approach)

1. **Create Order** → Order stored in database with status `Pending`
2. **Create PaymentIntent** → Backend calls Stripe API, returns `clientSecret`
3. **Confirm Payment** → Frontend uses Stripe.js to confirm with card details
4. **Webhook Confirmation** → Stripe sends `payment_intent.succeeded` webhook
5. **Order Confirmed** → Backend updates order status to `Confirmed`

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Price snapshot in LineItem | Prices may change; order total should remain immutable |
| Embedded addresses | Simpler than separate Address table for V1 |
| Webhook-based confirmation | More reliable than client-side confirmation alone |
| Guest checkout | No user account required (CustomerId is optional) |
| CQS pattern | Consistent with existing Vult codebase patterns |

## Out of Scope (Phase 1)

- Shopping cart persistence
- Inventory/stock management
- Discount codes and promotions
- Tax calculation service
- Shipping rate calculation
- Email notifications
- Refunds and returns
- Multiple payment methods

## Getting Started

1. Review the requirements document for acceptance criteria
2. Review use case diagrams for workflow understanding
3. Use technical specification for implementation guidance

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2024 | Product Team | Initial specification |
