<p align="center">
  <img src="assets/logo and text.svg" alt="Vult Logo" width="400">
</p>

# Vult

Vult is a modern e-commerce platform for athletic apparel and footwear, featuring AI-powered product catalog management. Built with a clean architecture approach, it provides both a customer-facing storefront and an admin interface for catalog management.

It consists of:

- **Vult Backend Services** – .NET 8 Web API with Entity Framework Core, SQL Server, Azure AI Vision integration for product image analysis
- **Vult Customer Web App** – Angular 21 SPA with shopping cart, checkout, product browsing, and testimonials
- **Vult Admin Portal** – Angular 21 admin application for managing products, users, and digital assets with drag-and-drop image upload
- **Vult Component Library** – Shared Angular component library with Storybook documentation

---

## Solution Structure

The solution follows a clean architecture with clear separation of concerns:

```text
Vult/
├── src/
│   ├── Vult.Core/              # Domain models, enums, interfaces, core business logic
│   ├── Vult.Infrastructure/    # EF Core context, mappings, Azure AI integrations, persistence
│   ├── Vult.Api/               # ASP.NET Core Web API, MediatR commands/queries, controllers
│   ├── Vult.Cli/               # CLI worker service for background processing
│   └── Vult.WebApp/            # Angular 21 monorepo workspace
│       ├── projects/vult/              # Customer-facing e-commerce application
│       ├── projects/vult-admin/        # Admin portal for catalog management
│       └── projects/vult-components/   # Shared component library with Storybook
└── test/
    ├── Vult.Core.Tests/        # NUnit tests for Core
    ├── Vult.Infrastructure.Tests/  # NUnit tests for Infrastructure
    ├── Vult.Api.Tests/         # NUnit tests for API
    └── Vult.Testing/           # Shared testing utilities and helpers
```

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/) and npm 10.9.4+
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or compatible SQL Server instance)
- Azure subscription with Azure AI Vision (for product image analysis features)
- IDE of your choice:
  - Visual Studio 2022 (17.8+)
  - Visual Studio Code with C# and Angular tooling
  - JetBrains Rider

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/QuinntyneBrown/Vult.git
cd Vult
```

### 2. Backend – Build and Run

Build the .NET solution:

```bash
dotnet build Vult.sln
```

#### Database Configuration

Vult uses Entity Framework Core with SQL Server (typically SQL Server Express).

1. Update the connection string in `src/Vult.Api/appsettings.Development.json` (or `appsettings.json`) under `ConnectionStrings:DefaultConnection` to point to your SQL Server instance.
2. Apply migrations from the API project:

```bash
cd src/Vult.Api
dotnet ef database update
```

This will create the Vult database and apply the current schema (catalog tables, etc.).

#### Run the API

From `src/Vult.Api`:

```bash
dotnet run
```

By default the API will listen on the ports configured in `launchSettings.json` or environment-specific settings.

### 3. Frontend – Angular Applications

The project contains three Angular applications in a monorepo structure.

From the `src/Vult.WebApp` directory:

```bash
cd ../Vult.WebApp
npm install
```

#### Run the Customer Web App

```bash
npm start
```

Runs on `http://localhost:4200` with features:
- Product catalog browsing and search
- Shopping cart and checkout
- Order confirmation
- Customer testimonials
- Responsive design with Inter and Montserrat fonts

#### Run the Admin Portal

```bash
npm run start:admin
```

Runs on `http://localhost:4201` with features:
- Product management (CRUD operations)
- User management
- Digital asset management with drag-and-drop image upload
- Authentication with JWT
- Real-time updates via SignalR

#### Component Library with Storybook

```bash
npm run storybook
```

Runs Storybook on `http://localhost:6006` to view the shared component library documentation.

### 4. Running Tests

#### .NET Tests

From the repo root:

```bash
dotnet test
```

This runs the NUnit test projects under `test/`.

#### Angular Tests

From `src/Vult.WebApp`:

**Unit Tests (Jest)**

