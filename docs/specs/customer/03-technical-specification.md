# Customer Management System - Technical Specification

**Version:** 1.0
**Date:** December 2024
**Author:** Engineering Team
**Status:** Draft

---

## 1. Overview

This document provides the technical implementation details for the Customer Management system, following the established patterns in the Vult codebase. The Customer system integrates with the existing authentication infrastructure and supports the Order system.

---

## 2. Architecture

### 2.1 Layer Responsibilities

| Layer | Project | Responsibility |
|-------|---------|----------------|
| Domain | Vult.Core | Customer, CustomerAddress entities |
| Infrastructure | Vult.Infrastructure | EF configurations, repositories |
| Application | Vult.Api | Commands, Queries, Handlers, DTOs, Controllers |

### 2.2 Integration with Existing Services

| Service | Location | Usage |
|---------|----------|-------|
| IPasswordHasher | Vult.Core | Password hashing (existing) |
| ITokenService | Vult.Core | JWT generation (existing) |
| VultContext | Vult.Infrastructure | Database context (extend) |

---

## 3. Domain Layer (Vult.Core)

### 3.1 Customer Entity

**File:** `src/Vult.Core/CustomerAggregate/Customer.cs`

```csharp
namespace Vult.Core.CustomerAggregate;

public class Customer
{
    public Guid CustomerId { get; set; }

    // Authentication
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PasswordSalt { get; set; } = string.Empty;

    // Profile
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }

    // Status
    public bool IsEmailVerified { get; set; }
    public bool IsDeleted { get; set; }

    // Preferences
    public bool MarketingEmailOptIn { get; set; }
    public bool SmsOptIn { get; set; }

    // Metadata
    public DateTime? LastLoginDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }

    // Navigation
    public ICollection<CustomerAddress> Addresses { get; set; } = new List<CustomerAddress>();

    // Computed properties
    public string FullName => $"{FirstName} {LastName}".Trim();

    // Business methods
    public bool CanLogin() => !IsDeleted;

    public CustomerAddress? GetDefaultAddress()
    {
        return Addresses.FirstOrDefault(a => a.IsDefault)
            ?? Addresses.FirstOrDefault();
    }

    public bool CanAddAddress(int maxAddresses = 10)
    {
        return Addresses.Count < maxAddresses;
    }

    public void SetDefaultAddress(Guid addressId)
    {
        foreach (var address in Addresses)
        {
            address.IsDefault = address.CustomerAddressId == addressId;
        }
    }
}
```

### 3.2 CustomerAddress Entity

**File:** `src/Vult.Core/CustomerAggregate/CustomerAddress.cs`

```csharp
namespace Vult.Core.CustomerAggregate;

public class CustomerAddress
{
    public Guid CustomerAddressId { get; set; }
    public Guid CustomerId { get; set; }

    // Address details
    public string Label { get; set; } = string.Empty;  // "Home", "Work", etc.
    public string FullName { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Phone { get; set; }

    // Status
    public bool IsDefault { get; set; }

    // Metadata
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }

    // Navigation
    public Customer Customer { get; set; } = null!;
}
```

### 3.3 Update IVultContext Interface

**Add to:** `src/Vult.Core/Data/IVultContext.cs`

```csharp
using Vult.Core.CustomerAggregate;

// Add to interface:
DbSet<Customer> Customers { get; }
DbSet<CustomerAddress> CustomerAddresses { get; }
```

---

## 4. Infrastructure Layer (Vult.Infrastructure)

### 4.1 EF Configuration - Customer

**File:** `src/Vult.Infrastructure/Data/Configurations/CustomerConfiguration.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.CustomerAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");

        builder.HasKey(c => c.CustomerId);

        // Email - unique and indexed
        builder.Property(c => c.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasIndex(c => c.Email)
            .IsUnique();

        // Authentication
        builder.Property(c => c.PasswordHash)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(c => c.PasswordSalt)
            .IsRequired()
            .HasMaxLength(256);

        // Profile
        builder.Property(c => c.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Phone)
            .HasMaxLength(50);

        // Ignore computed properties
        builder.Ignore(c => c.FullName);

        // Relationships
        builder.HasMany(c => c.Addresses)
            .WithOne(a => a.Customer)
            .HasForeignKey(a => a.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(c => c.IsDeleted);
        builder.HasIndex(c => c.CreatedDate);

        // Query filter for soft delete (optional)
        // builder.HasQueryFilter(c => !c.IsDeleted);
    }
}
```

