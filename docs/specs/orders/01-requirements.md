# Order and Payment System - Requirements Specification

**Version:** 1.0
**Date:** December 2024
**Author:** Product Team
**Status:** Draft

---

## 1. Executive Summary

This document specifies the requirements for implementing an Order and Payment system for the Vult e-commerce platform. The system will enable customers to place orders containing multiple line items (products) and process payments through Stripe.

### 1.1 Reference Implementation
The workflow is modeled after Nike.com's checkout experience:
1. Customer browses products and adds items to cart
2. Customer proceeds to checkout
3. Customer provides shipping information
4. Customer enters payment details (Stripe)
5. Order is created and payment is processed
6. Customer receives order confirmation

---

## 2. Functional Requirements

### 2.1 Order Management

#### FR-001: Create Order
**Priority:** High
**Description:** The system shall accept orders containing one or more line items.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-001.1 | An order must contain at least one line item | API validation |
| AC-001.2 | Each line item must reference a valid ProductId | Database constraint |
| AC-001.3 | Each line item must have a quantity >= 1 | API validation |
| AC-001.4 | Order must capture unit price at time of order | Snapshot price |
| AC-001.5 | Order must calculate total from line items | Unit test |
| AC-001.6 | Order must have a unique OrderNumber | Auto-generated |

#### FR-002: Order Status Tracking
**Priority:** High
**Description:** The system shall track order status throughout its lifecycle.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-002.1 | Orders start with status "Pending" | Default value |
| AC-002.2 | Status changes to "PaymentProcessing" when payment begins | State machine |
| AC-002.3 | Status changes to "Confirmed" when payment succeeds | Stripe webhook |
| AC-002.4 | Status changes to "Failed" when payment fails | Stripe webhook |
| AC-002.5 | Status changes to "Cancelled" when order is cancelled | API endpoint |

#### FR-003: Line Item Management
**Priority:** High
**Description:** Each order shall contain line items representing products being purchased.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-003.1 | Line item must capture product snapshot (name, price, size) | Immutable copy |
| AC-003.2 | Line item must store quantity ordered | Database field |
| AC-003.3 | Line item must calculate subtotal (quantity * unit price) | Computed property |
| AC-003.4 | Line items cannot be modified after order is confirmed | Business rule |

---

### 2.2 Payment Processing (Stripe Integration)

#### FR-004: Create Payment Intent
**Priority:** High
**Description:** The system shall create a Stripe PaymentIntent for order payment.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-004.1 | Payment amount must match order total in cents | Integration test |
| AC-004.2 | Currency must be USD | Configuration |
| AC-004.3 | PaymentIntent ID must be stored with order | Database field |
| AC-004.4 | Client secret must be returned for frontend processing | API response |
| AC-004.5 | Metadata must include OrderId and OrderNumber | Stripe dashboard |

#### FR-005: Handle Payment Confirmation
**Priority:** High
**Description:** The system shall handle Stripe webhook events for payment confirmation.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-005.1 | System must verify webhook signature | Security test |
| AC-005.2 | payment_intent.succeeded updates order to Confirmed | Integration test |
| AC-005.3 | payment_intent.payment_failed updates order to Failed | Integration test |
| AC-005.4 | Duplicate webhooks must be handled idempotently | Retry test |

#### FR-006: Payment Failure Handling
**Priority:** High
**Description:** The system shall gracefully handle payment failures.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-006.1 | Failed payment must not create confirmed order | State verification |
| AC-006.2 | Error message from Stripe must be stored | Database field |
| AC-006.3 | Customer can retry payment for failed order | API endpoint |

---

### 2.3 Customer Information

#### FR-007: Shipping Information
**Priority:** High
**Description:** Orders shall capture shipping address information.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-007.1 | Shipping address must include: Name, Street, City, State, PostalCode, Country | Required fields |
| AC-007.2 | Email address must be captured for order confirmation | Required field |
| AC-007.3 | Phone number is optional but recommended | Optional field |

