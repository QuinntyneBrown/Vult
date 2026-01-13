// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using ProductService.Api.Model;

namespace ProductService.Api.Data.Seed;

public interface IProductSeedService
{
    Task SeedAsync(CancellationToken cancellationToken = default);
}

public class ProductSeedService : IProductSeedService
{
    private readonly ProductDbContext _context;
    private readonly ILogger<ProductSeedService> _logger;

    public ProductSeedService(ProductDbContext context, ILogger<ProductSeedService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _context.Products.AnyAsync(cancellationToken))
        {
            _logger.LogInformation("Database already seeded, skipping...");
            return;
        }

        _logger.LogInformation("Seeding product database...");

        var products = new List<Product>
        {
            new Product
            {
                ProductId = Guid.NewGuid(),
                Name = "Nike Air Max 90",
                Description = "The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU details.",
                ShortDescription = "Classic Nike Air Max sneaker",
                EstimatedMSRP = 130.00m,
                EstimatedResaleValue = 150.00m,
                Size = "10",
                BrandName = "Nike",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe,
                IsFeatured = true,
                IsNew = false,
                IsMemberExclusive = false,
                Benefits = "Visible Air cushioning, Durable construction",
                Details = "Style: CN8490-001, Colorway: White/Black",
                Shipping = "Free shipping on orders over $50",
                PromotionalMessage = "Limited time offer!",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Name = "Adidas Ultraboost 22",
                Description = "Experience incredible energy return with the Adidas Ultraboost 22. Features responsive BOOST midsole technology.",
                ShortDescription = "Premium running shoe with BOOST technology",
                EstimatedMSRP = 190.00m,
                EstimatedResaleValue = 170.00m,
                Size = "9.5",
                BrandName = "Adidas",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                IsFeatured = true,
                IsNew = true,
                IsMemberExclusive = false,
                Benefits = "BOOST technology, Primeknit upper",
                Details = "Style: GX5460, Colorway: Core Black",
                Shipping = "Free shipping on orders over $50",
                PromotionalMessage = "New arrival!",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Name = "Jordan 1 Retro High OG",
                Description = "The Air Jordan 1 High is a true icon of sneaker culture. Premium leather upper with classic colorway.",
                ShortDescription = "Iconic basketball sneaker",
                EstimatedMSRP = 180.00m,
                EstimatedResaleValue = 350.00m,
                Size = "11",
                BrandName = "Jordan",
                Gender = Gender.Mens,
                ItemType = ItemType.Shoe,
                IsFeatured = true,
                IsNew = false,
                IsMemberExclusive = true,
                Benefits = "Premium leather, Air cushioning",
                Details = "Style: DZ5485-612, Colorway: Chicago",
                Shipping = "Free shipping for members",
                PromotionalMessage = "Member exclusive!",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Name = "New Balance 550",
                Description = "Originally designed for basketball, the New Balance 550 has become a streetwear staple with its clean lines.",
                ShortDescription = "Retro basketball-inspired sneaker",
                EstimatedMSRP = 110.00m,
                EstimatedResaleValue = 130.00m,
                Size = "10.5",
                BrandName = "New Balance",
                Gender = Gender.Unisex,
                ItemType = ItemType.Shoe,
                IsFeatured = false,
                IsNew = false,
                IsMemberExclusive = false,
                Benefits = "Leather upper, Retro design",
                Details = "Style: BB550WT1, Colorway: White/Green",
                Shipping = "Free shipping on orders over $50",
                PromotionalMessage = "",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            },
            new Product
            {
                ProductId = Guid.NewGuid(),
                Name = "Nike Tech Fleece Hoodie",
                Description = "The Nike Tech Fleece Hoodie delivers lightweight warmth in a streamlined silhouette.",
                ShortDescription = "Premium tech fleece hoodie",
                EstimatedMSRP = 130.00m,
                EstimatedResaleValue = 110.00m,
                Size = "L",
                BrandName = "Nike",
                Gender = Gender.Mens,
                ItemType = ItemType.Hoodie,
                IsFeatured = false,
                IsNew = true,
                IsMemberExclusive = false,
                Benefits = "Lightweight warmth, Soft fabric",
                Details = "Style: CU4489-010, Colorway: Black",
                Shipping = "Free shipping on orders over $50",
                PromotionalMessage = "New season style!",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            }
        };

        await _context.Products.AddRangeAsync(products, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} products", products.Count);
    }
}
