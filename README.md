# Vult

Vult is a catalog management system with AI-powered item ingestion and evaluation, built for resale businesses that need fast, consistent pricing and rich product data.

It consists of:

- **Vult Backend Services** – .NET 10 Web API, Entity Framework Core, SQL Server, Azure AI integration.
- **Vult Web Application** – Angular 21 SPA for managing catalog items, including drag-and-drop photo ingestion.

---

## Solution Structure

The solution follows a ZoomLoop-style clean architecture with clear separation of concerns:

```text
Vult/
├── src/
│   ├── Vult.Core/              # Domain models, enums, interfaces, core business logic
│   ├── Vult.Infrastructure/    # EF Core context, mappings, Azure AI integrations, persistence
│   ├── Vult.Api/               # ASP.NET Core Web API, CQS handlers, controllers
│   └── Vult.App/               # Angular web application (frontend)
└── test/
    ├── Vult.Core.Tests/        # NUnit tests for Core
    ├── Vult.Infrastructure.Tests/  # NUnit tests for Infrastructure
    └── Vult.Api.Tests/         # NUnit tests for API
```

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) (matching the `net10.0` target)
- [Node.js 20+](https://nodejs.org/) and npm (for the Angular app)
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or compatible SQL Server instance)
- (Optional, for AI features) Azure subscription with Computer Vision / Azure AI Vision
- IDE of your choice:
  - Visual Studio 2022 (17.12+)
  - Visual Studio Code with C# and Angular tooling
  - Rider

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

### 3. Frontend – Angular App

From the `src/Vult.App` directory:

```bash
cd ../Vult.App
npm install
npm start   # runs "ng serve"
```

The Angular development server typically runs on `http://localhost:4200`. The app will be configured to call the Vult.Api via an Angular proxy once API endpoints are in place.

### 4. Running Tests

#### .NET Tests

From the repo root:

```bash
dotnet test
```

This runs the NUnit test projects under `test/`.

#### Angular Tests

From `src/Vult.App`:

```bash
npm test
```

E2E tests (Playwright) will be added under a dedicated e2e setup as the frontend feature set matures.

---

## Architecture Overview

Vult follows a layered, clean architecture inspired by the ZoomLoop repository. High-level goals:

- Keep the **domain (Core)** independent of infrastructure and UI.
- Encapsulate **data access and external services** in Infrastructure.
- Keep the **API** thin, delegating work to commands/queries and domain services.
- Treat the **Angular app** as a client of the API, focused on UX.

### Vult.Core (Domain)

Responsible for core business concepts and rules:

- Domain models such as `Product`, `ProductImage`, `User`, `Role`.
- Enums such as gender and item type for product classification.
- Interfaces like `IVultContext`, `IAzureAIService`, and service abstractions.
- Validation rules and domain behavior.

This project has no dependency on ASP.NET Core, EF Core implementations, or Angular.

### Vult.Infrastructure (Persistence & Integrations)

Implements infrastructure concerns:

- `VultContext` EF Core DbContext implementing `IVultContext`.
- Entity configurations and mappings for Product, ProductImage, auth models, etc.
- SQL Server configuration and migrations support.
- Azure AI service integration (via Azure.AI.Vision.ImageAnalysis) used for image analysis.

Infrastructure depends on Vult.Core and EF Core / Azure SDK packages.

### Vult.Api (Backend Services)

ASP.NET Core Web API providing:

- CQS-style commands and queries for catalog operations.
- Authentication and authorization services (JWT-based).
- Controllers and/or minimal APIs for catalog items, ingestion, images, and auth.
- DI configuration wiring Core and Infrastructure together.
- OpenAPI/Swagger for discoverable API documentation.

### Vult.App (Angular Web Application)

Angular 21 single-page application providing the user experience:

- Authentication UI (login/register) aligned with backend auth.
- Catalog management (list, create, edit, delete items).
- Photo upload with drag-and-drop and ingestion progress.
- Image viewing (thumbnails, gallery, zoom/lightbox).

The app communicates with Vult.Api via HTTP, following DTO contracts defined in the API layer.

---

## Testing & Quality

- **Backend**: NUnit test projects under `test/` cover domain models, services, data access, commands, queries, and controllers.
- **Frontend**: Unit tests with Vitest, with planned Playwright e2e coverage for key user flows (auth, catalog CRUD, ingestion, image viewing).

As the project evolves, CI will run both backend and frontend test suites and publish coverage reports.

---

## Contributing

1. Create a feature branch from `main`.
2. Follow the solution architecture (Core → Infrastructure → Api → App) and keep concerns separated.
3. Add or update tests for any new behavior.
4. Ensure `dotnet test` and relevant `npm` scripts pass.
5. Submit a pull request.

---

## License & Authors

- Author: Quinntyne Brown
- License: TBD (to be specified for the repository)

For more details on AI configuration, see the documentation under `docs/`.
