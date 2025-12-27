// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Vult.Core;
using Vult.Core.Model.DigitalAssetAggregate;
using Vult.Core.Model.ProductAggregate;
using Vult.Core.Model.ProductAggregate.Enums;
using Vult.Core.Model.TestimonialAggregate;
using Vult.Core.Model.UserAggregate;
using Vult.Core.Model.UserAggregate.Enums;
using Vult.Core.Services;

namespace Vult.Infrastructure;

public class SeedService : ISeedService
{
    private const string ApiBaseUrl = "https://localhost:7266";

    private readonly IVultContext _context;
    private readonly ILogger<SeedService> _logger;
    private readonly IPasswordHasher _passwordHasher;

    // Static GUIDs for seeded digital assets to ensure consistent URLs
    private static readonly Guid FoampositeDigitalAssetId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890");

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
        await SeedDigitalAssetsAsync();
        await SeedFeaturedProductsAsync();

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

    private async Task SeedDigitalAssetsAsync()
    {
        var digitalAssets = _context.DigitalAssets.Count();

        if (await _context.DigitalAssets.AnyAsync(d => d.DigitalAssetId == FoampositeDigitalAssetId))
        {
            _logger.LogInformation("Digital assets already exist, skipping digital asset seeding.");
            return;
        }

        _logger.LogInformation("Seeding digital assets...");

        // Create a placeholder SVG image for the Nike Foamposite shoe
        var foampositeSvg = @"<svg xmlns=""http://www.w3.org/2000/svg"" viewBox=""0 0 400 300"" width=""400"" height=""300"">
  <defs>
    <linearGradient id=""shoeGradient"" x1=""0%"" y1=""0%"" x2=""100%"" y2=""100%"">
      <stop offset=""0%"" style=""stop-color:#1a1a2e;stop-opacity:1"" />
      <stop offset=""100%"" style=""stop-color:#16213e;stop-opacity:1"" />
    </linearGradient>
    <linearGradient id=""soleGradient"" x1=""0%"" y1=""0%"" x2=""0%"" y2=""100%"">
      <stop offset=""0%"" style=""stop-color:#0f3460;stop-opacity:1"" />
      <stop offset=""100%"" style=""stop-color:#1a1a2e;stop-opacity:1"" />
    </linearGradient>
  </defs>
  <rect width=""400"" height=""300"" fill=""#f5f5f5""/>
  <!-- Shoe upper -->
  <ellipse cx=""200"" cy=""140"" rx=""140"" ry=""70"" fill=""url(#shoeGradient)""/>
  <!-- Toe box -->
  <ellipse cx=""100"" cy=""150"" rx=""60"" ry=""50"" fill=""url(#shoeGradient)""/>
  <!-- Sole -->
  <path d=""M60 180 Q200 220 340 180 L340 200 Q200 240 60 200 Z"" fill=""url(#soleGradient)""/>
  <!-- Air unit -->
  <ellipse cx=""280"" cy=""190"" rx=""40"" ry=""15"" fill=""#e94560"" opacity=""0.8""/>
  <!-- Foamposite texture lines -->
  <path d=""M80 130 Q150 100 220 130"" stroke=""#0f3460"" stroke-width=""2"" fill=""none"" opacity=""0.5""/>
  <path d=""M90 145 Q160 115 230 145"" stroke=""#0f3460"" stroke-width=""2"" fill=""none"" opacity=""0.5""/>
  <path d=""M100 160 Q170 130 240 160"" stroke=""#0f3460"" stroke-width=""2"" fill=""none"" opacity=""0.5""/>
  <!-- Brand text -->
  <text x=""200"" y=""270"" font-family=""Arial, sans-serif"" font-size=""16"" font-weight=""bold"" fill=""#333"" text-anchor=""middle"">Nike Air Foamposite</text>
</svg>";

        var foampositeAsset = new DigitalAsset
        {
            DigitalAssetId = FoampositeDigitalAssetId,
            Name = "nike-foamposite.svg",
            Bytes = System.Text.Encoding.UTF8.GetBytes(foampositeSvg),
            ContentType = "image/svg+xml",
            Height = 300,
            Width = 400,
            CreatedDate = DateTime.UtcNow
        };

        _context.DigitalAssets.Add(foampositeAsset);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Digital assets seeded successfully.");
    }

    private async Task SeedFeaturedProductsAsync()
    {
        if (await _context.Products.AnyAsync(p => p.IsFeatured))
        {
            _logger.LogInformation("Featured products already exist, skipping featured product seeding.");
            return;
        }

        _logger.LogInformation("Seeding featured products...");

        var featuredProducts = new List<Product>
        {
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "New Era Blue Jays Cap",
                BrandName = "New Era",
                Size = "One Size",
                Gender = Gender.Unisex,
                ItemType = ItemType.Hat,
                EstimatedMSRP = 55.00m,
                EstimatedResaleValue = 45.00m,
                IsFeatured = true,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Vintage Leather Jacket",
                BrandName = "Vult",
                Size = "M",
                Gender = Gender.Unisex,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 250.00m,
                EstimatedResaleValue = 189.00m,
                IsFeatured = true,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Denim Jeans",
                BrandName = "Levi's",
                Size = "32",
                Gender = Gender.Mens,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 85.00m,
                EstimatedResaleValue = 75.00m,
                IsFeatured = true,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Retro Sneakers",
                BrandName = "Vult",
                Size = "10",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 150.00m,
                EstimatedResaleValue = 120.00m,
                IsFeatured = true,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Designer Sunglasses",
                BrandName = "Ray-Ban",
                Size = "Standard",
                Gender = Gender.Unisex,
                ItemType = ItemType.Accessories,
                EstimatedMSRP = 120.00m,
                EstimatedResaleValue = 95.00m,
                IsFeatured = true,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Vintage Watch",
                BrandName = "Seiko",
                Size = "40mm",
                Gender = Gender.Mens,
                ItemType = ItemType.Accessories,
                EstimatedMSRP = 350.00m,
                EstimatedResaleValue = 299.00m,
                IsFeatured = true,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Canvas Backpack",
                BrandName = "Herschel",
                Size = "25L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Bag,
                EstimatedMSRP = 100.00m,
                EstimatedResaleValue = 85.00m,
                IsFeatured = true,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Wool Sweater",
                BrandName = "Vult",
                Size = "L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Sweater,
                EstimatedMSRP = 130.00m,
                EstimatedResaleValue = 110.00m,
                IsFeatured = true,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            }
        };

        // Generate the URL for the Foamposite digital asset
        var foampositeImageUrl = $"{ApiBaseUrl}/api/digitalassets/{FoampositeDigitalAssetId}/serve";

        foreach (var product in featuredProducts)
        {
            // Add a ProductImage for each featured product with the Foamposite digital asset URL
            product.ProductImages.Add(new ProductImage
            {
                ProductImageId = Guid.NewGuid(),
                ProductId = product.ProductId,
                Url = foampositeImageUrl,
                Description = $"Image for {product.Description}",
                CreatedDate = DateTime.UtcNow
            });

            _context.Products.Add(product);
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Featured products seeded successfully ({Count} products with images).", featuredProducts.Count);
    }

    private static byte[] GenerateSalt()
    {
        var salt = new byte[16];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);
        return salt;
    }

}
