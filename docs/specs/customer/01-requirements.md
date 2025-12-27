# Customer Management System - Requirements Specification

**Version:** 1.0
**Date:** December 2024
**Author:** Product Team
**Status:** Draft

---

## 1. Executive Summary

This document specifies the requirements for implementing a Customer Management system for the Vult e-commerce platform. The system will enable customers to create accounts, manage profiles, save addresses, and track order history. This specification supports the Order and Payment system by providing customer identity and address management.

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

---

## 2. Functional Requirements

### 2.1 Customer Registration

#### FR-001: Create Customer Account
**Priority:** High
**Description:** The system shall allow users to create a customer account.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-001.1 | Email address must be unique across all customers | Database constraint |
| AC-001.2 | Email address must be valid format | Regex validation |
| AC-001.3 | Password must meet minimum security requirements | Validation rules |
| AC-001.4 | First name and last name are required | API validation |
| AC-001.5 | Account creation sends welcome email (Phase 2) | Email service |
| AC-001.6 | Customer receives a unique CustomerId | Auto-generated GUID |

#### FR-002: Customer Authentication
**Priority:** High
**Description:** The system shall authenticate customers using email and password.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-002.1 | Customer can login with email and password | API endpoint |
| AC-002.2 | Successful login returns JWT token | Token service |
| AC-002.3 | Failed login returns generic error (security) | No email enumeration |
| AC-002.4 | Token expires after configurable period | JWT expiry |
| AC-002.5 | Customer can logout (token invalidation) | Token blacklist/refresh |

#### FR-003: Password Management
**Priority:** Medium
**Description:** The system shall allow customers to manage their passwords.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-003.1 | Customer can change password when logged in | Requires current password |
| AC-003.2 | Password reset via email link (Phase 2) | Secure token |
| AC-003.3 | Passwords stored using secure hashing | PBKDF2/bcrypt |
| AC-003.4 | Password history prevents reuse (optional) | Last 3 passwords |

---

### 2.2 Profile Management

#### FR-004: View Profile
**Priority:** High
**Description:** The system shall allow customers to view their profile information.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-004.1 | Customer can view all profile fields | GET endpoint |
| AC-004.2 | Sensitive data (password) is never returned | DTO exclusion |
| AC-004.3 | Profile includes account creation date | Metadata |

#### FR-005: Update Profile
**Priority:** High
**Description:** The system shall allow customers to update their profile.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-005.1 | Customer can update first name | PUT endpoint |
| AC-005.2 | Customer can update last name | PUT endpoint |
| AC-005.3 | Customer can update phone number | PUT endpoint |
| AC-005.4 | Email change requires verification (Phase 2) | Email confirmation |
| AC-005.5 | Profile updates are audited with timestamp | UpdatedDate field |

#### FR-006: Delete Account
**Priority:** Low
**Description:** The system shall allow customers to delete their account.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-006.1 | Customer can request account deletion | Soft delete |
| AC-006.2 | Deletion is soft (IsDeleted flag) | Data retention |
| AC-006.3 | Deleted accounts cannot login | Auth check |
| AC-006.4 | Order history preserved for records | Foreign key intact |

---

### 2.3 Address Management

#### FR-007: Add Shipping Address
**Priority:** High
**Description:** The system shall allow customers to save shipping addresses.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-007.1 | Customer can add multiple addresses | One-to-many |
| AC-007.2 | Address includes: Label, FullName, Line1, Line2, City, State, PostalCode, Country, Phone | Required fields |
| AC-007.3 | Customer can set one address as default | Boolean flag |
| AC-007.4 | Maximum 10 addresses per customer | Business rule |

#### FR-008: Update Address
**Priority:** High
**Description:** The system shall allow customers to update saved addresses.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-008.1 | Customer can update any field | PUT endpoint |
| AC-008.2 | Customer can change default address | Toggle default |
| AC-008.3 | Only address owner can update | Authorization |

#### FR-009: Delete Address
**Priority:** Medium
**Description:** The system shall allow customers to delete saved addresses.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-009.1 | Customer can delete non-default address | DELETE endpoint |
| AC-009.2 | Deleting default address requires new default selection | Validation |
| AC-009.3 | Addresses used in orders are preserved (snapshot) | Order independence |

