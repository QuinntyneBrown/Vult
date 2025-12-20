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

    public SeedService(
        IVultContext context,
        ILogger<SeedService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        _logger.LogInformation("Starting database seeding...");

        await SeedRolesAsync();
        await SeedUsersAsync();

        _logger.LogInformation("Database seeding completed successfully.");
    }

    private async Task SeedRolesAsync()
    {
        if (await _context.Roles.AnyAsync())
        {
            _logger.LogInformation("Roles already exist, skipping role seeding.");
            return;
        }

        _logger.LogInformation("Seeding roles...");

        var adminRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Administrator",
            Description = "System administrator with full access",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var userRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "User",
            Description = "Standard user with basic access",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _context.Roles.Add(adminRole);
        _context.Roles.Add(userRole);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Roles seeded successfully.");
    }

    private async Task SeedUsersAsync()
    {
        if (await _context.Users.AnyAsync())
        {
            _logger.LogInformation("Users already exist, skipping user seeding.");
            return;
        }

        _logger.LogInformation("Seeding default admin user...");

        var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Administrator");

        if (adminRole == null)
        {
            _logger.LogWarning("Administrator role not found, cannot create admin user.");
            return;
        }

        var passwordHash = HashPassword("admin");

        var adminUser = new User
        {
            UserId = Guid.NewGuid(),
            Username = "admin",
            Email = "admin@gmail.com",
            PasswordHash = passwordHash,
            FirstName = "System",
            LastName = "Administrator",
            Status = UserStatus.Active,
            ActivatedAt = DateTime.UtcNow,
            ActivationMethod = ActivationMethod.AdminManual,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            Roles = new List<Role> { adminRole }
        };

        _context.Users.Add(adminUser);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin user seeded successfully.");
    }

    private string HashPassword(string password)
    {
        // Use PBKDF2 with SHA256 (same as AuthenticationService)
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[16];
        rng.GetBytes(salt);

        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 10000, HashAlgorithmName.SHA256, 32);

        var hashBytes = new byte[48];
        Array.Copy(salt, 0, hashBytes, 0, 16);
        Array.Copy(hash, 0, hashBytes, 16, 32);

        return Convert.ToBase64String(hashBytes);
    }
}
