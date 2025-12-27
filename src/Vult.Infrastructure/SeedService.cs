// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Vult.Core;
using Vult.Core.Model.TestimonialAggregate;
using Vult.Core.Model.UserAggregate;
using Vult.Core.Model.UserAggregate.Enums;
using Vult.Core.Services;

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
        await SeedTestimonialsAsync();

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
        var aggregates = new[] { "User", "Role", "Product", "Testimonial" };
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

    private async Task SeedTestimonialsAsync()
    {
        if (await _context.Testimonials.AnyAsync())
        {
            _logger.LogInformation("Testimonials already exist, skipping testimonial seeding.");
            return;
        }

        _logger.LogInformation("Seeding testimonials...");

        var testimonials = new List<Testimonial>
        {
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "Sarah M.",
                PhotoUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
                Rating = 5,
                Text = "Amazing quality! The vintage jacket I bought looks brand new. Fast shipping and excellent customer service.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "James K.",
                PhotoUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
                Rating = 5,
                Text = "Found exactly what I was looking for. The authentication process gave me confidence in my purchase.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "Emily R.",
                PhotoUrl = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
                Rating = 4,
                Text = "Great selection of premium items. Prices are fair and the condition descriptions are accurate.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "Michael T.",
                PhotoUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
                Rating = 5,
                Text = "Best marketplace for used premium goods. Everything I ordered exceeded my expectations.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "Lisa W.",
                PhotoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
                Rating = 5,
                Text = "Incredible finds at amazing prices. The curation is top-notch and every piece feels special.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "David P.",
                PhotoUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
                Rating = 4,
                Text = "Love the sustainability aspect. Great way to shop premium brands while being eco-conscious.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            }
        };

        foreach (var testimonial in testimonials)
        {
            _context.Testimonials.Add(testimonial);
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Testimonials seeded successfully ({Count} testimonials).", testimonials.Count);
    }

    private static byte[] GenerateSalt()
    {
        var salt = new byte[16];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);
        return salt;
    }

}
