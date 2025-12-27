# Order and Payment System - Use Case Diagrams

**Version:** 1.0
**Date:** December 2024
**Author:** Product Team

---

## 1. System Overview

### 1.1 Actors

| Actor | Description |
|-------|-------------|
| Customer | End user placing orders and making payments |
| System | Vult backend application |
| Stripe | External payment processor |
| Admin | System administrator (future phase) |

---

## 2. Use Case Diagrams

### 2.1 Order Management Use Cases

```mermaid
graph TB
    subgraph "Order Management System"
        UC1[Create Order]
        UC2[View Order]
        UC3[Cancel Order]
        UC4[Process Payment]
        UC5[Confirm Order]
        UC6[Handle Payment Failure]
    end

    Customer((Customer))
    Stripe((Stripe))

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4

    UC4 --> Stripe
    Stripe --> UC5
    Stripe --> UC6
```

### 2.2 Complete Order Flow Use Case

```mermaid
sequenceDiagram
    autonumber
    participant C as Customer
    participant F as Frontend
    participant A as API
    participant DB as Database
    participant S as Stripe

    Note over C,S: Order Creation Phase
    C->>F: Add items to order
    C->>F: Enter shipping info
    F->>A: POST /api/orders
    A->>DB: Validate products exist
    A->>DB: Create Order (Pending)
    A->>DB: Create LineItems with price snapshots
    DB-->>A: Order created
    A-->>F: OrderDto with OrderNumber
    F-->>C: Show order summary

    Note over C,S: Payment Phase
    C->>F: Click "Pay Now"
    F->>A: POST /api/orders/{id}/payment
    A->>S: Create PaymentIntent
    S-->>A: PaymentIntent + clientSecret
    A->>DB: Store PaymentIntentId
    A->>DB: Update status → PaymentProcessing
    A-->>F: clientSecret

    F->>C: Show Stripe payment form
    C->>F: Enter card details
    F->>S: confirmCardPayment(clientSecret)
    S-->>F: Payment result

    Note over C,S: Confirmation Phase (Webhook)
    S->>A: Webhook: payment_intent.succeeded
    A->>A: Verify webhook signature
    A->>DB: Update status → Confirmed
    A-->>S: 200 OK

    F->>A: GET /api/orders/{id}
    A-->>F: Order with status Confirmed
    F-->>C: Order confirmation page
```

---

## 3. Detailed Use Cases

### 3.1 UC-001: Create Order

```mermaid
flowchart TD
    A[Start] --> B{Products selected?}
    B -->|No| C[Error: No items]
    B -->|Yes| D{Valid shipping info?}
    D -->|No| E[Error: Invalid address]
    D -->|Yes| F[Validate each product exists]
    F --> G{All products valid?}
    G -->|No| H[Error: Invalid product]
    G -->|Yes| I[Calculate subtotal]
    I --> J[Calculate tax]
    J --> K[Calculate shipping]
    K --> L[Generate OrderNumber]
    L --> M[Create Order entity]
    M --> N[Create LineItem entities]
    N --> O[Save to database]
    O --> P[Return OrderDto]
    P --> Q[End]

    C --> Q
    E --> Q
    H --> Q
```

**Use Case Specification:**

| Field | Value |
|-------|-------|
| **Name** | Create Order |
| **ID** | UC-001 |
| **Actors** | Customer |
| **Preconditions** | - At least one valid product selected<br>- Shipping information provided |
| **Postconditions** | - Order created with status "Pending"<br>- Unique order number generated<br>- Line items created with price snapshots |
| **Basic Flow** | 1. Customer provides shipping information<br>2. Customer provides list of products with quantities<br>3. System validates all products exist<br>4. System calculates order totals<br>5. System creates order with line items<br>6. System returns order details |
| **Alternative Flows** | - Product not found: Return error with invalid ProductId<br>- Invalid quantity: Return validation error |
| **Business Rules** | - Minimum 1 line item per order<br>- Quantity must be ≥ 1<br>- Price snapshot captured at order time |

---

### 3.2 UC-002: Process Payment

```mermaid
flowchart TD
    A[Start] --> B[Get Order by ID]
    B --> C{Order exists?}
    C -->|No| D[Error: Order not found]
    C -->|Yes| E{Order status = Pending?}
    E -->|No| F{Status = Failed?}
    F -->|No| G[Error: Cannot pay for this order]
    F -->|Yes| H[Allow retry]
    E -->|Yes| H
    H --> I[Create Stripe PaymentIntent]
    I --> J{Stripe success?}
    J -->|No| K[Error: Stripe API failed]
    J -->|Yes| L[Store PaymentIntentId]
    L --> M[Update status → PaymentProcessing]
    M --> N[Return clientSecret]
    N --> O[End]

    D --> O
    G --> O
    K --> O
```

