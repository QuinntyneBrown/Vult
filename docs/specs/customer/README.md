# Customer Management System Specification

## Overview

This specification defines the backend implementation for a Customer Management system for the Vult e-commerce platform. The system provides customer profile management, address management, and order history. Customer authentication is handled through the User aggregate, with Customer linking to User via a nullable UserId. This specification supports the [Order and Payment system](../orders/README.md) by providing customer identity and saved addresses.

## Documents

| Document | Description |
|----------|-------------|
| [01-requirements.md](./01-requirements.md) | Functional and non-functional requirements with acceptance criteria |
| [02-use-case-diagrams.md](./02-use-case-diagrams.md) | Use case diagrams, sequence diagrams, and state machines |
| [03-technical-specification.md](./03-technical-specification.md) | Technical implementation details, code samples, and architecture |

## Quick Summary

### Core Entities

```
User (1) ──────── (0..1) Customer ──────── (*) CustomerAddress
  │                        │                      │
  │                        │                      └── Label, FullName, Address fields, IsDefault
  │                        │
  │                        └── (*) Order (via CustomerId FK, nullable for guest checkout)
  │
  └── Email, IsEmailVerified, Password (authentication)
```

### Customer Lifecycle

```
┌──────────────┐   ┌────────────┐   ┌─────────┐
│ Unregistered │ → │   Active   │ → │ Deleted │
└──────────────┘   └────────────┘   └─────────┘
                         │               │
                   User Created     Soft Delete
```

### API Endpoints

#### Profile Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/customers/me` | Get current profile | Yes |
| PUT | `/api/customers/me` | Update profile | Yes |
| DELETE | `/api/customers/me` | Delete account (soft) | Yes |

#### Address Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/customers/me/addresses` | List saved addresses | Yes |
| POST | `/api/customers/me/addresses` | Add new address | Yes |
| PUT | `/api/customers/me/addresses/{id}` | Update address | Yes |
| DELETE | `/api/customers/me/addresses/{id}` | Delete address | Yes |
| PUT | `/api/customers/me/addresses/{id}/default` | Set as default | Yes |

#### Order History
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/customers/me/orders` | List past orders | Yes |
| GET | `/api/customers/me/orders/{id}` | Get order details | Yes |

### Integration with Order System

```
┌─────────────────────────────────────────────────────────────┐
│                     CHECKOUT FLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Guest Checkout:                                            │
│  ├── Order.CustomerId = null                                │
│  ├── Order.CustomerEmail = provided email                   │
│  └── Address entered manually (copied to order)             │
│                                                             │
│  Registered Customer Checkout:                              │
│  ├── Order.CustomerId = authenticated customer ID           │
│  ├── Order.CustomerEmail = user.Email                       │
│  └── Select from saved addresses (copied to order)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Customer links to User via UserId | Authentication handled by User aggregate |
| Soft delete for accounts | Preserve order history, comply with retention policies |
| Address copied to Order (not linked) | Order address immutable after placement |
| Max 10 addresses per customer | Reasonable limit, prevents abuse |
| First address auto-default | Better UX, always have a default |

### Security Features

| Feature | Implementation |
|---------|----------------|
| Password hashing | PBKDF2 with salt (via User aggregate) |
| Authentication | JWT tokens (existing ITokenService) |
| Authorization | Claims-based, CustomerId from token |

## Relationship to Other Specs

```
┌─────────────┐     ┌─────────────┐
│  Customer   │────▶│    Order    │
│    Spec     │     │    Spec     │
└─────────────┘     └─────────────┘
       │                   │
       │ CustomerId        │ Order with
       │ Addresses         │ LineItems
       │                   │ Stripe Payment
       ▼                   ▼
┌─────────────────────────────────┐
│       Vult E-Commerce           │
│         Platform                │
└─────────────────────────────────┘
```

## Out of Scope (Future Phases)

- Social login (Google, Facebook, Apple)
- Two-factor authentication (2FA)
- Account merge (guest to registered)
- Wishlist/favorites
- Payment method storage (handled by Stripe)
- Loyalty points/rewards

## Getting Started

1. Review the requirements document for acceptance criteria
2. Review use case diagrams for workflow understanding
3. Use technical specification for implementation guidance
4. Ensure Order system spec is reviewed for integration points

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2024 | Product Team | Initial specification |
| 1.1 | December 2024 | Engineering Team | Refactored to use User for auth, simplified Customer entity |
