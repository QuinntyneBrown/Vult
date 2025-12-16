using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.Models;

namespace Vult.Infrastructure.Data.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(r => r.RoleId);
        
        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.HasIndex(r => r.Name)
            .IsUnique();
        
        builder.Property(r => r.Description)
            .HasMaxLength(200);
        
        builder.Property(r => r.CreatedDate)
            .IsRequired();
        
        builder.Property(r => r.UpdatedDate)
            .IsRequired();
    }
}