**Use Case Specification:**

| Field | Value |
|-------|-------|
| **Name** | Process Payment |
| **ID** | UC-002 |
| **Actors** | Customer, Stripe |
| **Preconditions** | - Order exists<br>- Order status is Pending or Failed |
| **Postconditions** | - PaymentIntent created in Stripe<br>- Order status updated to PaymentProcessing<br>- Client secret returned |
| **Basic Flow** | 1. Customer requests to pay for order<br>2. System validates order is payable<br>3. System creates PaymentIntent via Stripe API<br>4. System stores PaymentIntentId<br>5. System returns client secret to frontend |
| **Alternative Flows** | - Order not found: Return 404<br>- Order already paid: Return 400<br>- Stripe API error: Return 500 |
| **Business Rules** | - Only Pending or Failed orders can be paid<br>- Amount sent to Stripe in cents |

---

### 3.3 UC-003: Handle Stripe Webhook

```mermaid
flowchart TD
    A[Webhook Received] --> B[Verify Signature]
    B --> C{Signature valid?}
    C -->|No| D[Return 401 Unauthorized]
    C -->|Yes| E[Parse Event]
    E --> F{Event Type?}

    F -->|payment_intent.succeeded| G[Get Order by PaymentIntentId]
    F -->|payment_intent.payment_failed| H[Get Order by PaymentIntentId]
    F -->|Other| I[Ignore event]

    G --> J{Order found?}
    J -->|No| K[Log warning, return 200]
    J -->|Yes| L{Already confirmed?}
    L -->|Yes| M[Idempotent: return 200]
    L -->|No| N[Update status → Confirmed]
    N --> O[Return 200 OK]

    H --> P{Order found?}
    P -->|No| K
    P -->|Yes| Q[Update status → Failed]
    Q --> R[Store error message]
    R --> O

    I --> O
    D --> S[End]
    K --> S
    M --> S
    O --> S
```

**Use Case Specification:**

| Field | Value |
|-------|-------|
| **Name** | Handle Stripe Webhook |
| **ID** | UC-003 |
| **Actors** | Stripe |
| **Preconditions** | - Webhook endpoint configured in Stripe<br>- Webhook signing secret configured |
| **Postconditions** | - Order status updated based on payment result |
| **Basic Flow** | 1. Stripe sends webhook event<br>2. System verifies webhook signature<br>3. System parses event type<br>4. System finds order by PaymentIntentId<br>5. System updates order status accordingly |
| **Alternative Flows** | - Invalid signature: Return 401<br>- Order not found: Log and return 200<br>- Duplicate webhook: Idempotent handling |
| **Business Rules** | - Always return 200 for valid webhooks (even if order not found)<br>- Handle duplicates idempotently |

---

### 3.4 UC-004: Cancel Order

```mermaid
flowchart TD
    A[Start] --> B[Get Order by ID]
    B --> C{Order exists?}
    C -->|No| D[Error: Order not found]
    C -->|Yes| E{Can be cancelled?}
    E -->|No| F[Error: Cannot cancel]
    E -->|Yes| G{Has PaymentIntent?}
    G -->|Yes| H[Cancel PaymentIntent in Stripe]
    G -->|No| I[Update status → Cancelled]
    H --> I
    I --> J[Return success]
    J --> K[End]

    D --> K
    F --> K
```

**Use Case Specification:**

| Field | Value |
|-------|-------|
| **Name** | Cancel Order |
| **ID** | UC-004 |
| **Actors** | Customer |
| **Preconditions** | - Order exists<br>- Order not already confirmed/shipped |
| **Postconditions** | - Order status set to Cancelled<br>- PaymentIntent cancelled (if exists) |
| **Basic Flow** | 1. Customer requests cancellation<br>2. System validates order can be cancelled<br>3. System cancels Stripe PaymentIntent if exists<br>4. System updates status to Cancelled |
| **Alternative Flows** | - Order confirmed: Cannot cancel<br>- Order already cancelled: Return success (idempotent) |
| **Business Rules** | - Only Pending, PaymentProcessing, or Failed orders can be cancelled |

---

## 4. State Machine Diagram

### 4.1 Order Status State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: Order Created

    Pending --> PaymentProcessing: Payment Initiated
    Pending --> Cancelled: Customer Cancels

    PaymentProcessing --> Confirmed: Payment Succeeded
    PaymentProcessing --> Failed: Payment Failed
    PaymentProcessing --> Cancelled: Customer Cancels / Timeout

    Failed --> PaymentProcessing: Retry Payment
    Failed --> Cancelled: Customer Cancels

    Confirmed --> Processing: Fulfillment Started
    Processing --> Shipped: Order Shipped
    Shipped --> Delivered: Delivery Confirmed

    Confirmed --> Cancelled: Admin Cancels / Refund

    note right of Pending: Initial state\nNo payment yet
    note right of PaymentProcessing: Awaiting Stripe\nconfirmation
    note right of Confirmed: Payment successful\nReady for fulfillment
    note right of Failed: Payment declined\nCan retry
