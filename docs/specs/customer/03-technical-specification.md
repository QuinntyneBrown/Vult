# Customer Management System - Technical Specification

**Version:** 1.1
**Date:** December 2024
**Author:** Engineering Team
**Status:** Draft

---

## 1. Overview

This document provides the technical implementation details for the Customer Management system, following the established patterns in the Vult codebase. The Customer entity links to the User aggregate for authentication via a nullable UserId.

---

## 2. Architecture

### 2.1 Layer Responsibilities

| Layer | Project | Responsibility |
|-------|---------|----------------|
| Domain | Vult.Core | Customer, CustomerAddress entities |
| Infrastructure | Vult.Infrastructure | EF configurations |
| Application | Vult.Api | Commands, Queries, Handlers, DTOs, Controllers |

### 2.2 Integration with User Aggregate

| Aggregate | Responsibility |
|-----------|----------------|
| User | Authentication (email, password, login, JWT) |
| Customer | Profile data (name, phone, addresses) |

---

## 3. Domain Layer (Vult.Core)

### 3.1 Customer Entity

**File:** `src/Vult.Core/Model/CustomerAggregate/Customer.cs`

```csharp
namespace Vult.Core.Model.CustomerAggregate;

public class Customer
{
    public Guid CustomerId { get; set; }

    public Guid? UserId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }

    public ICollection<CustomerAddress> Addresses { get; set; } = new List<CustomerAddress>();

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

**File:** `src/Vult.Core/Model/CustomerAggregate/CustomerAddress.cs`

```csharp
namespace Vult.Core.Model.CustomerAggregate;

public class CustomerAddress
{
    public Guid CustomerAddressId { get; set; }

    public Guid CustomerId { get; set; }

    public string Label { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string AddressLine1 { get; set; } = string.Empty;

    public string? AddressLine2 { get; set; }

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public string PostalCode { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public bool IsDefault { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }

    public Customer Customer { get; set; } = null!;
}
```

### 3.3 Update IVultContext Interface

**Add to:** `src/Vult.Core/IVultContext.cs`

```csharp
using Vult.Core.Model.CustomerAggregate;

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
using Vult.Core.Model.CustomerAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");

        builder.HasKey(c => c.CustomerId);

        builder.Property(c => c.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Phone)
            .HasMaxLength(50);

        // Relationships
        builder.HasMany(c => c.Addresses)
            .WithOne(a => a.Customer)
            .HasForeignKey(a => a.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(c => c.UserId);
        builder.HasIndex(c => c.IsDeleted);
        builder.HasIndex(c => c.CreatedDate);
    }
}
```

### 4.2 EF Configuration - CustomerAddress

**File:** `src/Vult.Infrastructure/Data/Configurations/CustomerAddressConfiguration.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.Model.CustomerAggregate;

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
using Vult.Core.Model.CustomerAggregate;

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

// Profile
public record CustomerProfileDto(
    Guid CustomerId,
    Guid? UserId,
    string FirstName,
    string LastName,
    string? Phone,
    DateTime? DateOfBirth,
    DateTime CreatedDate,
    DateTime UpdatedDate
);

public record UpdateProfileDto(
    string? FirstName,
    string? LastName,
    string? Phone,
    DateTime? DateOfBirth
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

### 5.2 Get Profile Query

**File:** `src/Vult.Api/Features/Customers/GetProfileQuery.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core;

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

### 5.3 Update Profile Command

**File:** `src/Vult.Api/Features/Customers/UpdateProfileCommand.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core;

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

        if (!string.IsNullOrWhiteSpace(dto.FirstName))
            customer.FirstName = dto.FirstName.Trim();

        if (!string.IsNullOrWhiteSpace(dto.LastName))
            customer.LastName = dto.LastName.Trim();

        if (dto.Phone != null)
            customer.Phone = dto.Phone.Trim();

        if (dto.DateOfBirth.HasValue)
            customer.DateOfBirth = dto.DateOfBirth.Value;

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

### 5.4 Address Commands

**File:** `src/Vult.Api/Features/Customers/AddressCommands.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core.Model.CustomerAggregate;
using Vult.Core;

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

### 5.5 Order History Query

**File:** `src/Vult.Api/Features/Customers/GetOrderHistoryQuery.cs`

```csharp
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Dtos;
using Vult.Core;

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

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            query = query.Where(o => o.Status.ToString() == request.Status);
        }

        var totalItems = await query.CountAsync(cancellationToken);

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

### 5.6 Customers Controller

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

### 5.7 Extension Methods

**File:** `src/Vult.Api/Extensions/CustomerExtensions.cs`

```csharp
using Vult.Api.Dtos;
using Vult.Core.Model.CustomerAggregate;

namespace Vult.Api.Extensions;

public static class CustomerExtensions
{
    public static CustomerProfileDto ToProfileDto(this Customer customer)
    {
        return new CustomerProfileDto(
            customer.CustomerId,
            customer.UserId,
            customer.FirstName,
            customer.LastName,
            customer.Phone,
            customer.DateOfBirth,
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

## 6. Database Migration

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

## 7. Testing Strategy

### 7.1 Unit Tests

| Test Class | Coverage |
|------------|----------|
| UpdateProfileHandlerTests | Profile updates, validation |
| AddressHandlerTests | CRUD operations, default logic, max limit |
| CustomerTests | GetDefaultAddress, CanAddAddress, SetDefaultAddress |

### 7.2 Integration Tests

| Test | Description |
|------|-------------|
| Profile_Update_Success | End-to-end profile update |
| Address_CRUD_Operations | Full address lifecycle |
| OrderHistory_ReturnsCustomerOrders | Order history integration |

---

## 8. Deployment Checklist

- [ ] Run database migrations
- [ ] Configure JWT signing key (production strength)
- [ ] Set token expiration
- [ ] Configure CORS for frontend domain
- [ ] Enable HTTPS