### 4.2 EF Configuration - CustomerAddress

**File:** `src/Vult.Infrastructure/Data/Configurations/CustomerAddressConfiguration.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.CustomerAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class CustomerAddressConfiguration : IEntityTypeConfiguration<CustomerAddress>
{
    public void Configure(EntityTypeBuilder<CustomerAddress> builder)
    {
        builder.ToTable("CustomerAddresses");

        builder.HasKey(a => a.CustomerAddressId);

        builder.Property(a => a.Label)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.FullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.AddressLine1)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(a => a.AddressLine2)
            .HasMaxLength(500);

        builder.Property(a => a.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.State)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.PostalCode)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(a => a.Country)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.Phone)
            .HasMaxLength(50);

        // Indexes
        builder.HasIndex(a => a.CustomerId);
        builder.HasIndex(a => new { a.CustomerId, a.IsDefault });
    }
}
```

### 4.3 DbContext Updates

**Add to:** `src/Vult.Infrastructure/Data/VultContext.cs`

```csharp
using Vult.Core.CustomerAggregate;

// Add DbSets
public DbSet<Customer> Customers => Set<Customer>();
public DbSet<CustomerAddress> CustomerAddresses => Set<CustomerAddress>();

// In OnModelCreating, add:
modelBuilder.ApplyConfiguration(new CustomerConfiguration());
modelBuilder.ApplyConfiguration(new CustomerAddressConfiguration());
```

---

## 5. Application Layer (Vult.Api)

### 5.1 DTOs

**File:** `src/Vult.Api/Dtos/CustomerDtos.cs`

```csharp
namespace Vult.Api.Dtos;

// Registration
public record RegisterCustomerDto(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? Phone
);

// Login
public record LoginDto(
    string Email,
    string Password
);

public record LoginResultDto(
    string Token,
    DateTime ExpiresAt,
    CustomerProfileDto Customer
);

// Profile
public record CustomerProfileDto(
    Guid CustomerId,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    DateTime? DateOfBirth,
    bool IsEmailVerified,
    bool MarketingEmailOptIn,
    bool SmsOptIn,
    DateTime? LastLoginDate,
    DateTime CreatedDate,
    DateTime UpdatedDate
);

public record UpdateProfileDto(
    string? FirstName,
    string? LastName,
    string? Phone,
    DateTime? DateOfBirth,
    bool? MarketingEmailOptIn,
    bool? SmsOptIn
);

// Password
public record ChangePasswordDto(
    string CurrentPassword,
    string NewPassword
);

// Address
public record CustomerAddressDto(
    Guid CustomerAddressId,
    string Label,
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string State,
    string PostalCode,
    string Country,
    string? Phone,
    bool IsDefault
);

public record CreateAddressDto(
    string Label,
    string FullName,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string State,
    string PostalCode,
    string Country,
    string? Phone,
    bool IsDefault = false
);

public record UpdateAddressDto(
    string? Label,
    string? FullName,
    string? AddressLine1,
    string? AddressLine2,
    string? City,
    string? State,
    string? PostalCode,
    string? Country,
    string? Phone
);

// Order History
public record OrderSummaryDto(
    Guid OrderId,
    string OrderNumber,
    string Status,
    decimal Total,
    int ItemCount,
    DateTime CreatedDate
);

public record OrderHistoryResultDto(
    List<OrderSummaryDto> Orders,
    PaginationDto Pagination
);

public record PaginationDto(
    int Page,
    int PageSize,
    int TotalItems,
    int TotalPages
);
```

### 5.2 Register Customer Command

