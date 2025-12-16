using Microsoft.EntityFrameworkCore;
using Vult.Core.Interfaces;
using Vult.Core.Models;
using Vult.Infrastructure.Data.Configurations;

namespace Vult.Infrastructure.Data;

public class VultContext : DbContext, IVultContext
{
    public VultContext(DbContextOptions<VultContext> options) : base(options)
    {
    }

    public DbSet<CatalogItem> CatalogItems { get; set; } = null!;
    public DbSet<CatalogItemImage> CatalogItemImages { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new CatalogItemConfiguration());
        modelBuilder.ApplyConfiguration(new CatalogItemImageConfiguration());
    }
}