#### FR-008: Billing Information
**Priority:** Medium
**Description:** Orders shall capture billing address if different from shipping.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-008.1 | Billing address defaults to shipping address | Default behavior |
| AC-008.2 | Customer can provide separate billing address | API field |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Order creation response time | < 500ms |
| NFR-002 | Payment intent creation | < 2 seconds |
| NFR-003 | Webhook processing | < 5 seconds |

### 3.2 Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-004 | Stripe API keys must not be exposed to client | Server-side only |
| NFR-005 | Webhook signature verification | Stripe SDK |
| NFR-006 | PCI compliance - no card data on our servers | Stripe Elements |
| NFR-007 | Order data encrypted at rest | SQL Server TDE |

### 3.3 Reliability

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-008 | Idempotent order creation | Idempotency key |
| NFR-009 | Webhook retry handling | Idempotent handlers |
| NFR-010 | Transaction consistency | Database transactions |

---

## 4. Data Requirements

### 4.1 Order Entity

```
Order
├── OrderId: Guid (PK)
├── OrderNumber: string (unique, auto-generated)
├── CustomerId: Guid? (optional, for guest checkout)
├── CustomerEmail: string (required)
├── Status: OrderStatus (enum)
├── SubTotal: decimal
├── Tax: decimal
├── ShippingCost: decimal
├── Total: decimal
├── Currency: string (default: "USD")
├── StripePaymentIntentId: string?
├── StripePaymentStatus: string?
├── PaymentErrorMessage: string?
├── ShippingAddress: Address (value object)
├── BillingAddress: Address? (value object)
├── CreatedDate: DateTime
├── UpdatedDate: DateTime
└── LineItems: ICollection<LineItem>
```

### 4.2 LineItem Entity

```
LineItem
├── LineItemId: Guid (PK)
├── OrderId: Guid (FK)
├── ProductId: Guid (reference)
├── ProductName: string (snapshot)
├── ProductSize: string? (snapshot)
├── ProductImageUrl: string? (snapshot)
├── UnitPrice: decimal (snapshot)
├── Quantity: int
├── SubTotal: decimal (computed)
└── Order: Order (navigation)
```

### 4.3 OrderStatus Enumeration

```
OrderStatus
├── Pending = 0
├── PaymentProcessing = 1
├── Confirmed = 2
├── Processing = 3
├── Shipped = 4
├── Delivered = 5
├── Cancelled = 6
└── Failed = 7
```

### 4.4 Address Value Object

```
Address
├── FullName: string
├── AddressLine1: string
├── AddressLine2: string?
├── City: string
├── State: string
├── PostalCode: string
├── Country: string
└── Phone: string?
```

---

## 5. API Requirements

### 5.1 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create new order |
| GET | /api/orders/{id} | Get order by ID |
| GET | /api/orders/number/{orderNumber} | Get order by order number |
| POST | /api/orders/{id}/payment | Create payment intent |
| POST | /api/orders/{id}/cancel | Cancel order |
| POST | /api/webhooks/stripe | Stripe webhook handler |

### 5.2 Request/Response Examples

#### Create Order Request
```json
{
  "customerEmail": "customer@example.com",
  "shippingAddress": {
    "fullName": "John Doe",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4",
    "city": "Portland",
    "state": "OR",
    "postalCode": "97201",
    "country": "US",
    "phone": "+1-555-123-4567"
  },
  "lineItems": [
    {
      "productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "quantity": 2,
      "size": "10"
    },
    {
      "productId": "7fa85f64-5717-4562-b3fc-2c963f66afa7",
      "quantity": 1,
      "size": "M"
    }
  ]
}
```

