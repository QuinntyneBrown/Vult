# Customer Management System - Use Case Diagrams

**Version:** 1.1
**Date:** December 2024
**Author:** Product Team

---

## 1. System Overview

### 1.1 Actors

| Actor | Description |
|-------|-------------|
| Customer | Authenticated user with a profile |
| System | Vult backend application |

---

## 2. Use Case Diagrams

### 2.1 Customer Management Use Cases

```mermaid
graph TB
    subgraph "Customer Management System"
        UC1[View Profile]
        UC2[Update Profile]
        UC3[Delete Account]
        UC4[Manage Addresses]
        UC5[View Order History]
    end

    Customer((Customer))

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
```

### 2.2 Address Management Use Cases

```mermaid
graph TB
    subgraph "Address Management"
        UC1[List Addresses]
        UC2[Add Address]
        UC3[Update Address]
        UC4[Delete Address]
        UC5[Set Default Address]
    end

    Customer((Customer))

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
```

---

## 3. Sequence Diagrams

### 3.1 Profile Update Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Customer
    participant F as Frontend
    participant A as API
    participant Auth as AuthMiddleware
    participant DB as Database

    C->>F: Update profile form
    F->>A: PUT /api/customers/me
    Note right of F: Authorization: Bearer {token}

    A->>Auth: Validate JWT

    alt Token invalid/expired
        Auth-->>A: Unauthorized
        A-->>F: 401 Unauthorized
        F-->>C: Redirect to login
    else Token valid
        Auth-->>A: CustomerId from claims
        A->>DB: Find customer
        A->>A: Validate input
        A->>DB: Update customer
        DB-->>A: Updated
        A-->>F: 200 OK (CustomerDto)
        F-->>C: "Profile updated"
    end
```

### 3.2 Address Management Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Customer
    participant F as Frontend
    participant A as API
    participant DB as Database

    Note over C,DB: Add New Address
    C->>F: Fill address form
    F->>A: POST /api/customers/me/addresses
    A->>DB: Count existing addresses

    alt Max addresses reached (10)
        DB-->>A: Count = 10
        A-->>F: 400 Bad Request
        F-->>C: "Maximum addresses reached"
    else Under limit
        DB-->>A: Count < 10
        A->>A: If first address, set as default
        A->>DB: Insert CustomerAddress
        DB-->>A: Address created
        A-->>F: 201 Created (AddressDto)
        F-->>C: "Address saved"
    end

    Note over C,DB: Set Default Address
    C->>F: Click "Set as Default"
    F->>A: PUT /api/customers/me/addresses/{id}/default
    A->>DB: Unset current default
    A->>DB: Set new default
    DB-->>A: Updated
    A-->>F: 200 OK
    F-->>C: "Default address updated"
```

### 3.3 Order History Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Customer
    participant F as Frontend
    participant A as API
    participant DB as Database

    C->>F: Navigate to Order History
    F->>A: GET /api/customers/me/orders?page=1
    A->>DB: Query orders WHERE CustomerId = {id}
    DB-->>A: Order list with pagination
    A-->>F: 200 OK (OrderSummaryDto[])
    F-->>C: Display order list

    C->>F: Click order to view details
    F->>A: GET /api/customers/me/orders/{orderId}
    A->>DB: Get order with line items

    alt Order belongs to customer
        DB-->>A: Order details
        A-->>F: 200 OK (OrderDto)
        F-->>C: Display order details
    else Order not found or unauthorized
        A-->>F: 404 Not Found
        F-->>C: "Order not found"
    end
```

---

## 4. Detailed Use Cases

### 4.1 UC-001: Manage Addresses

```mermaid
flowchart TD
    subgraph "Add Address"
        A1[Start] --> A2{Under max limit?}
        A2 -->|No| A3[Error: Max reached]
        A2 -->|Yes| A4{First address?}
        A4 -->|Yes| A5[Set as default]
        A4 -->|No| A6[Keep isDefault as provided]
        A5 --> A7[Save address]
        A6 --> A7
        A7 --> A8[Return AddressDto]
    end

    subgraph "Delete Address"
        D1[Start] --> D2{Address exists?}
        D2 -->|No| D3[Error: Not found]
        D2 -->|Yes| D4{Is default?}
        D4 -->|Yes| D5[Error: Cannot delete default]
        D4 -->|No| D6[Delete address]
        D6 --> D7[Return success]
    end

    subgraph "Set Default"
        S1[Start] --> S2{Address exists?}
        S2 -->|No| S3[Error: Not found]
        S2 -->|Yes| S4[Unset current default]
        S4 --> S5[Set new default]
        S5 --> S6[Return success]
    end
```

**Use Case Specification:**

| Field | Value |
|-------|-------|
| **Name** | Manage Addresses |
| **ID** | UC-001 |
| **Actors** | Customer |
| **Preconditions** | - Customer authenticated |
| **Postconditions** | - Address changes persisted |
| **Basic Flow (Add)** | 1. Customer provides address details<br>2. System validates address count<br>3. System sets default if first<br>4. System saves address |
| **Alternative Flows** | - Max addresses: Return error<br>- Delete default: Return error |
| **Business Rules** | - Max 10 addresses per customer<br>- First address is default<br>- Cannot delete default address |

---

### 4.2 UC-002: View Order History

```mermaid
flowchart TD
    A[Start] --> B[Get CustomerId from token]
    B --> C[Query orders by CustomerId]
    C --> D{Apply filters?}
    D -->|Status filter| E[Filter by status]
    D -->|No filter| F[All orders]
    E --> G[Apply pagination]
    F --> G
    G --> H[Return OrderSummaryDto list]
    H --> I[End]
