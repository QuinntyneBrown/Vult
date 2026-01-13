// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using CustomerService.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace CustomerService.Api.Data.Seed;

public interface ICustomerSeedService
{
    Task SeedAsync(CancellationToken cancellationToken = default);
}

public class CustomerSeedService : ICustomerSeedService
{
    private readonly CustomerDbContext _context;
    private readonly ILogger<CustomerSeedService> _logger;

    public CustomerSeedService(CustomerDbContext context, ILogger<CustomerSeedService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _context.Customers.AnyAsync(cancellationToken))
        {
            _logger.LogInformation("Database already seeded, skipping...");
            return;
        }

        _logger.LogInformation("Seeding customer database...");

        var customers = new List<Customer>
        {
            new Customer
            {
                CustomerId = Guid.NewGuid(),
                FirstName = "John",
                LastName = "Doe",
                Phone = "+1-555-123-4567",
                DateOfBirth = new DateTime(1990, 5, 15),
                IsDeleted = false,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Addresses = new List<CustomerAddress>
                {
                    new CustomerAddress
                    {
                        CustomerAddressId = Guid.NewGuid(),
                        Label = "Home",
                        FullName = "John Doe",
                        AddressLine1 = "123 Main Street",
                        City = "New York",
                        Province = "NY",
                        PostalCode = "10001",
                        Country = "USA",
                        Phone = "+1-555-123-4567",
                        IsDefault = true,
                        CreatedDate = DateTime.UtcNow,
                        UpdatedDate = DateTime.UtcNow
                    }
                }
            },
            new Customer
            {
                CustomerId = Guid.NewGuid(),
                FirstName = "Jane",
                LastName = "Smith",
                Phone = "+1-555-987-6543",
                DateOfBirth = new DateTime(1985, 8, 22),
                IsDeleted = false,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Addresses = new List<CustomerAddress>
                {
                    new CustomerAddress
                    {
                        CustomerAddressId = Guid.NewGuid(),
                        Label = "Home",
                        FullName = "Jane Smith",
                        AddressLine1 = "456 Oak Avenue",
                        AddressLine2 = "Apt 2B",
                        City = "Los Angeles",
                        Province = "CA",
                        PostalCode = "90001",
                        Country = "USA",
                        Phone = "+1-555-987-6543",
                        IsDefault = true,
                        CreatedDate = DateTime.UtcNow,
                        UpdatedDate = DateTime.UtcNow
                    },
                    new CustomerAddress
                    {
                        CustomerAddressId = Guid.NewGuid(),
                        Label = "Work",
                        FullName = "Jane Smith",
                        AddressLine1 = "789 Business Park",
                        City = "Los Angeles",
                        Province = "CA",
                        PostalCode = "90002",
                        Country = "USA",
                        IsDefault = false,
                        CreatedDate = DateTime.UtcNow,
                        UpdatedDate = DateTime.UtcNow
                    }
                }
            }
        };

        await _context.Customers.AddRangeAsync(customers, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} customers", customers.Count);
    }
}
