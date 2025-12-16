using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.Models;

namespace Vult.Infrastructure.Data.Configurations;

public class CatalogItemImageConfiguration : IEntityTypeConfiguration<CatalogItemImage>
{
    public void Configure(EntityTypeBuilder<CatalogItemImage> builder)
    {
        builder.ToTable("CatalogItemImages");
        
        builder.HasKey(e => e.CatalogItemImageId);
        
        builder.Property(e => e.CatalogItemId)
            .IsRequired();
        
        builder.Property(e => e.ImageData)
            .IsRequired();
        
        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(1000);
        
        builder.Property(e => e.CreatedDate)
            .IsRequired();
    }
}
