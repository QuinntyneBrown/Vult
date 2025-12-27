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
    private readonly IVultContext _context;
    private readonly ILogger<SeedService> _logger;
    private readonly IPasswordHasher _passwordHasher;
    private readonly Random _random = new();

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
        await SeedProductsAsync();

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

    private async Task SeedProductsAsync()
    {
        if (await _context.Products.AnyAsync())
        {
            _logger.LogInformation("Products already exist, skipping product seeding.");
            return;
        }

        _logger.LogInformation("Seeding products...");

        var products = GetProductData();

        // Determine number of featured products (5-15% of 40 = 2-6 products)
        var featuredCount = _random.Next(2, 7);
        var featuredIndices = new HashSet<int>();
        while (featuredIndices.Count < featuredCount)
        {
            featuredIndices.Add(_random.Next(0, products.Count));
        }

        _logger.LogInformation("Will mark {FeaturedCount} products as featured ({Percentage:F1}%).",
            featuredCount, (featuredCount / (double)products.Count) * 100);

        for (int i = 0; i < products.Count; i++)
        {
            var product = products[i];
            product.IsFeatured = featuredIndices.Contains(i);

            // Add 6 ProductImage entities for each product
            var imageUrls = GetImageUrlsForProduct(product, i);
            for (int j = 0; j < 6; j++)
            {
                var productImage = new ProductImage
                {
                    ProductImageId = Guid.NewGuid(),
                    ProductId = product.ProductId,
                    Url = imageUrls[j],
                    Description = $"{product.Description} - Image {j + 1}",
                    CreatedDate = DateTime.UtcNow
                };

                product.ProductImages.Add(productImage);
            }

            _context.Products.Add(product);

            _logger.LogInformation("Seeded product {Index}/{Total}: {Description} with {ImageCount} images{Featured}",
                i + 1, products.Count, product.Description, product.ProductImages.Count,
                product.IsFeatured ? " (Featured)" : "");
        }

        await _context.SaveChangesAsync();

        var totalFeatured = products.Count(p => p.IsFeatured);
        _logger.LogInformation("Products seeded successfully ({Count} products, {FeaturedCount} featured, {Percentage:F1}%).",
            products.Count, totalFeatured, (totalFeatured / (double)products.Count) * 100);
    }

    private List<string> GetImageUrlsForProduct(Product product, int productIndex)
    {
        // Use Unsplash source API to get relevant images based on product type
        var searchTerms = GetSearchTermsForProduct(product);
        var urls = new List<string>();

        for (int i = 0; i < 6; i++)
        {
            // Use different random seeds to get different images
            var seed = (productIndex * 100) + i;
            var searchTerm = searchTerms[i % searchTerms.Count];

            var url = $"https://images.unsplash.com/photo-1655111438936-54d0e77b9293";

            urls.Add(url);
        }

        return urls;
    }

    private List<string> GetSearchTermsForProduct(Product product)
    {
        return product.ItemType switch
        {
            ItemType.Shoe => new List<string> { "sneakers", "shoes", "footwear", "running shoes", "athletic shoes", "fashion shoes" },
            ItemType.Pants => new List<string> { "jeans", "pants", "denim", "trousers", "fashion pants", "clothing" },
            ItemType.Jacket => new List<string> { "jacket", "leather jacket", "coat", "outerwear", "fashion jacket", "blazer" },
            ItemType.Shirt => new List<string> { "shirt", "t-shirt", "polo", "button shirt", "casual shirt", "fashion shirt" },
            ItemType.Shorts => new List<string> { "shorts", "casual shorts", "athletic shorts", "summer shorts", "fashion shorts", "sportswear" },
            ItemType.Dress => new List<string> { "dress", "fashion dress", "evening dress", "casual dress", "summer dress", "elegant dress" },
            ItemType.Skirt => new List<string> { "skirt", "fashion skirt", "mini skirt", "maxi skirt", "casual skirt", "elegant skirt" },
            ItemType.Sweater => new List<string> { "sweater", "knitwear", "pullover", "wool sweater", "fashion sweater", "casual sweater" },
            ItemType.Hoodie => new List<string> { "hoodie", "sweatshirt", "casual hoodie", "streetwear", "fashion hoodie", "athletic hoodie" },
            ItemType.Coat => new List<string> { "coat", "winter coat", "overcoat", "trench coat", "fashion coat", "outerwear" },
            ItemType.Bag => new List<string> { "bag", "backpack", "handbag", "tote bag", "fashion bag", "leather bag" },
            ItemType.Accessories => new List<string> { "accessories", "watch", "sunglasses", "jewelry", "fashion accessories", "luxury accessories" },
            ItemType.Hat => new List<string> { "hat", "cap", "baseball cap", "beanie", "fashion hat", "headwear" },
            ItemType.Book => new List<string> { "book", "vintage book", "novel", "literature", "classic book", "reading" },
            _ => new List<string> { "fashion", "clothing", "style", "apparel", "wardrobe", "outfit" }
        };
    }

    private List<Product> GetProductData()
    {
        var now = DateTime.UtcNow;

        return new List<Product>
        {
            // Shoes (8 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Air Max 90 Classic",
                BrandName = "Nike",
                Size = "10",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 140.00m,
                EstimatedResaleValue = 120.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Leather Sneakers",
                BrandName = "Adidas",
                Size = "9",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 100.00m,
                EstimatedResaleValue = 85.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Old Skool Skateboard Shoes",
                BrandName = "Vans",
                Size = "11",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 70.00m,
                EstimatedResaleValue = 55.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Chuck Taylor All Star",
                BrandName = "Converse",
                Size = "8",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 60.00m,
                EstimatedResaleValue = 45.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "574 Core Classics",
                BrandName = "New Balance",
                Size = "10.5",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 90.00m,
                EstimatedResaleValue = 75.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Suede Classic XXI",
                BrandName = "Puma",
                Size = "9.5",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 75.00m,
                EstimatedResaleValue = 60.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Clog",
                BrandName = "Crocs",
                Size = "M8/W10",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 50.00m,
                EstimatedResaleValue = 35.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Air Force 1 Low",
                BrandName = "Nike",
                Size = "12",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 110.00m,
                EstimatedResaleValue = 95.00m,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Pants (5 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "501 Original Fit Jeans",
                BrandName = "Levi's",
                Size = "32x32",
                Gender = Gender.Mens,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 70.00m,
                EstimatedResaleValue = 55.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "High Rise Skinny Jeans",
                BrandName = "Levi's",
                Size = "28",
                Gender = Gender.Womens,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 98.00m,
                EstimatedResaleValue = 75.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Chino Pants Classic",
                BrandName = "Dockers",
                Size = "34",
                Gender = Gender.Mens,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 60.00m,
                EstimatedResaleValue = 45.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Cargo Pants Vintage",
                BrandName = "Carhartt",
                Size = "L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 85.00m,
                EstimatedResaleValue = 70.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Stretch Joggers",
                BrandName = "Lululemon",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 128.00m,
                EstimatedResaleValue = 95.00m,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Jackets (5 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Trucker Jacket",
                BrandName = "Levi's",
                Size = "L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 98.00m,
                EstimatedResaleValue = 75.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Leather Moto Jacket",
                BrandName = "AllSaints",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 520.00m,
                EstimatedResaleValue = 350.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Puffer Jacket Retro",
                BrandName = "The North Face",
                Size = "XL",
                Gender = Gender.Unisex,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 250.00m,
                EstimatedResaleValue = 180.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Bomber Jacket Classic",
                BrandName = "Alpha Industries",
                Size = "M",
                Gender = Gender.Unisex,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 175.00m,
                EstimatedResaleValue = 130.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Denim Jacket Vintage",
                BrandName = "Wrangler",
                Size = "S",
                Gender = Gender.Womens,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 80.00m,
                EstimatedResaleValue = 60.00m,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Shirts (5 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Oxford Button-Down Shirt",
                BrandName = "Ralph Lauren",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 110.00m,
                EstimatedResaleValue = 85.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Flannel Plaid Shirt",
                BrandName = "Pendleton",
                Size = "L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 150.00m,
                EstimatedResaleValue = 110.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Vintage Band T-Shirt",
                BrandName = "Vintage",
                Size = "M",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 45.00m,
                EstimatedResaleValue = 65.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Polo Shirt Classic",
                BrandName = "Lacoste",
                Size = "S",
                Gender = Gender.Mens,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 95.00m,
                EstimatedResaleValue = 70.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Silk Blouse Elegant",
                BrandName = "Equipment",
                Size = "S",
                Gender = Gender.Womens,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 280.00m,
                EstimatedResaleValue = 150.00m,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Sweaters (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Cable Knit Sweater",
                BrandName = "J.Crew",
                Size = "M",
                Gender = Gender.Unisex,
                ItemType = ItemType.Sweater,
                EstimatedMSRP = 98.00m,
                EstimatedResaleValue = 70.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Cashmere V-Neck Sweater",
                BrandName = "Everlane",
                Size = "S",
                Gender = Gender.Womens,
                ItemType = ItemType.Sweater,
                EstimatedMSRP = 145.00m,
                EstimatedResaleValue = 100.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Wool Cardigan Vintage",
                BrandName = "Pendleton",
                Size = "L",
                Gender = Gender.Mens,
                ItemType = ItemType.Sweater,
                EstimatedMSRP = 175.00m,
                EstimatedResaleValue = 120.00m,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Hoodies (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Pullover Hoodie",
                BrandName = "Champion",
                Size = "L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Hoodie,
                EstimatedMSRP = 60.00m,
                EstimatedResaleValue = 45.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Tech Fleece Hoodie",
                BrandName = "Nike",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Hoodie,
                EstimatedMSRP = 120.00m,
                EstimatedResaleValue = 90.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Box Logo Hoodie",
                BrandName = "Supreme",
                Size = "M",
                Gender = Gender.Unisex,
                ItemType = ItemType.Hoodie,
                EstimatedMSRP = 168.00m,
                EstimatedResaleValue = 450.00m,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Bags (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Little America Backpack",
                BrandName = "Herschel",
                Size = "25L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Bag,
                EstimatedMSRP = 100.00m,
                EstimatedResaleValue = 75.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Tote Bag",
                BrandName = "Longchamp",
                Size = "Large",
                Gender = Gender.Womens,
                ItemType = ItemType.Bag,
                EstimatedMSRP = 145.00m,
                EstimatedResaleValue = 100.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Messenger Bag Leather",
                BrandName = "Fossil",
                Size = "Medium",
                Gender = Gender.Mens,
                ItemType = ItemType.Bag,
                EstimatedMSRP = 198.00m,
                EstimatedResaleValue = 130.00m,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Hats (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Yankees Baseball Cap",
                BrandName = "New Era",
                Size = "7 3/8",
                Gender = Gender.Unisex,
                ItemType = ItemType.Hat,
                EstimatedMSRP = 40.00m,
                EstimatedResaleValue = 30.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Wool Beanie Classic",
                BrandName = "Carhartt",
                Size = "One Size",
                Gender = Gender.Unisex,
                ItemType = ItemType.Hat,
                EstimatedMSRP = 25.00m,
                EstimatedResaleValue = 18.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Fedora Hat Vintage",
                BrandName = "Stetson",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Hat,
                EstimatedMSRP = 150.00m,
                EstimatedResaleValue = 110.00m,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Accessories (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Aviator Sunglasses",
                BrandName = "Ray-Ban",
                Size = "Standard",
                Gender = Gender.Unisex,
                ItemType = ItemType.Accessories,
                EstimatedMSRP = 161.00m,
                EstimatedResaleValue = 120.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Automatic Watch SKX007",
                BrandName = "Seiko",
                Size = "42mm",
                Gender = Gender.Mens,
                ItemType = ItemType.Accessories,
                EstimatedMSRP = 299.00m,
                EstimatedResaleValue = 350.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Leather Belt Classic",
                BrandName = "Coach",
                Size = "32",
                Gender = Gender.Mens,
                ItemType = ItemType.Accessories,
                EstimatedMSRP = 98.00m,
                EstimatedResaleValue = 65.00m,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Dresses (2 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Wrap Dress Elegant",
                BrandName = "Diane von Furstenberg",
                Size = "S",
                Gender = Gender.Womens,
                ItemType = ItemType.Dress,
                EstimatedMSRP = 398.00m,
                EstimatedResaleValue = 200.00m,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Maxi Dress Summer",
                BrandName = "Free People",
                Size = "M",
                Gender = Gender.Womens,
                ItemType = ItemType.Dress,
                EstimatedMSRP = 128.00m,
                EstimatedResaleValue = 80.00m,
                CreatedDate = now,
                UpdatedDate = now
            }
        };
    }

    private static byte[] GenerateSalt()
    {
        var salt = new byte[16];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);
        return salt;
    }
}
