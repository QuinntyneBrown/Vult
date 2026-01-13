// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using TestimonialService.Api.Model;

namespace TestimonialService.Api.Data.Seed;

public interface ITestimonialSeedService
{
    Task SeedAsync(CancellationToken cancellationToken = default);
}

public class TestimonialSeedService : ITestimonialSeedService
{
    private readonly TestimonialDbContext _context;
    private readonly ILogger<TestimonialSeedService> _logger;

    public TestimonialSeedService(TestimonialDbContext context, ILogger<TestimonialSeedService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _context.Testimonials.AnyAsync(cancellationToken))
        {
            _logger.LogInformation("Database already seeded, skipping...");
            return;
        }

        _logger.LogInformation("Seeding testimonial database...");

        var testimonials = new List<Testimonial>
        {
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "Michael Johnson",
                Rating = 5,
                Text = "Best sneaker shopping experience ever! The selection is incredible and delivery was super fast. Will definitely be coming back for more.",
                CreatedDate = DateTime.UtcNow.AddDays(-30),
                UpdatedDate = DateTime.UtcNow.AddDays(-30)
            },
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "Sarah Williams",
                Rating = 5,
                Text = "Found rare Jordans I've been looking for at an amazing price. Customer service was helpful and the authentication process gave me peace of mind.",
                CreatedDate = DateTime.UtcNow.AddDays(-20),
                UpdatedDate = DateTime.UtcNow.AddDays(-20)
            },
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "David Chen",
                Rating = 4,
                Text = "Great selection and competitive prices. Shipping took a bit longer than expected but the product arrived in perfect condition.",
                CreatedDate = DateTime.UtcNow.AddDays(-15),
                UpdatedDate = DateTime.UtcNow.AddDays(-15)
            },
            new Testimonial
            {
                TestimonialId = Guid.NewGuid(),
                CustomerName = "Emily Rodriguez",
                Rating = 5,
                Text = "Love the member exclusive drops! Got my hands on limited editions I couldn't find anywhere else. Highly recommended for sneakerheads!",
                CreatedDate = DateTime.UtcNow.AddDays(-7),
                UpdatedDate = DateTime.UtcNow.AddDays(-7)
            }
        };

        await _context.Testimonials.AddRangeAsync(testimonials, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} testimonials", testimonials.Count);
    }
}
