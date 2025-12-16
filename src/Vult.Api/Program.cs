// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Api.Hubs;
using Microsoft.Extensions.DependencyInjection;
using Vult.Core.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

// Seed a default user if none exists
await SeedDefaultUserAsync(app.Services);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<IngestionHub>("/hubs/ingestion");

await app.RunAsync();

static async Task SeedDefaultUserAsync(IServiceProvider services)
{
    using var scope = services.CreateScope();
    var authService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();

    const string defaultUsername = "admin";
    const string defaultEmail = "admin@example.com";
    const string defaultPassword = "P@ssw0rd!";

    try
    {
        await authService.RegisterAsync(defaultUsername, defaultEmail, defaultPassword);
    }
    catch
    {
        // Ignore any errors during seeding (e.g., user already exists)
    }
}