```

### 4.2 Valid State Transitions

| From Status | To Status | Trigger |
|-------------|-----------|---------|
| - | Pending | Order created |
| Pending | PaymentProcessing | Payment intent created |
| Pending | Cancelled | Customer cancellation |
| PaymentProcessing | Confirmed | Stripe webhook (succeeded) |
| PaymentProcessing | Failed | Stripe webhook (failed) |
| PaymentProcessing | Cancelled | Timeout or cancellation |
| Failed | PaymentProcessing | Payment retry |
| Failed | Cancelled | Customer cancellation |
| Confirmed | Processing | Fulfillment started |
| Confirmed | Cancelled | Refund/admin action |
| Processing | Shipped | Order shipped |
| Shipped | Delivered | Delivery confirmed |

---

## 5. Component Interaction Diagram

```mermaid
graph TB
    subgraph "Frontend (Angular)"
        FE[Vult WebApp]
        SE[Stripe Elements]
    end

    subgraph "Backend (ASP.NET Core)"
        OC[OrdersController]
        WC[WebhooksController]
        OH[Order Handlers]
        PS[PaymentService]
        OS[OrderService]
    end

    subgraph "Data Layer"
        DB[(SQL Server)]
        CTX[VultContext]
    end

    subgraph "External"
        STRIPE[Stripe API]
    end

    FE -->|Create Order| OC
    FE -->|Get Payment Intent| OC
    SE -->|Confirm Payment| STRIPE

    OC --> OH
    OH --> OS
    OH --> PS
    OS --> CTX
    PS -->|Create PaymentIntent| STRIPE

    CTX --> DB

    STRIPE -->|Webhooks| WC
    WC --> OH

    style STRIPE fill:#635bff,color:#fff
    style DB fill:#336791,color:#fff
```

---

## 6. Data Flow Diagram

```mermaid
flowchart LR
    subgraph "Customer Actions"
        A1[Browse Products]
        A2[Submit Order]
        A3[Pay]
        A4[View Confirmation]
    end

    subgraph "API Layer"
        B1[POST /orders]
        B2[POST /orders/id/payment]
        B3[POST /webhooks/stripe]
        B4[GET /orders/id]
    end

    subgraph "Domain Layer"
        C1[CreateOrderHandler]
        C2[CreatePaymentHandler]
        C3[HandleWebhookHandler]
        C4[GetOrderHandler]
    end

    subgraph "Data Store"
        D1[(Orders Table)]
        D2[(LineItems Table)]
    end

    subgraph "Stripe"
        E1[PaymentIntents API]
        E2[Webhooks]
    end

    A1 --> A2
    A2 --> B1 --> C1 --> D1
    C1 --> D2

    A3 --> B2 --> C2 --> E1
    C2 --> D1

    E2 --> B3 --> C3 --> D1

    A4 --> B4 --> C4 --> D1
```

---

## 7. Entity Relationship Diagram

```mermaid
erDiagram
    Order ||--o{ LineItem : contains
    Order ||--o| Address : "ships to"
    Order ||--o| Address : "bills to"
    LineItem }o--|| Product : references

    Order {
        guid OrderId PK
        string OrderNumber UK
        guid CustomerId FK "nullable"
        string CustomerEmail
        int Status
        decimal SubTotal
        decimal Tax
        decimal ShippingCost
        decimal Total
        string Currency
        string StripePaymentIntentId
        string StripePaymentStatus
        string PaymentErrorMessage
        datetime CreatedDate
        datetime UpdatedDate
    }

    LineItem {
        guid LineItemId PK
        guid OrderId FK
        guid ProductId
        string ProductName
        string ProductSize
        string ProductImageUrl
        decimal UnitPrice
        int Quantity
        decimal SubTotal
    }

    Address {
        string FullName
        string AddressLine1
        string AddressLine2
        string City
        string State
        string PostalCode
        string Country
        string Phone
    }

    Product {
        guid ProductId PK
        string Name
        decimal EstimatedMSRP
        string Size
        string Description
    }
```

---

## 8. Checkout Journey Diagram (Nike.com Reference)

```mermaid
journey
    title Customer Checkout Journey
    section Browse
      View products: 5: Customer
      View product details: 5: Customer
      Select size: 4: Customer
    section Order
      Add to order: 5: Customer
      View order summary: 5: Customer
      Enter shipping info: 3: Customer
      Review order: 4: Customer
    section Payment
      Enter card details: 3: Customer
      Submit payment: 4: Customer
      Wait for confirmation: 2: Customer
    section Confirmation
      View confirmation: 5: Customer
      Receive email: 5: System
