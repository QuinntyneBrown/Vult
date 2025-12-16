# Vult

A modern .NET solution built with clean architecture principles, providing a scalable foundation for enterprise applications.

## 🏗️ Solution Structure

The solution follows a layered architecture pattern with clear separation of concerns:

```
Vult/
├── src/
│   ├── Vult.Core/              # Domain models, interfaces, and business logic
│   ├── Vult.Infrastructure/    # Data access, external services, and infrastructure concerns
│   ├── Vult.Api/               # RESTful API endpoints and controllers
│   └── Vult.App/               # Web application UI (Razor Pages)
└── test/
    ├── Vult.Core.Tests/        # Unit tests for Core layer
    ├── Vult.Infrastructure.Tests/  # Unit tests for Infrastructure layer
    └── Vult.Api.Tests/         # Unit tests for API layer
```

## 📋 Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) or later
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB or full instance)
- IDE of your choice:
  - [Visual Studio 2022](https://visualstudio.microsoft.com/) (v17.12 or later)
  - [Visual Studio Code](https://code.visualstudio.com/) with C# extension
  - [JetBrains Rider](https://www.jetbrains.com/rider/)

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/QuinntyneBrown/Vult.git
cd Vult
```

### Build the Solution

```bash
dotnet build
```

### Database Setup

The application uses Entity Framework Core with SQL Server Express for data persistence.

#### 1. Configure Connection String

The default connection string in `src/Vult.Api/appsettings.json` is configured for SQL Server Express:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=VultDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

**Adjust the connection string** based on your SQL Server installation:
- For **SQL Server Express**: `Server=localhost\\SQLEXPRESS;...`
- For **LocalDB**: `Server=(localdb)\\mssqllocaldb;...`
- For **full SQL Server**: `Server=localhost;...`

#### 2. Apply Database Migrations

Navigate to the API project and run migrations to create the database:

```bash
cd src/Vult.Api
dotnet ef database update
```

This will:
- Create the `VultDb` database
- Create the `CatalogItems` and `CatalogItemImages` tables
- Apply all pending migrations

#### 3. Verify Database Creation

You can verify the database was created successfully using:

```bash
dotnet ef database update --verbose
```

Or connect to SQL Server using SQL Server Management Studio (SSMS) or Azure Data Studio to inspect the database structure.

### Run Tests

```bash
dotnet test
```

### Run the API

```bash
cd src/Vult.Api
dotnet run
```

The API will be available at `https://localhost:5001` (or the port shown in the console output).

### Run the Web Application

```bash
cd src/Vult.App
dotnet run
```

The web application will be available at `https://localhost:5002` (or the port shown in the console output).

## 🏛️ Architecture

### Core Layer (`Vult.Core`)

The Core layer contains the domain model and business logic. It defines:

- **Domain Entities**: Core business objects and value types
  - `CatalogItem`: Represents catalog items with properties like MSRP, resale value, brand, size, etc.
  - `CatalogItemImage`: Represents images associated with catalog items
- **Enums**: Domain enumerations
  - `Gender`: Mens, Womens, Unisex
  - `ClothingType`: Shoe, Pants, Jacket, Shirt, Shorts, Dress, Skirt, Sweater, Hoodie, Coat
- **Interfaces**: Contracts for repositories, services, and external dependencies
  - `IVultContext`: Database context interface for data access
- **Business Logic**: Domain services and business rules
- **Exceptions**: Custom domain exceptions

**Dependencies**: Microsoft.EntityFrameworkCore (for IVultContext interface only)

**Design Principles**:
- Domain-Driven Design (DDD)
- SOLID principles
- Dependency Inversion

### Infrastructure Layer (`Vult.Infrastructure`)

The Infrastructure layer implements the interfaces defined in the Core layer:

- **Data Access**: Entity Framework Core, repository implementations
  - `VultContext`: DbContext implementation for SQL Server data access
  - Configured with SQL Server Express
  - Implements `IVultContext` interface from Core layer
- **External Services**: Third-party API clients, email services, etc.
- **Cross-Cutting Concerns**: Logging, caching, file storage

**Database Configuration**:
- Entity Framework Core 10.0
- SQL Server provider
- Code-first migrations (migrations stored in API project)
- String-based enum storage for Gender and ClothingType
- Decimal precision (18,2) for monetary values

**Dependencies**: 
- Vult.Core
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Design

**Design Principles**:
- Repository pattern
- Unit of Work pattern
- Dependency Injection

### API Layer (`Vult.Api`)

The API layer provides RESTful endpoints for external consumers:

- **Controllers**: HTTP endpoints and request handling
- **DTOs**: Data transfer objects for API contracts
- **Middleware**: Authentication, error handling, logging
- **Configuration**: Dependency injection, services setup

**Dependencies**: 
- Vult.Core
- Vult.Infrastructure

**Technologies**:
- ASP.NET Core Web API
- OpenAPI/Swagger for API documentation

### App Layer (`Vult.App`)

The App layer provides a web-based user interface:

- **Pages**: Razor Pages for server-rendered UI
- **View Models**: Data models for views
- **Static Assets**: CSS, JavaScript, images

**Dependencies**: 
- Vult.Core

**Technologies**:
- ASP.NET Core Razor Pages
- Bootstrap (default template styling)

## 🧪 Testing

The solution uses [NUnit](https://nunit.org/) as the testing framework. Each source project has a corresponding test project:

- **Vult.Core.Tests**: Tests for domain logic and business rules
- **Vult.Infrastructure.Tests**: Tests for data access and external integrations
- **Vult.Api.Tests**: Tests for API endpoints and controllers

### Running Tests

```bash
# Run all tests
dotnet test

# Run tests for a specific project
dotnet test test/Vult.Core.Tests/Vult.Core.Tests.csproj

# Run tests with code coverage
dotnet test --collect:"XPlat Code Coverage"
```

## 🔧 Development Guidelines

### Adding New Features

1. **Define the domain model** in `Vult.Core`
2. **Implement data access** in `Vult.Infrastructure`
3. **Create API endpoints** in `Vult.Api`
4. **Write tests** for each layer
5. **Update documentation** as needed

### Project References

- Infrastructure can reference Core
- API can reference Core and Infrastructure
- App can reference Core
- Test projects reference their corresponding source projects
- Core should not reference any other project (keep it pure)

### Coding Standards

- Follow [C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- Use async/await for I/O operations
- Implement proper error handling and logging
- Write meaningful unit tests for business logic
- Keep methods small and focused (Single Responsibility Principle)

## 📦 NuGet Packages

Key packages used across the solution:

- **Testing**: NUnit, NUnit3TestAdapter, Microsoft.NET.Test.Sdk
- **API**: Microsoft.AspNetCore.OpenApi (for Swagger/OpenAPI support)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes following the coding standards
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

[Specify your license here]

## 👥 Authors

Quinntyne Brown

## 🔗 Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