**File:** `src/Vult.Api/Features/Customers/RegisterCustomerCommand.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core.CustomerAggregate;
using Vult.Core.Data;
using Vult.Core.Services;

namespace Vult.Api.Features.Customers;

public record RegisterCustomerCommand(RegisterCustomerDto Registration)
    : IRequest<RegisterCustomerResult>;

public class RegisterCustomerResult
{
    public CustomerProfileDto? Customer { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}

public class RegisterCustomerHandler
    : IRequestHandler<RegisterCustomerCommand, RegisterCustomerResult>
{
    private readonly IVultContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterCustomerHandler(
        IVultContext context,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<RegisterCustomerResult> Handle(
        RegisterCustomerCommand request,
        CancellationToken cancellationToken)
    {
        var dto = request.Registration;
        var result = new RegisterCustomerResult();

        // Validate email format
        if (!IsValidEmail(dto.Email))
        {
            result.Errors.Add("Invalid email format");
            return result;
        }

        // Validate password strength
        var passwordErrors = ValidatePassword(dto.Password);
        if (passwordErrors.Any())
        {
            result.Errors.AddRange(passwordErrors);
            return result;
        }

        // Check email uniqueness
        var emailExists = await _context.Customers
            .AnyAsync(c => c.Email.ToLower() == dto.Email.ToLower(), cancellationToken);

        if (emailExists)
        {
            result.Errors.Add("Email address is already registered");
            return result;
        }

        // Hash password
        var salt = _passwordHasher.GenerateSalt();
        var hash = _passwordHasher.HashPassword(dto.Password, salt);

        // Create customer
        var customer = new Customer
        {
            CustomerId = Guid.NewGuid(),
            Email = dto.Email.ToLower().Trim(),
            PasswordHash = hash,
            PasswordSalt = salt,
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Phone = dto.Phone?.Trim(),
            IsEmailVerified = false,
            IsDeleted = false,
            MarketingEmailOptIn = false,
            SmsOptIn = false,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.Customer = customer.ToProfileDto();

        return result;
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private static List<string> ValidatePassword(string password)
    {
        var errors = new List<string>();

        if (password.Length < 8)
            errors.Add("Password must be at least 8 characters");

        if (password.Length > 128)
            errors.Add("Password must be at most 128 characters");

        if (!password.Any(char.IsUpper))
            errors.Add("Password must contain at least one uppercase letter");

        if (!password.Any(char.IsLower))
            errors.Add("Password must contain at least one lowercase letter");

        if (!password.Any(char.IsDigit))
            errors.Add("Password must contain at least one number");

        return errors;
    }
}
```

### 5.3 Login Customer Command

**File:** `src/Vult.Api/Features/Customers/LoginCustomerCommand.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core.Data;
using Vult.Core.Services;

namespace Vult.Api.Features.Customers;

public record LoginCustomerCommand(LoginDto Login) : IRequest<LoginCustomerResult>;

public class LoginCustomerResult
{
    public LoginResultDto? LoginResult { get; set; }
    public bool Success { get; set; }
    public string? Error { get; set; }
}

public class LoginCustomerHandler
    : IRequestHandler<LoginCustomerCommand, LoginCustomerResult>
{
    private readonly IVultContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public LoginCustomerHandler(
        IVultContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<LoginCustomerResult> Handle(
        LoginCustomerCommand request,
        CancellationToken cancellationToken)
    {
        var dto = request.Login;

        // Find customer by email
        var customer = await _context.Customers
            .FirstOrDefaultAsync(
                c => c.Email.ToLower() == dto.Email.ToLower().Trim(),
                cancellationToken);

        // Generic error to prevent email enumeration
        if (customer == null)
        {
            return new LoginCustomerResult
            {
                Success = false,
                Error = "Invalid credentials"
            };
        }

        // Check if account is deleted
        if (!customer.CanLogin())
        {
            return new LoginCustomerResult
            {
                Success = false,
                Error = "Account is inactive"
            };
        }

        // Verify password
        var passwordValid = _passwordHasher.VerifyPassword(
            dto.Password,
            customer.PasswordHash,
            customer.PasswordSalt);

        if (!passwordValid)
        {
            return new LoginCustomerResult
            {
                Success = false,
                Error = "Invalid credentials"
            };
        }

        // Generate token
        var expiresAt = DateTime.UtcNow.AddHours(24);
        var token = _tokenService.GenerateToken(
            customer.CustomerId.ToString(),
            customer.Email,
            expiresAt);

        // Update last login
        customer.LastLoginDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return new LoginCustomerResult
        {
            Success = true,
            LoginResult = new LoginResultDto(
                token,
                expiresAt,
                customer.ToProfileDto()
            )
        };
    }
}
```

### 5.4 Get Profile Query