```

---

## 9. API Sequence Diagrams

### 9.1 Complete Checkout Sequence

```mermaid
sequenceDiagram
    participant C as Customer Browser
    participant FE as Angular App
    participant API as Vult API
    participant DB as Database
    participant Stripe as Stripe API

    rect rgb(240, 248, 255)
        Note over C,Stripe: Step 1: Create Order
        C->>FE: Submit order form
        FE->>API: POST /api/orders
        API->>DB: Fetch products for validation
        DB-->>API: Products data
        API->>API: Calculate totals
        API->>DB: Insert Order + LineItems
        DB-->>API: Order saved
        API-->>FE: 201 Created (OrderDto)
        FE-->>C: Display order confirmation
    end

    rect rgb(255, 248, 240)
        Note over C,Stripe: Step 2: Initiate Payment
        C->>FE: Click "Pay Now"
        FE->>API: POST /api/orders/{id}/payment
        API->>Stripe: Create PaymentIntent
        Stripe-->>API: PaymentIntent + clientSecret
        API->>DB: Update Order with PaymentIntentId
        API->>DB: Set status = PaymentProcessing
        API-->>FE: clientSecret
    end

    rect rgb(240, 255, 240)
        Note over C,Stripe: Step 3: Complete Payment
        FE->>C: Show Stripe Elements form
        C->>FE: Enter card details
        FE->>Stripe: stripe.confirmCardPayment(clientSecret)
        Stripe-->>FE: PaymentIntent result
        FE-->>C: Processing...
    end

    rect rgb(248, 240, 255)
        Note over C,Stripe: Step 4: Webhook Confirmation
        Stripe->>API: POST /api/webhooks/stripe
        API->>API: Verify signature
        API->>DB: Find Order by PaymentIntentId
        API->>DB: Update status = Confirmed
        API-->>Stripe: 200 OK
    end

    rect rgb(255, 255, 240)
        Note over C,Stripe: Step 5: Show Confirmation
        FE->>API: GET /api/orders/{id}
        API->>DB: Fetch Order
        DB-->>API: Order (Confirmed)
        API-->>FE: OrderDto
        FE-->>C: Order Confirmation Page
    end
```

---

## 10. Error Handling Scenarios

```mermaid
flowchart TD
    subgraph "Payment Errors"
        PE1[Card Declined] --> PE1A[Show decline reason]
        PE2[Insufficient Funds] --> PE2A[Suggest different card]
        PE3[Card Expired] --> PE3A[Request new card]
        PE4[Network Error] --> PE4A[Retry payment]
        PE5[3D Secure Failed] --> PE5A[Request authentication]
    end

    subgraph "Order Errors"
        OE1[Product Not Found] --> OE1A[Remove from order]
        OE2[Product Out of Stock] --> OE2A[Show unavailable message]
        OE3[Invalid Quantity] --> OE3A[Show validation error]
        OE4[Invalid Address] --> OE4A[Highlight invalid fields]
    end

    subgraph "System Errors"
        SE1[Stripe API Down] --> SE1A[Show retry message]
        SE2[Database Error] --> SE2A[Log and show generic error]
        SE3[Webhook Timeout] --> SE3A[Stripe will retry]
    end
```

---

## 11. Security Considerations Diagram

```mermaid
flowchart TB
    subgraph "Client Side"
        C1[Browser]
        C2[Stripe.js / Elements]
    end

    subgraph "Our Infrastructure"
        S1[Load Balancer]
        S2[API Server]
        S3[Database]
    end

    subgraph "Stripe Infrastructure"
        ST1[Stripe API]
        ST2[Stripe Webhooks]
    end

    C1 -->|HTTPS| S1
    C2 -->|Direct to Stripe| ST1
    S1 -->|Internal| S2
    S2 -->|SQL/TLS| S3
    S2 -->|HTTPS + API Key| ST1
    ST2 -->|HTTPS + Signature| S2

    style C2 fill:#635bff,color:#fff
    style ST1 fill:#635bff,color:#fff
    style ST2 fill:#635bff,color:#fff

    Note1[Card data never touches our servers]
    Note2[Webhook signature verification]
    Note3[API keys server-side only]
```

---

## 12. Summary of Use Cases

| ID | Use Case | Actor | Priority |
|----|----------|-------|----------|
| UC-001 | Create Order | Customer | High |
| UC-002 | Process Payment | Customer, Stripe | High |
| UC-003 | Handle Stripe Webhook | Stripe | High |
| UC-004 | Cancel Order | Customer | Medium |
| UC-005 | View Order | Customer | High |
| UC-006 | Retry Failed Payment | Customer | Medium |
| UC-007 | Get Order by Number | Customer | Medium |
