// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;

namespace DigitalAssetService.Api.Data.Seed;

public interface IDigitalAssetSeedService
{
    Task SeedAsync(CancellationToken cancellationToken = default);
}

public class DigitalAssetSeedService : IDigitalAssetSeedService
{
    private readonly DigitalAssetDbContext _context;
    private readonly ILogger<DigitalAssetSeedService> _logger;

    public DigitalAssetSeedService(DigitalAssetDbContext context, ILogger<DigitalAssetSeedService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _context.DigitalAssets.AnyAsync(cancellationToken))
        {
            _logger.LogInformation("Database already seeded, skipping...");
            return;
        }

        _logger.LogInformation("Digital asset database initialized (no seed data required)");
    }
}