---

### 2.4 Order History

#### FR-010: View Order History
**Priority:** High
**Description:** The system shall allow customers to view their order history.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-010.1 | Customer can view list of past orders | GET endpoint |
| AC-010.2 | Orders sorted by date descending | Default sort |
| AC-010.3 | Pagination support for large history | Query params |
| AC-010.4 | Customer can filter by status | Query params |

#### FR-011: View Order Details
**Priority:** High
**Description:** The system shall allow customers to view details of a specific order.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-011.1 | Customer can view order line items | Include navigation |
| AC-011.2 | Customer can view order status | Real-time status |
| AC-011.3 | Customer can view shipping address used | Order snapshot |
| AC-011.4 | Only order owner can view details | Authorization |

---

### 2.5 Preferences (Phase 2)

#### FR-012: Communication Preferences
**Priority:** Low
**Description:** The system shall allow customers to manage communication preferences.

**Acceptance Criteria:**
| ID | Criteria | Verification |
|----|----------|--------------|
| AC-012.1 | Customer can opt-in/out of marketing emails | Boolean flag |
| AC-012.2 | Customer can opt-in/out of SMS notifications | Boolean flag |
| AC-012.3 | Transactional emails always sent | Non-configurable |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Customer registration response time | < 500ms |
| NFR-002 | Login response time | < 300ms |
| NFR-003 | Profile retrieval | < 200ms |
| NFR-004 | Address list retrieval | < 200ms |

### 3.2 Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-005 | Password minimum 8 characters | Validation |
| NFR-006 | Password requires uppercase, lowercase, number | Regex |
| NFR-007 | Passwords hashed with PBKDF2 + salt | PasswordHasher |
| NFR-008 | JWT tokens signed with secure key | HMAC-SHA256 |
| NFR-009 | Rate limiting on login attempts | 5 attempts/minute |
| NFR-010 | No email enumeration on login failure | Generic error |
| NFR-011 | HTTPS required for all endpoints | TLS 1.2+ |

### 3.3 Privacy & Compliance

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-012 | Customer data exportable (GDPR) | Export endpoint |
| NFR-013 | Account deletion supported (GDPR) | Soft delete |
| NFR-014 | Audit trail for profile changes | UpdatedDate |
| NFR-015 | Sensitive data not logged | Log filtering |

### 3.4 Scalability

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-016 | Support 100,000+ customers | Index optimization |
| NFR-017 | Efficient address lookup | Composite index |

---

## 4. Data Requirements

### 4.1 Customer Entity

```
Customer
├── CustomerId: Guid (PK)
├── Email: string (unique, required)
├── PasswordHash: string (required)
├── PasswordSalt: string (required)
├── FirstName: string (required)
├── LastName: string (required)
├── Phone: string? (optional)
├── DateOfBirth: DateTime? (optional)
├── IsEmailVerified: bool (default: false)
├── IsDeleted: bool (default: false)
├── MarketingEmailOptIn: bool (default: false)
├── SmsOptIn: bool (default: false)
├── LastLoginDate: DateTime?
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

### 4.3 Relationship to Orders

```
Customer (1) ──────── (*) Order
    │                      │
    │                      └── CustomerId (FK, nullable for guests)
    │
    └── (*) CustomerAddress
              │
              └── Used as template for Order shipping/billing
                  (copied, not referenced)
```

---

## 5. API Requirements

### 5.1 Endpoints

#### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/customers/register | Create new customer | No |
| POST | /api/customers/login | Authenticate customer | No |
| POST | /api/customers/logout | Invalidate token | Yes |
| POST | /api/customers/refresh-token | Refresh JWT | Yes |

#### Profile Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/customers/me | Get current customer profile | Yes |
| PUT | /api/customers/me | Update profile | Yes |
| DELETE | /api/customers/me | Delete account (soft) | Yes |
| PUT | /api/customers/me/password | Change password | Yes |

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

#### Register Customer Request
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567"
}
```

#### Register Customer Response
```json
{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567",
  "createdDate": "2024-12-27T10:30:00Z"
}
```

