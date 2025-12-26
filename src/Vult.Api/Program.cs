// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Api.Configuration;
using Vult.Api.Hubs;
using Microsoft.EntityFrameworkCore;
using Vult.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

// Migrate and seed database in development only
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<VultContext>();

            // Run migrations to ensure database is up to date

            await context.Database.EnsureDeletedAsync();
            
            await context.Database.EnsureCreatedAsync();

            await context.Database.MigrateAsync();

            var seedService = services.GetRequiredService<Vult.Infrastructure.ISeedService>();

            await seedService.SeedAsync();
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred during database migration or seeding.");
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS policy from configuration
var corsSettings = app.Configuration
    .GetSection(CorsSettings.SectionName)
    .Get<CorsSettings>() ?? new CorsSettings();
app.UseCors(corsSettings.PolicyName);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapHub<IngestionHub>("/hubs/ingestion");

await app.RunAsync();
