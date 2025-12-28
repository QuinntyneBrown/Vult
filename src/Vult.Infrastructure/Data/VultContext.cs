// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Core;
using Vult.Core.Model.CustomerAggregate;
using Vult.Core.Model.DigitalAssetAggregate;
using Vult.Core.Model.OrderAggregate;
using Vult.Core.Model.ProductAggregate;
using Vult.Core.Model.TestimonialAggregate;
using Vult.Core.Model.UserAggregate;
using Vult.Infrastructure.Data.Configurations;

namespace Vult.Infrastructure.Data;

public class VultContext : DbContext, IVultContext
{
    public VultContext(DbContextOptions<VultContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<ProductImage> ProductImages { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Privilege> Privileges { get; set; } = null!;
    public DbSet<Testimonial> Testimonials { get; set; } = null!;
    public DbSet<DigitalAsset> DigitalAssets { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<LineItem> LineItems { get; set; } = null!;
    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<CustomerAddress> CustomerAddresses { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new ProductConfiguration());
        modelBuilder.ApplyConfiguration(new ProductImageConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new PrivilegeConfiguration());
        modelBuilder.ApplyConfiguration(new TestimonialConfiguration());
        modelBuilder.ApplyConfiguration(new DigitalAssetConfiguration());
        modelBuilder.ApplyConfiguration(new CustomerConfiguration());
        modelBuilder.ApplyConfiguration(new CustomerAddressConfiguration());
        modelBuilder.ApplyConfiguration(new OrderConfiguration());
        modelBuilder.ApplyConfiguration(new LineItemConfiguration());
    }
}
