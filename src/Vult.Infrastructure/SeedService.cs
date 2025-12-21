// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Vult.Core;

namespace Vult.Infrastructure;

public class SeedService : ISeedService
{
    private readonly IVultContext _context;
    private readonly ILogger<SeedService> _logger;
    private readonly IPasswordHasher _passwordHasher;

    public SeedService(
        IVultContext context,
        ILogger<SeedService> logger,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _logger = logger;
        _passwordHasher = passwordHasher;
    }

    public async Task SeedAsync()
    {
        _logger.LogInformation("Starting database seeding...");

        await SeedRolesAndPrivilegesAsync();
        await SeedUsersAsync();

        _logger.LogInformation("Database seeding completed successfully.");
    }

    private async Task SeedRolesAndPrivilegesAsync()
    {
        if (await _context.Roles.AnyAsync())
        {
            _logger.LogInformation("Roles already exist, skipping role seeding.");
            return;
        }

        _logger.LogInformation("Seeding roles and privileges...");

        var systemAdministratorRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "SystemAdministrator"
        };

        // Add all privileges for SystemAdministrator
        var aggregates = new[] { "User", "Role", "CatalogItem", "InvitationToken" };
        var accessRights = new[] { AccessRight.Create, AccessRight.Read, AccessRight.Write, AccessRight.Delete };

        foreach (var aggregate in aggregates)
        {
            foreach (var accessRight in accessRights)
            {
                systemAdministratorRole.Privileges.Add(new Privilege
                {
                    PrivilegeId = Guid.NewGuid(),
                    Aggregate = aggregate,
                    AccessRight = accessRight
                });
            }
        }

        _context.Roles.Add(systemAdministratorRole);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Roles and privileges seeded successfully.");
    }

    private async Task SeedUsersAsync()
    {
        if (await _context.Users.AnyAsync())
        {
            _logger.LogInformation("Users already exist, skipping user seeding.");
            return;
        }

        _logger.LogInformation("Seeding default admin user...");

        var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "SystemAdministrator");

        if (adminRole == null)
        {
            _logger.LogWarning("SystemAdministrator role not found, cannot create admin user.");
            return;
        }

        var salt = GenerateSalt();

        var passwordHash = _passwordHasher.HashPassword("admin", salt);

        var adminUser = new User
        {
            UserId = Guid.NewGuid(),
            Username = "admin",
            Password = passwordHash,
            Salt = salt,
            Roles = new List<Role> { adminRole }
        };

        _context.Users.Add(adminUser);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin user seeded successfully (username: admin, password: admin).");
    }

    private static byte[] GenerateSalt()
    {
        var salt = new byte[16];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);
        return salt;
    }

}