**File:** `src/Vult.Api/Features/Customers/GetProfileQuery.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core.Data;

namespace Vult.Api.Features.Customers;

public record GetProfileQuery(Guid CustomerId) : IRequest<CustomerProfileDto?>;

public class GetProfileHandler : IRequestHandler<GetProfileQuery, CustomerProfileDto?>
{
    private readonly IVultContext _context;

    public GetProfileHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<CustomerProfileDto?> Handle(
        GetProfileQuery request,
        CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .FirstOrDefaultAsync(
                c => c.CustomerId == request.CustomerId && !c.IsDeleted,
                cancellationToken);

        return customer?.ToProfileDto();
    }
}
```

### 5.5 Update Profile Command

**File:** `src/Vult.Api/Features/Customers/UpdateProfileCommand.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core.Data;

namespace Vult.Api.Features.Customers;

public record UpdateProfileCommand(
    Guid CustomerId,
    UpdateProfileDto Profile
) : IRequest<UpdateProfileResult>;

public class UpdateProfileResult
{
    public CustomerProfileDto? Customer { get; set; }
    public bool Success { get; set; }
    public string? Error { get; set; }
}

public class UpdateProfileHandler
    : IRequestHandler<UpdateProfileCommand, UpdateProfileResult>
{
    private readonly IVultContext _context;

    public UpdateProfileHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<UpdateProfileResult> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .FirstOrDefaultAsync(
                c => c.CustomerId == request.CustomerId && !c.IsDeleted,
                cancellationToken);

        if (customer == null)
        {
            return new UpdateProfileResult
            {
                Success = false,
                Error = "Customer not found"
            };
        }

        var dto = request.Profile;

        // Update only provided fields
        if (!string.IsNullOrWhiteSpace(dto.FirstName))
            customer.FirstName = dto.FirstName.Trim();

        if (!string.IsNullOrWhiteSpace(dto.LastName))
            customer.LastName = dto.LastName.Trim();

        if (dto.Phone != null)
            customer.Phone = dto.Phone.Trim();

        if (dto.DateOfBirth.HasValue)
            customer.DateOfBirth = dto.DateOfBirth.Value;

        if (dto.MarketingEmailOptIn.HasValue)
            customer.MarketingEmailOptIn = dto.MarketingEmailOptIn.Value;

        if (dto.SmsOptIn.HasValue)
            customer.SmsOptIn = dto.SmsOptIn.Value;

        customer.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateProfileResult
        {
            Success = true,
            Customer = customer.ToProfileDto()
        };
    }
}
```

### 5.6 Address Commands

