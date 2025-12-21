// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core;

namespace Vult.Infrastructure.Data.Configurations;

public class InvitationTokenConfiguration : IEntityTypeConfiguration<InvitationToken>
{
    public void Configure(EntityTypeBuilder<InvitationToken> builder)
    {
        builder.HasKey(t => t.InvitationTokenId);

        builder.Property(t => t.Value)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasIndex(t => t.Value)
            .IsUnique();
    }
}