```

**Use Case Specification:**

| Field | Value |
|-------|-------|
| **Name** | View Order History |
| **ID** | UC-002 |
| **Actors** | Customer |
| **Preconditions** | - Customer authenticated |
| **Postconditions** | - Order list returned |
| **Basic Flow** | 1. Customer requests order history<br>2. System queries orders by CustomerId<br>3. System applies pagination<br>4. System returns order summaries |
| **Alternative Flows** | - No orders: Return empty list |
| **Business Rules** | - Only show customer's own orders<br>- Default sort by date descending |

---

## 5. State Machine Diagrams

### 5.1 Customer Account State Machine

```mermaid
stateDiagram-v2
    [*] --> Unregistered: Visitor

    Unregistered --> Active: User Account Created
    Active --> Active: Update Profile
    Active --> Deleted: Request Deletion

    Deleted --> [*]: Permanent (after retention)

    note right of Active: Normal operating state
    note right of Deleted: Soft deleted\nCannot access profile
```

---

## 6. Component Interaction Diagram

```mermaid
graph TB
    subgraph "Frontend (Angular)"
        FE[Vult WebApp]
        CS[CustomerService]
    end

    subgraph "Backend (ASP.NET Core)"
        CC[CustomersController]
        MW[Auth Middleware]
        CH[Customer Handlers]
    end

    subgraph "Data Layer"
        DB[(SQL Server)]
        CTX[VultContext]
    end

    FE --> CS
    CS -->|Profile/Addresses| CC

    CC --> MW
    MW --> CH
    CH --> CTX

    CTX --> DB

    style DB fill:#336791,color:#fff
```

---

## 7. Data Flow Diagram

```mermaid
flowchart LR
    subgraph "User Actions"
        A1[Manage Profile]
        A2[Manage Addresses]
        A3[View Orders]
    end

    subgraph "API Layer"
        B1[GET/PUT /me]
        B2[CRUD /addresses]
        B3[GET /orders]
    end

    subgraph "Domain Layer"
        C1[ProfileHandler]
        C2[AddressHandler]
        C3[OrderHistoryHandler]
    end

    subgraph "Data Store"
        D1[(Customers)]
        D2[(CustomerAddresses)]
        D3[(Orders)]
    end

    A1 --> B1 --> C1 --> D1
    A2 --> B2 --> C2 --> D2
    A3 --> B3 --> C3 --> D3
```

---

## 8. Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o| Customer : has
    Customer ||--o{ CustomerAddress : has
    Customer ||--o{ Order : places

    User {
        guid UserId PK
        string Email UK
        bool IsEmailVerified
        string Password
        byte[] Salt
    }

    Customer {
        guid CustomerId PK
        guid UserId FK "nullable"
        string FirstName
        string LastName
        string Phone
        date DateOfBirth
        bool IsDeleted
        datetime CreatedDate
        datetime UpdatedDate
    }

    CustomerAddress {
        guid CustomerAddressId PK
        guid CustomerId FK
        string Label
        string FullName
        string AddressLine1
        string AddressLine2
        string City
        string State
        string PostalCode
        string Country
        string Phone
        bool IsDefault
        datetime CreatedDate
        datetime UpdatedDate
    }

    Order {
        guid OrderId PK
        guid CustomerId FK "nullable"
        string OrderNumber UK
        string CustomerEmail
        string Status
        decimal Total
        datetime CreatedDate
    }
```

---

## 9. Customer Journey Diagram

### 9.1 Registered Customer Journey

```mermaid
journey
    title Registered Customer Journey
    section Profile Setup
      Login to account: 5: Customer
      View profile: 5: Customer
      Update profile info: 4: Customer
    section Address Management
      Add shipping address: 4: Customer
      Set default address: 5: Customer
    section Shopping
      Add product to order: 5: Customer
      Select saved address: 5: Customer
      Complete checkout: 4: Customer
    section Post-Purchase
      View order history: 5: Customer
      Check order status: 5: Customer
```

---

## 10. Error Handling Scenarios

```mermaid
flowchart TD
    subgraph "Address Errors"
        AD1[Max Addresses] --> AD1A[400: Limit reached]
        AD2[Delete Default] --> AD2A[400: Cannot delete default]
        AD3[Not Found] --> AD3A[404: Address not found]
    end

    subgraph "Authorization Errors"
        AU1[Not Owner] --> AU1A[403: Forbidden]
        AU2[Missing Token] --> AU2A[401: Authentication required]
        AU3[Token Expired] --> AU3A[401: Token expired]
    end
```

---

## 11. Integration Points with Order System

```mermaid
flowchart LR
    subgraph "Customer System"
        CS[Customer Service]
        AS[Address Service]
    end

    subgraph "Order System"
        OS[Order Service]
        OC[Orders Controller]
    end

    subgraph "Shared"
        DB[(Database)]
        Auth[Auth Middleware]
    end

    CS -->|CustomerId| OS
    AS -->|Address Template| OS
    Auth -->|JWT Claims| CS
    Auth -->|JWT Claims| OS

    CS --> DB
    AS --> DB
    OS --> DB

    Note1[Customer.CustomerId → Order.CustomerId]
    Note2[CustomerAddress → Order ShippingAddress snapshot]
```

---

## 12. Summary of Use Cases

| ID | Use Case | Actor | Priority |
|----|----------|-------|----------|
| UC-001 | View Profile | Customer | High |
| UC-002 | Update Profile | Customer | High |
| UC-003 | Delete Account | Customer | Low |
| UC-004 | Add Address | Customer | High |
| UC-005 | Update Address | Customer | Medium |
| UC-006 | Delete Address | Customer | Medium |
| UC-007 | Set Default Address | Customer | Medium |
| UC-008 | View Order History | Customer | High |
| UC-009 | View Order Details | Customer | High |