**File:** `src/Vult.Api/Features/Customers/AddressCommands.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core.CustomerAggregate;
using Vult.Core.Data;

namespace Vult.Api.Features.Customers;

// Get Addresses Query
public record GetAddressesQuery(Guid CustomerId)
    : IRequest<List<CustomerAddressDto>>;

public class GetAddressesHandler
    : IRequestHandler<GetAddressesQuery, List<CustomerAddressDto>>
{
    private readonly IVultContext _context;

    public GetAddressesHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<List<CustomerAddressDto>> Handle(
        GetAddressesQuery request,
        CancellationToken cancellationToken)
    {
        var addresses = await _context.CustomerAddresses
            .Where(a => a.CustomerId == request.CustomerId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedDate)
            .ToListAsync(cancellationToken);

        return addresses.Select(a => a.ToDto()).ToList();
    }
}

// Add Address Command
public record AddAddressCommand(Guid CustomerId, CreateAddressDto Address)
    : IRequest<AddAddressResult>;

public class AddAddressResult
{
    public CustomerAddressDto? Address { get; set; }
    public bool Success { get; set; }
    public string? Error { get; set; }
}

public class AddAddressHandler : IRequestHandler<AddAddressCommand, AddAddressResult>
{
    private readonly IVultContext _context;
    private const int MaxAddresses = 10;

    public AddAddressHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<AddAddressResult> Handle(
        AddAddressCommand request,
        CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(
                c => c.CustomerId == request.CustomerId && !c.IsDeleted,
                cancellationToken);

        if (customer == null)
        {
            return new AddAddressResult
            {
                Success = false,
                Error = "Customer not found"
            };
        }

        if (!customer.CanAddAddress(MaxAddresses))
        {
            return new AddAddressResult
            {
                Success = false,
                Error = $"Maximum of {MaxAddresses} addresses allowed"
            };
        }

        var dto = request.Address;
        var isFirstAddress = !customer.Addresses.Any();

        // If setting as default, unset existing default
        if (dto.IsDefault || isFirstAddress)
        {
            foreach (var addr in customer.Addresses)
            {
                addr.IsDefault = false;
            }
        }

        var address = new CustomerAddress
        {
            CustomerAddressId = Guid.NewGuid(),
            CustomerId = customer.CustomerId,
            Label = dto.Label.Trim(),
            FullName = dto.FullName.Trim(),
            AddressLine1 = dto.AddressLine1.Trim(),
            AddressLine2 = dto.AddressLine2?.Trim(),
            City = dto.City.Trim(),
            State = dto.State.Trim(),
            PostalCode = dto.PostalCode.Trim(),
            Country = dto.Country.Trim(),
            Phone = dto.Phone?.Trim(),
            IsDefault = dto.IsDefault || isFirstAddress,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _context.CustomerAddresses.Add(address);
        await _context.SaveChangesAsync(cancellationToken);

        return new AddAddressResult
        {
            Success = true,
            Address = address.ToDto()
        };
    }
}

// Update Address Command
public record UpdateAddressCommand(
    Guid CustomerId,
    Guid AddressId,
    UpdateAddressDto Address
) : IRequest<UpdateAddressResult>;

public class UpdateAddressResult
{
    public CustomerAddressDto? Address { get; set; }
    public bool Success { get; set; }
    public string? Error { get; set; }
}

public class UpdateAddressHandler
    : IRequestHandler<UpdateAddressCommand, UpdateAddressResult>
{
    private readonly IVultContext _context;

    public UpdateAddressHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<UpdateAddressResult> Handle(
        UpdateAddressCommand request,
        CancellationToken cancellationToken)
    {
        var address = await _context.CustomerAddresses
            .FirstOrDefaultAsync(
                a => a.CustomerAddressId == request.AddressId
                    && a.CustomerId == request.CustomerId,
                cancellationToken);

        if (address == null)
        {
            return new UpdateAddressResult
            {
                Success = false,
                Error = "Address not found"
            };
        }

        var dto = request.Address;

        if (!string.IsNullOrWhiteSpace(dto.Label))
            address.Label = dto.Label.Trim();

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            address.FullName = dto.FullName.Trim();

        if (!string.IsNullOrWhiteSpace(dto.AddressLine1))
            address.AddressLine1 = dto.AddressLine1.Trim();

        if (dto.AddressLine2 != null)
            address.AddressLine2 = dto.AddressLine2.Trim();

        if (!string.IsNullOrWhiteSpace(dto.City))
            address.City = dto.City.Trim();

        if (!string.IsNullOrWhiteSpace(dto.State))
            address.State = dto.State.Trim();

        if (!string.IsNullOrWhiteSpace(dto.PostalCode))
            address.PostalCode = dto.PostalCode.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Country))
            address.Country = dto.Country.Trim();

        if (dto.Phone != null)
            address.Phone = dto.Phone.Trim();

        address.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateAddressResult
        {
            Success = true,
            Address = address.ToDto()
        };
    }
}

// Delete Address Command
public record DeleteAddressCommand(Guid CustomerId, Guid AddressId)
    : IRequest<DeleteAddressResult>;

public class DeleteAddressResult
{
    public bool Success { get; set; }
    public string? Error { get; set; }
}

public class DeleteAddressHandler
    : IRequestHandler<DeleteAddressCommand, DeleteAddressResult>
{
    private readonly IVultContext _context;

    public DeleteAddressHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<DeleteAddressResult> Handle(
        DeleteAddressCommand request,
        CancellationToken cancellationToken)
    {
        var address = await _context.CustomerAddresses
            .FirstOrDefaultAsync(
                a => a.CustomerAddressId == request.AddressId
                    && a.CustomerId == request.CustomerId,
                cancellationToken);

        if (address == null)
        {
            return new DeleteAddressResult
            {
                Success = false,
                Error = "Address not found"
            };
        }

        if (address.IsDefault)
        {
            return new DeleteAddressResult
            {
                Success = false,
                Error = "Cannot delete default address. Set another address as default first."
            };
        }

        _context.CustomerAddresses.Remove(address);
        await _context.SaveChangesAsync(cancellationToken);

        return new DeleteAddressResult { Success = true };
    }
}

// Set Default Address Command
public record SetDefaultAddressCommand(Guid CustomerId, Guid AddressId)
    : IRequest<SetDefaultAddressResult>;

public class SetDefaultAddressResult
{
    public bool Success { get; set; }
    public string? Error { get; set; }
}

public class SetDefaultAddressHandler
    : IRequestHandler<SetDefaultAddressCommand, SetDefaultAddressResult>
{
    private readonly IVultContext _context;

    public SetDefaultAddressHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<SetDefaultAddressResult> Handle(
        SetDefaultAddressCommand request,
        CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(
                c => c.CustomerId == request.CustomerId && !c.IsDeleted,
                cancellationToken);

        if (customer == null)
        {
            return new SetDefaultAddressResult
            {
                Success = false,
                Error = "Customer not found"
            };
        }

        var address = customer.Addresses
            .FirstOrDefault(a => a.CustomerAddressId == request.AddressId);

        if (address == null)
        {
            return new SetDefaultAddressResult
            {
                Success = false,
                Error = "Address not found"
            };
        }

        customer.SetDefaultAddress(request.AddressId);

        foreach (var addr in customer.Addresses)
        {
            addr.UpdatedDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new SetDefaultAddressResult { Success = true };
    }
}
```

