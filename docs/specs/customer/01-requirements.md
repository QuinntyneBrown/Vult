# Customer Management System - Requirements Specification

**Version:** 1.1
**Date:** December 2024
**Author:** Product Team
**Status:** Draft

---

## 1. Executive Summary

This document specifies the requirements for implementing a Customer Management system for the Vult e-commerce platform. The system will enable customers to manage profiles, save addresses, and track order history. Authentication is handled by the User aggregate, with Customer linking to User via a nullable UserId.

### 1.1 Reference Implementation
The workflow is modeled after Nike.com's member experience:
1. Customer can browse and purchase as a guest
2. Customer can create an account for enhanced features
3. Registered customers can save multiple addresses
4. Registered customers can view order history
5. Profile information speeds up checkout

### 1.2 Relationship to Order System
- Guest checkout: Order uses `CustomerId = null`, captures email directly
- Registered checkout: Order links to `CustomerId`, can use saved addresses
- Order history: Customers can view past orders via `CustomerId` relationship

### 1.3 Relationship to User Aggregate
- User handles authentication (email, password, login)
- Customer links to User via nullable `UserId`
- Customer stores profile data (name, phone, addresses)

---

## 2. Functional Requirements

### 2.1 Profile Management

#### FR-001: View Profile
**Priority:** High
**Description:** The system shall allow customers to view their profile information.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-001.1 | Customer can view all profile fields | GET endpoint |
| AC-001.2 | Profile includes account creation date | Metadata |

#### FR-002: Update Profile
**Priority:** High
**Description:** The system shall allow customers to update their profile.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-002.1 | Customer can update first name | PUT endpoint |
| AC-002.2 | Customer can update last name | PUT endpoint |
| AC-002.3 | Customer can update phone number | PUT endpoint |
| AC-002.4 | Customer can update date of birth | PUT endpoint |
| AC-002.5 | Profile updates are audited with timestamp | UpdatedDate field |

#### FR-003: Delete Account
**Priority:** Low
**Description:** The system shall allow customers to delete their account.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-003.1 | Customer can request account deletion | Soft delete |
| AC-003.2 | Deletion is soft (IsDeleted flag) | Data retention |
| AC-003.3 | Deleted accounts cannot access profile | Auth check |
| AC-003.4 | Order history preserved for records | Foreign key intact |

---

### 2.2 Address Management

#### FR-004: Add Shipping Address
**Priority:** High
**Description:** The system shall allow customers to save shipping addresses.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-004.1 | Customer can add multiple addresses | One-to-many |
| AC-004.2 | Address includes: Label, FullName, Line1, Line2, City, State, PostalCode, Country, Phone | Required fields |
| AC-004.3 | Customer can set one address as default | Boolean flag |
| AC-004.4 | Maximum 10 addresses per customer | Business rule |

#### FR-005: Update Address
**Priority:** High
**Description:** The system shall allow customers to update saved addresses.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-005.1 | Customer can update any field | PUT endpoint |
| AC-005.2 | Customer can change default address | Toggle default |
| AC-005.3 | Only address owner can update | Authorization |

#### FR-006: Delete Address
**Priority:** Medium
**Description:** The system shall allow customers to delete saved addresses.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-006.1 | Customer can delete non-default address | DELETE endpoint |
| AC-006.2 | Deleting default address requires new default selection | Validation |
| AC-006.3 | Addresses used in orders are preserved (snapshot) | Order independence |

---

### 2.3 Order History

#### FR-007: View Order History
**Priority:** High
**Description:** The system shall allow customers to view their order history.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-007.1 | Customer can view list of past orders | GET endpoint |
| AC-007.2 | Orders sorted by date descending | Default sort |
| AC-007.3 | Pagination support for large history | Query params |
| AC-007.4 | Customer can filter by status | Query params |

#### FR-008: View Order Details
**Priority:** High
**Description:** The system shall allow customers to view details of a specific order.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-008.1 | Customer can view order line items | Include navigation |
| AC-008.2 | Customer can view order status | Real-time status |
| AC-008.3 | Customer can view shipping address used | Order snapshot |
| AC-008.4 | Only order owner can view details | Authorization |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Profile retrieval | < 200ms |
| NFR-002 | Address list retrieval | < 200ms |

### 3.2 Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-003 | Authentication via User aggregate | JWT from User login |
| NFR-004 | HTTPS required for all endpoints | TLS 1.2+ |

### 3.3 Privacy & Compliance

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-005 | Customer data exportable (GDPR) | Export endpoint |
| NFR-006 | Account deletion supported (GDPR) | Soft delete |
| NFR-007 | Audit trail for profile changes | UpdatedDate |
| NFR-008 | Sensitive data not logged | Log filtering |

### 3.4 Scalability

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-009 | Support 100,000+ customers | Index optimization |
| NFR-010 | Efficient address lookup | Composite index |

---

## 4. Data Requirements

### 4.1 Customer Entity

```
Customer
├── CustomerId: Guid (PK)
├── UserId: Guid? (FK to User, nullable)
├── FirstName: string (required)
├── LastName: string (required)
├── Phone: string? (optional)
├── DateOfBirth: DateTime? (optional)
├── IsDeleted: bool (default: false)
├── CreatedDate: DateTime
├── UpdatedDate: DateTime
└── Addresses: ICollection<CustomerAddress>
```

### 4.2 CustomerAddress Entity

```
CustomerAddress
├── CustomerAddressId: Guid (PK)
├── CustomerId: Guid (FK)
├── Label: string (e.g., "Home", "Work")
├── FullName: string
├── AddressLine1: string
├── AddressLine2: string?
├── City: string
├── State: string
├── PostalCode: string
├── Country: string
├── Phone: string?
├── IsDefault: bool
├── CreatedDate: DateTime
├── UpdatedDate: DateTime
└── Customer: Customer (navigation)
```

