// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using IdentityService.Api.Model;
using IdentityService.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Api.Data.Seed;

public interface IIdentitySeedService
{
    Task SeedAsync(CancellationToken cancellationToken = default);
}

public class IdentitySeedService : IIdentitySeedService
{
    private readonly IdentityDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<IdentitySeedService> _logger;

    public IdentitySeedService(
        IdentityDbContext context,
        IPasswordHasher passwordHasher,
        ILogger<IdentitySeedService> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _context.Users.AnyAsync(cancellationToken))
        {
            _logger.LogInformation("Database already seeded, skipping...");
            return;
        }

        _logger.LogInformation("Seeding identity database...");

        // Create roles
        var adminRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            Privileges = new List<Privilege>
            {
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Product", AccessRight = AccessRight.Create },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Product", AccessRight = AccessRight.Read },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Product", AccessRight = AccessRight.Write },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Product", AccessRight = AccessRight.Delete },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "User", AccessRight = AccessRight.Create },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "User", AccessRight = AccessRight.Read },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "User", AccessRight = AccessRight.Write },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "User", AccessRight = AccessRight.Delete },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Order", AccessRight = AccessRight.Create },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Order", AccessRight = AccessRight.Read },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Order", AccessRight = AccessRight.Write },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Order", AccessRight = AccessRight.Delete }
            }
        };

        var userRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "User",
            Privileges = new List<Privilege>
            {
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Product", AccessRight = AccessRight.Read },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Order", AccessRight = AccessRight.Create },
                new Privilege { PrivilegeId = Guid.NewGuid(), Aggregate = "Order", AccessRight = AccessRight.Read }
            }
        };

        await _context.Roles.AddRangeAsync(new[] { adminRole, userRole }, cancellationToken);

        // Create admin user
        var adminSalt = _passwordHasher.GenerateSalt();
        var adminUser = new User
        {
            UserId = Guid.NewGuid(),
            Username = "admin",
            Email = "admin@vult.com",
            IsEmailVerified = true,
            Salt = adminSalt,
            Password = _passwordHasher.HashPassword("Admin123!", adminSalt),
            IsDeleted = false,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            Roles = new List<Role> { adminRole }
        };

        // Create regular user
        var userSalt = _passwordHasher.GenerateSalt();
        var regularUser = new User
        {
            UserId = Guid.NewGuid(),
            Username = "user",
            Email = "user@vult.com",
            IsEmailVerified = true,
            Salt = userSalt,
            Password = _passwordHasher.HashPassword("User123!", userSalt),
            IsDeleted = false,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            Roles = new List<Role> { userRole }
        };

        await _context.Users.AddRangeAsync(new[] { adminUser, regularUser }, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded 2 users with roles and privileges");
    }
}