### 5.7 Order History Query

**File:** `src/Vult.Api/Features/Customers/GetOrderHistoryQuery.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core.Data;

namespace Vult.Api.Features.Customers;

public record GetOrderHistoryQuery(
    Guid CustomerId,
    int Page = 1,
    int PageSize = 10,
    string? Status = null
) : IRequest<OrderHistoryResultDto>;

public class GetOrderHistoryHandler
    : IRequestHandler<GetOrderHistoryQuery, OrderHistoryResultDto>
{
    private readonly IVultContext _context;

    public GetOrderHistoryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<OrderHistoryResultDto> Handle(
        GetOrderHistoryQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.Orders
            .Where(o => o.CustomerId == request.CustomerId);

        // Filter by status if provided
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            query = query.Where(o => o.Status.ToString() == request.Status);
        }

        // Get total count
        var totalItems = await query.CountAsync(cancellationToken);

        // Get paginated results
        var orders = await query
            .OrderByDescending(o => o.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(o => new OrderSummaryDto(
                o.OrderId,
                o.OrderNumber,
                o.Status.ToString(),
                o.Total,
                o.LineItems.Count,
                o.CreatedDate
            ))
            .ToListAsync(cancellationToken);

        var totalPages = (int)Math.Ceiling(totalItems / (double)request.PageSize);

        return new OrderHistoryResultDto(
            orders,
            new PaginationDto(request.Page, request.PageSize, totalItems, totalPages)
        );
    }
}
```

### 5.8 Customers Controller

**File:** `src/Vult.Api/Controllers/CustomersController.cs`