#### Create Order Response
```json
{
  "orderId": "9fa85f64-5717-4562-b3fc-2c963f66afa9",
  "orderNumber": "VLT-20241227-001234",
  "status": "Pending",
  "subTotal": 299.97,
  "tax": 24.00,
  "shippingCost": 0.00,
  "total": 323.97,
  "lineItems": [
    {
      "lineItemId": "...",
      "productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "productName": "Air Max 90",
      "productSize": "10",
      "unitPrice": 129.99,
      "quantity": 2,
      "subTotal": 259.98
    },
    {
      "lineItemId": "...",
      "productId": "7fa85f64-5717-4562-b3fc-2c963f66afa7",
      "productName": "Tech Fleece Joggers",
      "productSize": "M",
      "unitPrice": 39.99,
      "quantity": 1,
      "subTotal": 39.99
    }
  ]
}
```

#### Create Payment Intent Response
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 32397,
  "currency": "usd"
}
```

---

## 6. Stripe Integration Requirements

### 6.1 Payment Flow

1. **Client-side**: Customer enters card details using Stripe Elements
2. **Server-side**: Backend creates PaymentIntent via Stripe API
3. **Client-side**: Frontend confirms payment using client secret
4. **Webhook**: Stripe sends webhook for payment result
5. **Server-side**: Backend updates order status based on webhook

### 6.2 Stripe Configuration

| Setting | Value |
|---------|-------|
| API Version | 2023-10-16 |
| Payment Methods | card |
| Currency | USD |
| Webhook Events | payment_intent.succeeded, payment_intent.payment_failed |

### 6.3 Test Card Numbers

| Scenario | Card Number |
|----------|-------------|
| Successful payment | 4242 4242 4242 4242 |
| Declined payment | 4000 0000 0000 0002 |
| Requires authentication | 4000 0025 0000 3155 |

---

## 7. Acceptance Test Scenarios

### 7.1 Happy Path - Successful Order

```gherkin
Feature: Place Order with Payment

Scenario: Customer places order and pays successfully
  Given a customer has products in their order
  And the customer provides valid shipping information
  When the customer submits the order
  Then an order is created with status "Pending"
  And an order number is generated

  When the customer initiates payment
  Then a Stripe PaymentIntent is created
  And the client secret is returned

  When the customer completes payment with a valid card
  And Stripe sends a payment_intent.succeeded webhook
  Then the order status is updated to "Confirmed"
  And the customer receives an order confirmation email
```

### 7.2 Failed Payment

```gherkin
Scenario: Customer payment is declined
  Given a customer has submitted an order
  When the customer attempts payment with a declined card
  And Stripe sends a payment_intent.payment_failed webhook
  Then the order status is updated to "Failed"
  And the payment error message is stored
  And the customer can retry payment
```

### 7.3 Order Cancellation

```gherkin
Scenario: Customer cancels order before payment
  Given a customer has created an order with status "Pending"
  When the customer cancels the order
  Then the order status is updated to "Cancelled"
  And no payment is processed
```

---

## 8. Dependencies

### 8.1 External Services

| Service | Purpose | Required |
|---------|---------|----------|
| Stripe API | Payment processing | Yes |
| SendGrid/SMTP | Order confirmation emails | Optional (Phase 2) |

### 8.2 NuGet Packages

| Package | Version | Purpose |
|---------|---------|---------|
| Stripe.net | 43.x | Stripe API client |

---

## 9. Out of Scope (Future Phases)

- Shopping cart persistence
- Inventory management/stock tracking
- Discount codes and promotions
- Tax calculation service integration
- Shipping rate calculation
- Order history for authenticated users
- Refunds and returns
- Multiple payment methods (PayPal, Apple Pay)
- Email notifications

---

## 10. Glossary

| Term | Definition |
|------|------------|
| Order | A customer's request to purchase one or more products |
| Line Item | A single product entry within an order with quantity |
| PaymentIntent | Stripe object representing a payment attempt |
| Webhook | HTTP callback from Stripe for asynchronous events |
| Client Secret | Token used by frontend to complete payment |
| Idempotency Key | Unique identifier to prevent duplicate operations |