#### Login Request
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

#### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-12-27T22:30:00Z",
  "customer": {
    "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Get Profile Response
```json
{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567",
  "dateOfBirth": "1990-05-15",
  "isEmailVerified": true,
  "marketingEmailOptIn": true,
  "smsOptIn": false,
  "lastLoginDate": "2024-12-27T10:30:00Z",
  "createdDate": "2024-01-15T08:00:00Z",
  "updatedDate": "2024-12-20T14:22:00Z"
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

## 6. Password Requirements

### 6.1 Password Policy

| Requirement | Value |
|-------------|-------|
| Minimum length | 8 characters |
| Maximum length | 128 characters |
| Require uppercase | Yes (at least 1) |
| Require lowercase | Yes (at least 1) |
| Require number | Yes (at least 1) |
| Require special character | No (recommended) |
| Password expiry | None |

### 6.2 Password Validation Regex
```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$
```

---

## 7. Acceptance Test Scenarios

### 7.1 Customer Registration

```gherkin
Feature: Customer Registration

Scenario: Successful registration with valid data
  Given a visitor is on the registration page
  When they provide valid email "newuser@example.com"
  And they provide password "SecurePass123"
  And they provide first name "Jane"
  And they provide last name "Smith"
  And they submit the registration form
  Then a new customer account is created
  And the customer receives a success response
  And the customer can login with their credentials

Scenario: Registration fails with duplicate email
  Given a customer exists with email "existing@example.com"
  When a visitor attempts to register with email "existing@example.com"
  Then registration is rejected
  And an error message indicates email is already in use

Scenario: Registration fails with weak password
  Given a visitor is registering
  When they provide password "weak"
  Then registration is rejected
  And an error message indicates password requirements
```

### 7.2 Customer Authentication

```gherkin
Feature: Customer Authentication

Scenario: Successful login
  Given a customer exists with email "user@example.com" and password "SecurePass123"
  When the customer logs in with correct credentials
  Then they receive a valid JWT token
  And their last login date is updated

Scenario: Login fails with incorrect password
  Given a customer exists with email "user@example.com"
  When they attempt login with incorrect password
  Then login is rejected
  And a generic error message is returned (no email enumeration)

Scenario: Login fails for deleted account
  Given a customer account is soft-deleted
  When they attempt to login
  Then login is rejected
  And an error indicates the account is inactive
```

### 7.3 Address Management

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

## 8. Integration with Order System

### 8.1 Guest Checkout Flow
1. Customer does not login
2. Customer provides email and address during checkout
3. Order created with `CustomerId = null`
4. Email stored directly on Order entity
5. Address copied to Order (not linked)

### 8.2 Registered Customer Checkout Flow
1. Customer logs in
2. Customer selects from saved addresses (or enters new)
3. Order created with `CustomerId` reference
4. Selected address copied to Order (snapshot)
5. Customer can view order in order history

### 8.3 Link Guest Orders (Future Enhancement)
- After registration, customer can link past orders by email
- System matches `Order.CustomerEmail` with `Customer.Email`
- Orders updated with `CustomerId` reference

---

## 9. Dependencies

### 9.1 Internal Dependencies
- Existing `IPasswordHasher` service in Vult.Core
- Existing `ITokenService` for JWT generation
- Order system for order history queries

### 9.2 External Services
| Service | Purpose | Required |
|---------|---------|----------|
| SMTP/SendGrid | Email verification, password reset | Phase 2 |

---

## 10. Out of Scope (Future Phases)

- Social login (Google, Facebook, Apple)
- Two-factor authentication (2FA)
- Email verification flow
- Password reset via email
- Account merge (guest to registered)
- Wishlist/favorites
- Payment method storage (handled by Stripe)
- Loyalty points/rewards

---

## 11. Glossary

| Term | Definition |
|------|------------|
| Customer | A registered user with an account |
| Guest | A user who checks out without an account |
| Soft Delete | Marking record as deleted without removing from database |
| JWT | JSON Web Token for authentication |
| Address Snapshot | Copy of address stored with order (immutable) |
| Default Address | Primary address used during checkout |