```csharp
using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Dtos;
using Vult.Api.Features.Customers;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private Guid GetCustomerId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(claim!);
    }

    // ============ Authentication ============

    [HttpPost("register")]
    [ProducesResponseType(typeof(CustomerProfileDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterCustomerDto dto)
    {
        var result = await _mediator.Send(new RegisterCustomerCommand(dto));

        if (!result.Success)
            return BadRequest(new { errors = result.Errors });

        return CreatedAtAction(
            nameof(GetProfile),
            new { },
            result.Customer);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _mediator.Send(new LoginCustomerCommand(dto));

        if (!result.Success)
            return Unauthorized(new { error = result.Error });

        return Ok(result.LoginResult);
    }

    // ============ Profile ============

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(CustomerProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfile()
    {
        var customerId = GetCustomerId();
        var profile = await _mediator.Send(new GetProfileQuery(customerId));

        if (profile == null)
            return NotFound();

        return Ok(profile);
    }

    [Authorize]
    [HttpPut("me")]
    [ProducesResponseType(typeof(CustomerProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var customerId = GetCustomerId();
        var result = await _mediator.Send(new UpdateProfileCommand(customerId, dto));

        if (!result.Success)
            return BadRequest(new { error = result.Error });

        return Ok(result.Customer);
    }

    [Authorize]
    [HttpPut("me/password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var customerId = GetCustomerId();
        var result = await _mediator.Send(
            new ChangePasswordCommand(customerId, dto));

        if (!result.Success)
            return BadRequest(new { error = result.Error });

        return NoContent();
    }

    [Authorize]
    [HttpDelete("me")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAccount()
    {
        var customerId = GetCustomerId();
        await _mediator.Send(new DeleteAccountCommand(customerId));
        return NoContent();
    }

    // ============ Addresses ============

    [Authorize]
    [HttpGet("me/addresses")]
    [ProducesResponseType(typeof(List<CustomerAddressDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAddresses()
    {
        var customerId = GetCustomerId();
        var addresses = await _mediator.Send(new GetAddressesQuery(customerId));
        return Ok(addresses);
    }

    [Authorize]
    [HttpPost("me/addresses")]
    [ProducesResponseType(typeof(CustomerAddressDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddAddress([FromBody] CreateAddressDto dto)
    {
        var customerId = GetCustomerId();
        var result = await _mediator.Send(new AddAddressCommand(customerId, dto));

        if (!result.Success)
            return BadRequest(new { error = result.Error });

        return CreatedAtAction(
            nameof(GetAddress),
            new { id = result.Address!.CustomerAddressId },
            result.Address);
    }

    [Authorize]
    [HttpGet("me/addresses/{id:guid}")]
    [ProducesResponseType(typeof(CustomerAddressDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAddress(Guid id)
    {
        var customerId = GetCustomerId();
        var result = await _mediator.Send(new GetAddressQuery(customerId, id));

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [Authorize]
    [HttpPut("me/addresses/{id:guid}")]
    [ProducesResponseType(typeof(CustomerAddressDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAddress(
        Guid id,
        [FromBody] UpdateAddressDto dto)
    {
        var customerId = GetCustomerId();
        var result = await _mediator.Send(
            new UpdateAddressCommand(customerId, id, dto));

        if (!result.Success)
        {
            if (result.Error == "Address not found")
                return NotFound();

            return BadRequest(new { error = result.Error });
        }

        return Ok(result.Address);
    }

    [Authorize]
    [HttpDelete("me/addresses/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAddress(Guid id)
    {
        var customerId = GetCustomerId();
        var result = await _mediator.Send(new DeleteAddressCommand(customerId, id));

        if (!result.Success)
        {
            if (result.Error == "Address not found")
                return NotFound();

            return BadRequest(new { error = result.Error });
        }

        return NoContent();
    }

    [Authorize]
    [HttpPut("me/addresses/{id:guid}/default")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SetDefaultAddress(Guid id)
    {
        var customerId = GetCustomerId();
        var result = await _mediator.Send(
            new SetDefaultAddressCommand(customerId, id));

        if (!result.Success)
            return NotFound(new { error = result.Error });

        return NoContent();
    }

    // ============ Order History ============

    [Authorize]
    [HttpGet("me/orders")]
    [ProducesResponseType(typeof(OrderHistoryResultDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrderHistory(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null)
    {
        var customerId = GetCustomerId();
        var result = await _mediator.Send(
            new GetOrderHistoryQuery(customerId, page, pageSize, status));

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me/orders/{id:guid}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOrderDetail(Guid id)
    {
        var customerId = GetCustomerId();
        var result = await _mediator.Send(
            new GetCustomerOrderQuery(customerId, id));

        if (result == null)
            return NotFound();

        return Ok(result);
    }
}
```

### 5.9 Extension Methods

**File:** `src/Vult.Api/Extensions/CustomerExtensions.cs`

```csharp
using Vult.Api.Dtos;
using Vult.Core.CustomerAggregate;

namespace Vult.Api.Extensions;

public static class CustomerExtensions
{
    public static CustomerProfileDto ToProfileDto(this Customer customer)
    {
        return new CustomerProfileDto(
            customer.CustomerId,
            customer.Email,
            customer.FirstName,
            customer.LastName,
            customer.Phone,
            customer.DateOfBirth,
            customer.IsEmailVerified,
            customer.MarketingEmailOptIn,
            customer.SmsOptIn,
            customer.LastLoginDate,
            customer.CreatedDate,
            customer.UpdatedDate
        );
    }

    public static CustomerAddressDto ToDto(this CustomerAddress address)
    {
        return new CustomerAddressDto(
            address.CustomerAddressId,
            address.Label,
            address.FullName,
            address.AddressLine1,
            address.AddressLine2,
            address.City,
            address.State,
            address.PostalCode,
            address.Country,
            address.Phone,
            address.IsDefault
        );
    }
}
```

