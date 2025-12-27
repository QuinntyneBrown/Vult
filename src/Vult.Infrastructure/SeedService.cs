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
                ShortDescription = "Iconic sneaker with visible Air cushioning",
                BrandName = "Nike",
                Size = "10",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 140.00m,
                EstimatedResaleValue = 120.00m,
                Benefits = "Visible Air cushioning for impact protection. Padded collar for comfort. Rubber outsole for traction.",
                Details = "Leather and synthetic upper. Max Air unit in heel. Rubber Waffle outsole. Style: CN8490-001",
                Shipping = "Free standard shipping. Express shipping available for $12.99. Usually ships within 1-2 business days.",
                PromotionalMessage = "Limited edition colorway - only 500 pairs available!",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Leather Sneakers",
                ShortDescription = "Timeless leather sneakers for everyday wear",
                BrandName = "Adidas",
                Size = "9",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 100.00m,
                EstimatedResaleValue = 85.00m,
                Benefits = "Soft leather upper for premium feel. Cushioned midsole for all-day comfort. Durable rubber outsole.",
                Details = "Full grain leather upper. EVA midsole. Rubber cupsole. Product code: FV1086",
                Shipping = "Free shipping on orders over $50. Standard delivery 3-5 business days.",
                PromotionalMessage = "",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Old Skool Skateboard Shoes",
                ShortDescription = "Classic skate shoe with iconic side stripe",
                BrandName = "Vans",
                Size = "11",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 70.00m,
                EstimatedResaleValue = 55.00m,
                Benefits = "Iconic side stripe design. Padded collars for support. Flexible vulcanized outsole for board feel.",
                Details = "Canvas and suede upper. UltraCush sockliners. Signature rubber waffle outsole. Style: VN000D3HY28",
                Shipping = "Free standard shipping. Express available. Ships within 2 business days.",
                PromotionalMessage = "Classic style that never goes out of fashion",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Chuck Taylor All Star",
                ShortDescription = "The original canvas high-top sneaker",
                BrandName = "Converse",
                Size = "8",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 60.00m,
                EstimatedResaleValue = 45.00m,
                Benefits = "Timeless high-top design. OrthoLite insole for cushioning. Medial eyelets for ventilation.",
                Details = "Canvas upper. Rubber toe cap. Vulcanized rubber outsole. Style: M9160",
                Shipping = "Free shipping. Delivery within 3-5 business days.",
                PromotionalMessage = "",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "574 Core Classics",
                ShortDescription = "Retro running shoe with modern comfort",
                BrandName = "New Balance",
                Size = "10.5",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 90.00m,
                EstimatedResaleValue = 75.00m,
                Benefits = "ENCAP midsole technology for support. Suede and mesh upper for breathability. Classic dad shoe aesthetic.",
                Details = "Suede/mesh upper. ENCAP midsole. Rubber outsole. Style: ML574EVG",
                Shipping = "Free standard shipping on all orders. Express shipping $9.99.",
                PromotionalMessage = "A true classic since 1988",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Suede Classic XXI",
                ShortDescription = "Heritage suede sneaker with formstrip design",
                BrandName = "Puma",
                Size = "9.5",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 75.00m,
                EstimatedResaleValue = 60.00m,
                Benefits = "Premium suede upper. Cushioned midsole for comfort. Iconic formstrip design.",
                Details = "Suede upper. Rubber outsole. Lace closure. Style: 374915-01",
                Shipping = "Free shipping. Ships within 1-3 business days.",
                PromotionalMessage = "",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Clog",
                ShortDescription = "Lightweight foam clog for casual comfort",
                BrandName = "Crocs",
                Size = "M8/W10",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 50.00m,
                EstimatedResaleValue = 35.00m,
                Benefits = "Lightweight Croslite foam. Ventilation ports for breathability. Pivoting heel straps for secure fit.",
                Details = "Croslite foam construction. Jibbitz holes for customization. Water-friendly. Style: 10001",
                Shipping = "Free shipping on orders over $35. Standard delivery 3-5 days.",
                PromotionalMessage = "Customize with Jibbitz charms!",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Air Force 1 Low",
                ShortDescription = "Legendary basketball shoe turned streetwear icon",
                BrandName = "Nike",
                Size = "12",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe,
                EstimatedMSRP = 110.00m,
                EstimatedResaleValue = 95.00m,
                Benefits = "Air cushioning for lightweight comfort. Perforations on toe for breathability. Durable cupsole construction.",
                Details = "Leather upper. Encapsulated Air unit. Solid rubber outsole. Style: CW2288-111",
                Shipping = "Free standard shipping. Next-day delivery available for $14.99.",
                PromotionalMessage = "The legend since 1982",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Pants (5 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "501 Original Fit Jeans",
                ShortDescription = "The original straight-fit button-fly jean",
                BrandName = "Levi's",
                Size = "32x32",
                Gender = Gender.Mens,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 70.00m,
                EstimatedResaleValue = 55.00m,
                Benefits = "Original straight fit. Button fly for authentic look. Sits at waist for classic silhouette.",
                Details = "100% cotton denim. Button fly. 5-pocket styling. Style: 00501-0114",
                Shipping = "Free standard shipping. Returns accepted within 30 days.",
                PromotionalMessage = "The original jean since 1873",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "High Rise Skinny Jeans",
                ShortDescription = "Flattering high-rise with stretch comfort",
                BrandName = "Levi's",
                Size = "28",
                Gender = Gender.Womens,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 98.00m,
                EstimatedResaleValue = 75.00m,
                Benefits = "High rise sits above the waist. Skinny fit from hip to ankle. Stretch for comfort and mobility.",
                Details = "79% cotton, 19% polyester, 2% elastane. Zip fly. 5-pocket styling. Style: 227910001",
                Shipping = "Free shipping. Express delivery available.",
                PromotionalMessage = "",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Chino Pants Classic",
                ShortDescription = "Versatile wrinkle-resistant chinos",
                BrandName = "Dockers",
                Size = "34",
                Gender = Gender.Mens,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 60.00m,
                EstimatedResaleValue = 45.00m,
                Benefits = "Wrinkle-resistant fabric. Easy iron finish. Classic straight fit for versatile styling.",
                Details = "98% cotton, 2% elastane. Button closure. Machine washable. Style: 44715-0002",
                Shipping = "Free standard shipping on orders over $50.",
                PromotionalMessage = "Perfect for work or weekend",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Cargo Pants Vintage",
                ShortDescription = "Durable workwear cargo with multiple pockets",
                BrandName = "Carhartt",
                Size = "L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 85.00m,
                EstimatedResaleValue = 70.00m,
                Benefits = "Durable ripstop fabric. Multiple cargo pockets. Relaxed fit for comfort.",
                Details = "Cotton ripstop fabric. Multiple pockets. Reinforced knees. Style: 102802",
                Shipping = "Free shipping. Ships within 2-3 business days.",
                PromotionalMessage = "Built to last workwear",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Stretch Joggers",
                ShortDescription = "Premium technical joggers with 4-way stretch",
                BrandName = "Lululemon",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Pants,
                EstimatedMSRP = 128.00m,
                EstimatedResaleValue = 95.00m,
                Benefits = "4-way stretch fabric. Anti-stink technology. Zipper pockets for secure storage.",
                Details = "86% nylon, 14% elastane. Elastic waistband with drawcord. Style: LM5956S",
                Shipping = "Free shipping and free returns.",
                PromotionalMessage = "From studio to street",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Jackets (5 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Trucker Jacket",
                ShortDescription = "Iconic denim trucker with button front",
                BrandName = "Levi's",
                Size = "L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 98.00m,
                EstimatedResaleValue = 75.00m,
                Benefits = "Iconic trucker silhouette. Chest pockets for storage. Button front closure.",
                Details = "100% cotton denim. Non-stretch. Button cuffs. Style: 72334-0136",
                Shipping = "Free shipping on all orders. Standard delivery 3-5 days.",
                PromotionalMessage = "The original trucker since 1967",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Leather Moto Jacket",
                ShortDescription = "Premium lamb leather motorcycle jacket",
                BrandName = "AllSaints",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 520.00m,
                EstimatedResaleValue = 350.00m,
                Benefits = "Premium lamb leather. Asymmetric zip closure. Quilted shoulder panels.",
                Details = "100% lamb leather. Polyester lining. Multiple zip pockets. Style: ML001V",
                Shipping = "Free express shipping. Signature required on delivery.",
                PromotionalMessage = "Handcrafted luxury leather",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Puffer Jacket Retro",
                ShortDescription = "700-fill down insulated puffer",
                BrandName = "The North Face",
                Size = "XL",
                Gender = Gender.Unisex,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 250.00m,
                EstimatedResaleValue = 180.00m,
                Benefits = "700-fill goose down insulation. Water-resistant shell. Packable design.",
                Details = "Nylon shell. 700-fill goose down. Zip closure. Style: NF0A4QYX",
                Shipping = "Free shipping. Express available for $9.99.",
                PromotionalMessage = "Stay warm in any condition",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Bomber Jacket Classic",
                ShortDescription = "Military-spec reversible flight bomber",
                BrandName = "Alpha Industries",
                Size = "M",
                Gender = Gender.Unisex,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 175.00m,
                EstimatedResaleValue = 130.00m,
                Benefits = "Military-spec construction. Reversible design. Water-resistant shell.",
                Details = "Nylon flight satin shell. Polyester fill. Knit collar and cuffs. Style: MJM21000C1",
                Shipping = "Free standard shipping. Ships within 1-2 business days.",
                PromotionalMessage = "Authentic military heritage since 1959",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Denim Jacket Vintage",
                ShortDescription = "Western-inspired vintage wash denim",
                BrandName = "Wrangler",
                Size = "S",
                Gender = Gender.Womens,
                ItemType = ItemType.Jacket,
                EstimatedMSRP = 80.00m,
                EstimatedResaleValue = 60.00m,
                Benefits = "Authentic vintage wash. Western-inspired yoke. Snap button closure.",
                Details = "100% cotton denim. Vintage wash. Snap front closure. Style: 124MJ-PD",
                Shipping = "Free shipping on orders over $50.",
                PromotionalMessage = "",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Shirts (5 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Oxford Button-Down Shirt",
                ShortDescription = "Classic cotton oxford with signature pony",
                BrandName = "Ralph Lauren",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 110.00m,
                EstimatedResaleValue = 85.00m,
                Benefits = "Premium Oxford cotton. Button-down collar. Signature embroidered pony.",
                Details = "100% cotton Oxford. Regular fit. Machine washable. Style: 710867327001",
                Shipping = "Free shipping. Gift wrapping available.",
                PromotionalMessage = "Classic American style",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Flannel Plaid Shirt",
                ShortDescription = "Pure virgin wool plaid made in USA",
                BrandName = "Pendleton",
                Size = "L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 150.00m,
                EstimatedResaleValue = 110.00m,
                Benefits = "Pure virgin wool. Made in USA. Timeless plaid pattern.",
                Details = "100% virgin wool. Button front. Two chest pockets. Style: AA032-32215",
                Shipping = "Free standard shipping. Express $12.99.",
                PromotionalMessage = "Crafted in the Pacific Northwest since 1863",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Vintage Band T-Shirt",
                ShortDescription = "Authentic vintage concert tee from the 80s-90s",
                BrandName = "Vintage",
                Size = "M",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 45.00m,
                EstimatedResaleValue = 65.00m,
                Benefits = "Authentic vintage piece. Unique distressed graphics. Soft broken-in feel.",
                Details = "100% cotton. Pre-owned vintage. Condition: Good. Era: 1980s-1990s",
                Shipping = "Free shipping. Final sale - no returns on vintage items.",
                PromotionalMessage = "One-of-a-kind collector's item",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Polo Shirt Classic",
                ShortDescription = "Original petit piqué polo with crocodile",
                BrandName = "Lacoste",
                Size = "S",
                Gender = Gender.Mens,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 95.00m,
                EstimatedResaleValue = 70.00m,
                Benefits = "Iconic petit piqué fabric. Two-button placket. Signature crocodile logo.",
                Details = "100% cotton petit piqué. Ribbed collar and armbands. Style: L1212",
                Shipping = "Free shipping on all orders.",
                PromotionalMessage = "The original polo since 1933",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Silk Blouse Elegant",
                ShortDescription = "Luxurious 100% silk relaxed-fit blouse",
                BrandName = "Equipment",
                Size = "S",
                Gender = Gender.Womens,
                ItemType = ItemType.Shirt,
                EstimatedMSRP = 280.00m,
                EstimatedResaleValue = 150.00m,
                Benefits = "100% silk construction. Relaxed fit. Versatile styling options.",
                Details = "100% silk crepe de chine. Button front. Dry clean only. Style: Q23E900",
                Shipping = "Free express shipping. Arrives in 2-3 business days.",
                PromotionalMessage = "Effortless French elegance",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Sweaters (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Cable Knit Sweater",
                ShortDescription = "Cozy cable-knit cotton crew neck",
                BrandName = "J.Crew",
                Size = "M",
                Gender = Gender.Unisex,
                ItemType = ItemType.Sweater,
                EstimatedMSRP = 98.00m,
                EstimatedResaleValue = 70.00m,
                Benefits = "Classic cable knit pattern. Ribbed cuffs and hem. Cozy midweight construction.",
                Details = "100% cotton. Crew neck. Hand wash cold. Style: K1234",
                Shipping = "Free standard shipping. Easy returns within 60 days.",
                PromotionalMessage = "Timeless style for any season",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Cashmere V-Neck Sweater",
                ShortDescription = "Sustainably sourced Grade-A cashmere",
                BrandName = "Everlane",
                Size = "S",
                Gender = Gender.Womens,
                ItemType = ItemType.Sweater,
                EstimatedMSRP = 145.00m,
                EstimatedResaleValue = 100.00m,
                Benefits = "Grade-A cashmere. Lightweight warmth. Sustainably sourced materials.",
                Details = "100% Grade-A cashmere. V-neck design. Dry clean recommended. Style: W-CASH-V",
                Shipping = "Free shipping and free returns.",
                PromotionalMessage = "Radical transparency in luxury knitwear",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Wool Cardigan Vintage",
                ShortDescription = "Authentic vintage pure wool cardigan",
                BrandName = "Pendleton",
                Size = "L",
                Gender = Gender.Mens,
                ItemType = ItemType.Sweater,
                EstimatedMSRP = 175.00m,
                EstimatedResaleValue = 120.00m,
                Benefits = "Pure virgin wool. Authentic vintage styling. Button front closure.",
                Details = "100% virgin wool. Made in USA. Dry clean only. Era: 1970s-1980s",
                Shipping = "Free shipping. Ships within 2 business days.",
                PromotionalMessage = "Vintage American craftsmanship",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Hoodies (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Pullover Hoodie",
                ShortDescription = "Reverse weave hoodie with minimal shrinkage",
                BrandName = "Champion",
                Size = "L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Hoodie,
                EstimatedMSRP = 60.00m,
                EstimatedResaleValue = 45.00m,
                Benefits = "Reverse weave construction. Reduced shrinkage. Double-needle stitching.",
                Details = "82% cotton, 18% polyester. Front pouch pocket. Ribbed cuffs. Style: GF68",
                Shipping = "Free standard shipping on all orders.",
                PromotionalMessage = "The original athletic hoodie since 1919",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Tech Fleece Hoodie",
                ShortDescription = "Lightweight tech fleece with modern fit",
                BrandName = "Nike",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Hoodie,
                EstimatedMSRP = 120.00m,
                EstimatedResaleValue = 90.00m,
                Benefits = "Lightweight Tech Fleece fabric. Zippered pockets. Tapered fit for modern look.",
                Details = "66% cotton, 34% polyester Tech Fleece. Full-zip design. Style: CU4489-063",
                Shipping = "Free shipping. Next-day delivery available.",
                PromotionalMessage = "Engineered warmth without the bulk",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Box Logo Hoodie",
                ShortDescription = "Highly collectible streetwear icon",
                BrandName = "Supreme",
                Size = "M",
                Gender = Gender.Unisex,
                ItemType = ItemType.Hoodie,
                EstimatedMSRP = 168.00m,
                EstimatedResaleValue = 450.00m,
                Benefits = "Iconic box logo embroidery. Heavy cotton fleece. Premium construction.",
                Details = "100% cotton. Kangaroo pocket. Made in Canada. Style: FW21",
                Shipping = "Free insured shipping. Signature required.",
                PromotionalMessage = "Highly sought-after streetwear grail",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Bags (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Little America Backpack",
                ShortDescription = "Mountain-inspired backpack with laptop sleeve",
                BrandName = "Herschel",
                Size = "25L",
                Gender = Gender.Unisex,
                ItemType = ItemType.Bag,
                EstimatedMSRP = 100.00m,
                EstimatedResaleValue = 75.00m,
                Benefits = "Signature mountain design. Padded laptop sleeve. Magnetic strap closures.",
                Details = "Polyester fabric. 25L capacity. 15\" laptop sleeve. Style: 10014-00001",
                Shipping = "Free standard shipping. Express available.",
                PromotionalMessage = "The iconic mountaineering-inspired backpack",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Classic Tote Bag",
                ShortDescription = "Foldable nylon tote with leather trim",
                BrandName = "Longchamp",
                Size = "Large",
                Gender = Gender.Womens,
                ItemType = ItemType.Bag,
                EstimatedMSRP = 145.00m,
                EstimatedResaleValue = 100.00m,
                Benefits = "Foldable nylon design. Leather trim accents. Lightweight and durable.",
                Details = "Nylon with leather handles. Zip closure. Interior pocket. Style: Le Pliage",
                Shipping = "Free shipping. Gift box included.",
                PromotionalMessage = "French craftsmanship since 1948",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Messenger Bag Leather",
                ShortDescription = "Full-grain leather messenger for professionals",
                BrandName = "Fossil",
                Size = "Medium",
                Gender = Gender.Mens,
                ItemType = ItemType.Bag,
                EstimatedMSRP = 198.00m,
                EstimatedResaleValue = 130.00m,
                Benefits = "Full-grain leather. Multiple compartments. Adjustable strap.",
                Details = "100% leather. Magnetic closure. Fits 13\" laptop. Style: MBG9354200",
                Shipping = "Free shipping and returns. Ships within 1-2 days.",
                PromotionalMessage = "Classic style meets modern functionality",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Hats (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Yankees Baseball Cap",
                ShortDescription = "Official MLB 59FIFTY fitted cap",
                BrandName = "New Era",
                Size = "7 3/8",
                Gender = Gender.Unisex,
                ItemType = ItemType.Hat,
                EstimatedMSRP = 40.00m,
                EstimatedResaleValue = 30.00m,
                Benefits = "Official MLB licensed. 59FIFTY fitted design. Embroidered team logo.",
                Details = "100% polyester. Fitted design. Green undervisor. Style: 70331909",
                Shipping = "Free standard shipping. Ships within 1-2 days.",
                PromotionalMessage = "The official on-field cap",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Wool Beanie Classic",
                ShortDescription = "Stretchable rib-knit watch cap",
                BrandName = "Carhartt",
                Size = "One Size",
                Gender = Gender.Unisex,
                ItemType = ItemType.Hat,
                EstimatedMSRP = 25.00m,
                EstimatedResaleValue = 18.00m,
                Benefits = "Stretchable rib-knit fabric. Fold-up cuff. Carhartt label sewn on front.",
                Details = "100% acrylic. One size fits most. Machine washable. Style: A18",
                Shipping = "Free shipping on orders over $50.",
                PromotionalMessage = "Built for the elements",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Fedora Hat Vintage",
                ShortDescription = "Handcrafted fur felt fedora made in USA",
                BrandName = "Stetson",
                Size = "M",
                Gender = Gender.Mens,
                ItemType = ItemType.Hat,
                EstimatedMSRP = 150.00m,
                EstimatedResaleValue = 110.00m,
                Benefits = "Premium fur felt. Handcrafted construction. Iconic Western styling.",
                Details = "100% fur felt. Leather sweatband. Made in USA. Style: SFDUNLP",
                Shipping = "Free shipping. Arrives in presentation box.",
                PromotionalMessage = "The hat that won the West since 1865",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Accessories (3 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Aviator Sunglasses",
                ShortDescription = "Iconic teardrop aviators with UV protection",
                BrandName = "Ray-Ban",
                Size = "Standard",
                Gender = Gender.Unisex,
                ItemType = ItemType.Accessories,
                EstimatedMSRP = 161.00m,
                EstimatedResaleValue = 120.00m,
                Benefits = "Iconic teardrop shape. Crystal green lenses. 100% UV protection.",
                Details = "Metal frame. Glass lenses. Spring hinges. Style: RB3025 L0205",
                Shipping = "Free shipping. Includes branded case and cloth.",
                PromotionalMessage = "The original aviator since 1937",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Automatic Watch SKX007",
                ShortDescription = "Legendary discontinued diver watch",
                BrandName = "Seiko",
                Size = "42mm",
                Gender = Gender.Mens,
                ItemType = ItemType.Accessories,
                EstimatedMSRP = 299.00m,
                EstimatedResaleValue = 350.00m,
                Benefits = "Legendary 7S26 automatic movement. 200m water resistance. Day-date display.",
                Details = "Stainless steel case. Hardlex crystal. Rubber strap. Style: SKX007K1",
                Shipping = "Free insured shipping. Watch box included.",
                PromotionalMessage = "The legendary diver watch - now discontinued and highly collectible",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Leather Belt Classic",
                ShortDescription = "Reversible pebbled leather belt",
                BrandName = "Coach",
                Size = "32",
                Gender = Gender.Mens,
                ItemType = ItemType.Accessories,
                EstimatedMSRP = 98.00m,
                EstimatedResaleValue = 65.00m,
                Benefits = "Premium pebbled leather. Signature buckle. Reversible design.",
                Details = "100% leather. Palladium buckle. 1.5\" width. Style: F64839",
                Shipping = "Free standard shipping. Gift wrapping available.",
                PromotionalMessage = "Timeless American craftsmanship",
                IsMemberExclusive = false,
                IsNew = false,
                CreatedDate = now,
                UpdatedDate = now
            },

            // Dresses (2 products)
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Wrap Dress Elegant",
                ShortDescription = "Iconic silk wrap dress for all body types",
                BrandName = "Diane von Furstenberg",
                Size = "S",
                Gender = Gender.Womens,
                ItemType = ItemType.Dress,
                EstimatedMSRP = 398.00m,
                EstimatedResaleValue = 200.00m,
                Benefits = "Iconic wrap silhouette. Flattering fit for all body types. Versatile day-to-night styling.",
                Details = "100% silk jersey. Self-tie waist. Dry clean only. Style: DVF-WRAP",
                Shipping = "Free express shipping. Arrives in 2-3 business days.",
                PromotionalMessage = "The dress that launched a fashion revolution",
                IsMemberExclusive = true,
                IsNew = true,
                CreatedDate = now,
                UpdatedDate = now
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Description = "Maxi Dress Summer",
                ShortDescription = "Flowy bohemian maxi with adjustable straps",
                BrandName = "Free People",
                Size = "M",
                Gender = Gender.Womens,
                ItemType = ItemType.Dress,
                EstimatedMSRP = 128.00m,
                EstimatedResaleValue = 80.00m,
                Benefits = "Flowy bohemian silhouette. Adjustable straps. Lined for coverage.",
                Details = "100% rayon. V-neckline. Machine washable. Style: OB1187942",
                Shipping = "Free standard shipping. Easy returns within 30 days.",
                PromotionalMessage = "Effortless boho vibes for every summer day",
                IsMemberExclusive = false,
                IsNew = false,
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
