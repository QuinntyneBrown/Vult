// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Vult.Api.Features.CatalogItems;
using Vult.Api.Services;
using Vult.Core.Interfaces;
using Vult.Infrastructure.Data;
using Vult.Infrastructure.Services;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Controllers
        services.AddControllers();
        
        // OpenAPI
        services.AddOpenApi();

        // Database
        services.AddDbContext<VultContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("Vult.Api")));

        // IVultContext abstraction
        services.AddScoped<IVultContext>(provider => provider.GetRequiredService<VultContext>());

        // Auth services
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<IAuthorizationService, AuthorizationService>();

        // Azure AI services
        services.AddSingleton<IAzureAIService, AzureAIService>();
        services.AddScoped<ICatalogItemIngestionService, CatalogItemIngestionService>();
        services.AddScoped<ICatalogItemEvaluationService, CatalogItemEvaluationService>();

        // JWT configuration
        var jwtKey = configuration["Jwt:Key"] ?? "DefaultSecretKey12345678901234567890";
        var jwtIssuer = configuration["Jwt:Issuer"] ?? "VultApi";
        var jwtAudience = configuration["Jwt:Audience"] ?? "VultApp";

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                    ValidateIssuer = true,
                    ValidIssuer = jwtIssuer,
                    ValidateAudience = true,
                    ValidAudience = jwtAudience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

        services.AddAuthorization();

        // Command and Query Handlers
        services.AddScoped<GetCatalogItemsQueryHandler>();
        services.AddScoped<GetCatalogItemByIdQueryHandler>();
        services.AddScoped<CreateCatalogItemCommandHandler>();
        services.AddScoped<UpdateCatalogItemCommandHandler>();
        services.AddScoped<DeleteCatalogItemCommandHandler>();

        return services;
    }
}