```bash
npm test              # Run tests once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

**E2E Tests (Playwright)**

```bash
npm run e2e           # Run all E2E tests
npm run e2e:vult      # Customer app tests only
npm run e2e:admin     # Admin portal tests only
```

---

## Architecture Overview

Vult follows a layered, clean architecture with CQRS pattern using MediatR. High-level goals:

- Keep the **domain (Core)** independent of infrastructure and UI
- Encapsulate **data access and external services** in Infrastructure
- Keep the **API** thin, delegating work to MediatR commands/queries
- Use **Angular monorepo** for multiple applications sharing components and services

### Vult.Core (Domain)

Responsible for core business concepts and rules:

- Domain models: `Product`, `ProductImage`, `User`, `DigitalAsset`, `Testimonial`
- Enums for product classification (gender, item type, etc.)
- Interfaces: `IVultContext`, `IAzureAIService`, and service abstractions
- Validation rules and domain behavior

This project has no dependency on ASP.NET Core, EF Core implementations, or Angular.

### Vult.Infrastructure (Persistence & Integrations)

Implements infrastructure concerns:

- `VultContext` EF Core DbContext implementing `IVultContext`
- Entity configurations and mappings for all domain models
- SQL Server configuration and migrations
- Azure AI Vision integration for product image analysis (Azure.AI.Vision.ImageAnalysis)

Infrastructure depends on Vult.Core and EF Core / Azure SDK packages.

### Vult.Api (Backend Services)

ASP.NET Core Web API providing:

- **MediatR-based CQRS** pattern for commands and queries
- **Controllers**: Products, Users, Digital Assets, Testimonials
- **JWT authentication** with `Microsoft.AspNetCore.Authentication.JwtBearer`
- **SignalR integration** for real-time updates
- **FluentValidation** for request validation
- **Swagger/OpenAPI** documentation
- Dependency injection configuration wiring Core and Infrastructure

### Vult.Cli (Worker Service)

.NET Worker Service for background processing:

- Long-running background tasks and scheduled jobs
- CLI commands for administrative operations
- References Vult.Api for shared logic and services

### Vult.WebApp (Angular Monorepo)

Angular 21 workspace containing three applications:

#### Vult Customer App (`projects/vult`)

Customer-facing e-commerce application:
- Product browsing and detail pages
- Shopping cart with add/remove items
- Checkout flow with order confirmation
- Customer testimonials display
- Responsive design with Material Design components
- HTTP interceptors for API base URL configuration

#### Vult Admin Portal (`projects/vult-admin`)

Administrative application for catalog management:
- JWT authentication with auth guard
- Product CRUD operations with image upload
- User management
- Real-time updates via SignalR client
- Drag-and-drop digital asset management

#### Vult Components (`projects/vult-components`)

Shared Angular component library:
- Reusable UI components
- Storybook documentation
- Published as `ng-packagr` library for use across applications

**Technology Stack:**
- Angular 21 with standalone components
- Angular Material for UI components
- Inter font for body text, Montserrat for headings
- Jest for unit testing, Playwright for E2E testing
- TypeScript 5.9

---

## Testing & Quality

### Backend Testing

- **NUnit** test projects under `test/` directory
- Coverage for domain models, services, data access, MediatR handlers, and controllers
- Shared testing utilities in `Vult.Testing` project

### Frontend Testing

- **Jest** for unit testing Angular components and services
- **Playwright** for E2E tests covering:
  - Customer flows (browsing, cart, checkout)
  - Admin flows (authentication, product management, user management)
- Separate test projects for `vult` and `vult-admin` applications
- Coverage reporting with `npm run test:coverage`

---

## Key Technologies

### Backend
- .NET 8 SDK
- Entity Framework Core 8
- SQL Server
- MediatR for CQRS
- FluentValidation
- JWT Authentication
- SignalR
- Azure AI Vision
- Swagger/OpenAPI

### Frontend
- Angular 21
- Angular Material
- TypeScript 5.9
- RxJS 7.8
- SignalR Client
- Jest & Playwright
- Storybook
- ng-packagr

---

## Contributing

1. Create a feature branch from `main`
2. Follow the clean architecture pattern (Core → Infrastructure → Api → App)
3. Keep concerns separated and maintain dependency rules
4. Add or update tests for any new behavior
5. Ensure all tests pass:
   - Backend: `dotnet test`
   - Frontend: `npm test` and `npm run e2e`
6. Submit a pull request

---

## License & Authors

- Author: Quinntyne Brown
- License: TBD (to be specified for the repository)

For more details on AI configuration, see the documentation under `docs/`.
