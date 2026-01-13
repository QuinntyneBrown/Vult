// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using TestimonialService.Api.Data.Configurations;
using TestimonialService.Api.Model;

namespace TestimonialService.Api.Data;

public class TestimonialDbContext : DbContext
{
    public TestimonialDbContext(DbContextOptions<TestimonialDbContext> options) : base(options)
    {
    }

    public DbSet<Testimonial> Testimonials { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new TestimonialConfiguration());
    }
}
