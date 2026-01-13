// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using DigitalAssetService.Api.Data.Configurations;
using DigitalAssetService.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace DigitalAssetService.Api.Data;

public class DigitalAssetDbContext : DbContext
{
    public DigitalAssetDbContext(DbContextOptions<DigitalAssetDbContext> options) : base(options)
    {
    }

    public DbSet<DigitalAsset> DigitalAssets { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new DigitalAssetConfiguration());
    }
}