---

## 6. Configuration

### 6.1 Service Registration

**Add to:** `src/Vult.Api/ConfigureServices.cs`

```csharp
// Services are already registered via MediatR assembly scanning
// No additional registration needed for Customer handlers
```

---

## 7. Database Migration

```bash
# Create migration
dotnet ef migrations add AddCustomerAndAddresses \
    --project src/Vult.Infrastructure \
    --startup-project src/Vult.Api

# Apply migration
dotnet ef database update \
    --project src/Vult.Infrastructure \
    --startup-project src/Vult.Api
```

---

## 8. Testing Strategy

### 8.1 Unit Tests

| Test Class | Coverage |
|------------|----------|
| RegisterCustomerHandlerTests | Registration, validation, duplicate email |
| LoginCustomerHandlerTests | Login, password verification, deleted accounts |
| AddressHandlerTests | CRUD operations, default logic, max limit |
| CustomerTests | CanLogin, GetDefaultAddress, CanAddAddress |

### 8.2 Integration Tests

| Test | Description |
|------|-------------|
| Register_WithValidData_CreatesCustomer | End-to-end registration |
| Login_WithCorrectCredentials_ReturnsToken | Auth flow |
| Address_CRUD_Operations | Full address lifecycle |
| OrderHistory_ReturnsCustomerOrders | Order history integration |

### 8.3 Sample Test

```csharp
[Test]
public async Task Register_DuplicateEmail_ReturnsError()
{
    // Arrange
    var existingEmail = "existing@example.com";
    await CreateCustomer(existingEmail, "Password123");

    var command = new RegisterCustomerCommand(
        new RegisterCustomerDto(
            existingEmail,
            "Password123",
            "Jane",
            "Doe",
            null
        )
    );

    // Act
    var result = await _handler.Handle(command, CancellationToken.None);

    // Assert
    Assert.False(result.Success);
    Assert.Contains("already registered", result.Errors.First());
}
```

---

## 9. Security Considerations

### 9.1 Password Storage

```csharp
// Using existing IPasswordHasher with PBKDF2
var salt = _passwordHasher.GenerateSalt();  // 32 bytes random
var hash = _passwordHasher.HashPassword(password, salt);  // PBKDF2, 10000 iterations
```

### 9.2 JWT Claims

```csharp
// Claims included in token
new Claim(ClaimTypes.NameIdentifier, customerId.ToString()),
new Claim(ClaimTypes.Email, email),
new Claim("customer", "true")  // Distinguish from admin users
```

### 9.3 Authorization

- All `/me/*` endpoints require `[Authorize]` attribute
- CustomerId extracted from JWT claims
- Addresses filtered by CustomerId (no cross-customer access)
- Orders filtered by CustomerId

---

## 10. Frontend Integration

### 10.1 Angular AuthService

```typescript
@Injectable({ providedIn: 'root' })
export class CustomerAuthService {
  private tokenKey = 'vult_customer_token';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<CustomerProfile> {
    return this.http.post<CustomerProfile>('/api/customers/register', data);
  }

  login(email: string, password: string): Observable<LoginResult> {
    return this.http.post<LoginResult>('/api/customers/login', { email, password })
      .pipe(tap(result => this.setToken(result.token)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>('/api/customers/me');
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}
```

### 10.2 HTTP Interceptor

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('vult_customer_token');

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req);
  }
}
```

---

## 11. Deployment Checklist

- [ ] Run database migrations
- [ ] Configure JWT signing key (production strength)
- [ ] Set token expiration (24h recommended)
- [ ] Configure CORS for frontend domain
- [ ] Enable HTTPS
- [ ] Set up rate limiting on login endpoint
- [ ] Configure password policy if different from default
- [ ] Set up monitoring for failed login attempts