### 4.3 Relationship to User and Orders

```
User (1) ──────── (0..1) Customer (1) ──────── (*) Order
  │                        │                        │
  │                        │                        └── CustomerId (FK, nullable for guests)
  │                        │
  │                        └── (*) CustomerAddress
  │                                  │
  │                                  └── Used as template for Order shipping/billing
  │                                      (copied, not referenced)
  │
  └── Email, IsEmailVerified, Password (authentication)
```

---

## 5. API Requirements

### 5.1 Endpoints

#### Profile Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/customers/me | Get current customer profile | Yes |
| PUT | /api/customers/me | Update profile | Yes |
| DELETE | /api/customers/me | Delete account (soft) | Yes |

#### Address Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/customers/me/addresses | List saved addresses | Yes |
| POST | /api/customers/me/addresses | Add new address | Yes |
| GET | /api/customers/me/addresses/{id} | Get specific address | Yes |
| PUT | /api/customers/me/addresses/{id} | Update address | Yes |
| DELETE | /api/customers/me/addresses/{id} | Delete address | Yes |
| PUT | /api/customers/me/addresses/{id}/default | Set as default | Yes |

#### Order History
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/customers/me/orders | List customer's orders | Yes |
| GET | /api/customers/me/orders/{id} | Get order details | Yes |

### 5.2 Request/Response Examples

#### Get Profile Response
```json
{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "userId": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567",
  "dateOfBirth": "1990-05-15",
  "createdDate": "2024-01-15T08:00:00Z",
  "updatedDate": "2024-12-20T14:22:00Z"
}
```

#### Update Profile Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567",
  "dateOfBirth": "1990-05-15"
}
```

#### Add Address Request
```json
{
  "label": "Home",
  "fullName": "John Doe",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "Portland",
  "state": "OR",
  "postalCode": "97201",
  "country": "US",
  "phone": "+1-555-123-4567",
  "isDefault": true
}
```

#### List Addresses Response
```json
{
  "addresses": [
    {
      "customerAddressId": "7fa85f64-5717-4562-b3fc-2c963f66afa7",
      "label": "Home",
      "fullName": "John Doe",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4B",
      "city": "Portland",
      "state": "OR",
      "postalCode": "97201",
      "country": "US",
      "phone": "+1-555-123-4567",
      "isDefault": true
    },
    {
      "customerAddressId": "8fa85f64-5717-4562-b3fc-2c963f66afa8",
      "label": "Work",
      "fullName": "John Doe",
      "addressLine1": "456 Business Ave",
      "addressLine2": "Suite 100",
      "city": "Portland",
      "state": "OR",
      "postalCode": "97204",
      "country": "US",
      "phone": "+1-555-987-6543",
      "isDefault": false
    }
  ]
}
```

#### Order History Response
```json
{
  "orders": [
    {
      "orderId": "9fa85f64-5717-4562-b3fc-2c963f66afa9",
      "orderNumber": "VLT-20241227-001234",
      "status": "Delivered",
      "total": 323.97,
      "itemCount": 3,
      "createdDate": "2024-12-20T14:30:00Z"
    },
    {
      "orderId": "afa85f64-5717-4562-b3fc-2c963f66afaa",
      "orderNumber": "VLT-20241215-005678",
      "status": "Confirmed",
      "total": 159.99,
      "itemCount": 1,
      "createdDate": "2024-12-15T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

---

## 6. Acceptance Test Scenarios

### 6.1 Profile Management

```gherkin
Feature: Profile Management

Scenario: View profile
  Given a customer is logged in
  When they request their profile
  Then they receive their profile information
  And sensitive data is not included

Scenario: Update profile
  Given a customer is logged in
  When they update their first name to "Jane"
  Then the profile is updated
  And the UpdatedDate is set to current time
```

### 6.2 Address Management

```gherkin
Feature: Address Management

Scenario: Add first address as default
  Given a customer is logged in with no addresses
  When they add a new address
  Then the address is saved
  And it is automatically set as default

Scenario: Change default address
  Given a customer has multiple addresses
  When they set a non-default address as default
  Then the new address becomes default
  And the previous default is no longer default

Scenario: Cannot exceed maximum addresses
  Given a customer has 10 saved addresses
  When they attempt to add another address
  Then the operation is rejected
  And an error indicates maximum addresses reached
```

---

## 7. Integration with Order System

### 7.1 Guest Checkout Flow
1. Customer does not login
2. Customer provides email and address during checkout
3. Order created with `CustomerId = null`
4. Email stored directly on Order entity
5. Address copied to Order (not linked)

### 7.2 Registered Customer Checkout Flow
1. Customer logs in (via User aggregate)
2. Customer selects from saved addresses (or enters new)
3. Order created with `CustomerId` reference
4. Selected address copied to Order (snapshot)
5. Customer can view order in order history

---

## 8. Dependencies

### 8.1 Internal Dependencies
- User aggregate for authentication
- Existing `ITokenService` for JWT validation
- Order system for order history queries

---

## 9. Out of Scope (Future Phases)

- Social login (Google, Facebook, Apple)
- Two-factor authentication (2FA)
- Account merge (guest to registered)
- Wishlist/favorites
- Payment method storage (handled by Stripe)
- Loyalty points/rewards

---

## 10. Glossary

| Term | Definition |
|------|------------|
| Customer | A profile entity linked to a User account |
| Guest | A user who checks out without an account |
| Soft Delete | Marking record as deleted without removing from database |
| User | Authentication entity with email and password |
| Address Snapshot | Copy of address stored with order (immutable) |
| Default Address | Primary address used during checkout |
