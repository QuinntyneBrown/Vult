using Microsoft.EntityFrameworkCore;
using Vult.Core.Interfaces;
using Vult.Core.Models;

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

        // Configure CatalogItem
        modelBuilder.Entity<CatalogItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(1000);
            
            entity.Property(e => e.Size)
                .IsRequired()
                .HasMaxLength(50);
            
            entity.Property(e => e.BrandName)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.EstimatedMSRP)
                .HasColumnType("decimal(18,2)");
            
            entity.Property(e => e.EstimatedResaleValue)
                .HasColumnType("decimal(18,2)");
            
            entity.Property(e => e.Gender)
                .IsRequired()
                .HasConversion<string>();
            
            entity.Property(e => e.ClothingType)
                .IsRequired()
                .HasConversion<string>();
            
            entity.Property(e => e.CreatedDate)
                .IsRequired();
            
            entity.Property(e => e.UpdatedDate)
                .IsRequired();
            
            // Configure relationship with CatalogItemImages
            entity.HasMany(e => e.CatalogItemImages)
                .WithOne(e => e.CatalogItem)
                .HasForeignKey(e => e.CatalogItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure CatalogItemImage
        modelBuilder.Entity<CatalogItemImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Url)
                .IsRequired()
                .HasMaxLength(500);
            
            entity.Property(e => e.AltText)
                .IsRequired()
                .HasMaxLength(200);
            
            entity.Property(e => e.CreatedDate)
                .IsRequired();
            
            entity.Property(e => e.UpdatedDate)
                .IsRequired();
        });
    }
}
