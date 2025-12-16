// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Authentication.JwtBearer;
using MediatR;
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
        
        // SignalR
        services.AddSignalR();
        
        // OpenAPI
        services.AddOpenApi();

        // MediatR
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(ConfigureServices).Assembly);
        });

        // Database
        services.AddDbContext<VultContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("Vult.Api")));

        // IVultContext abstraction
        services.AddScoped<IVultContext>(provider => provider.GetRequiredService<VultContext>());

        // Seed service
        services.AddScoped<Vult.Infrastructure.ISeedService, Vult.Infrastructure.SeedService>();

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
                
                // Enable SignalR authentication
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                        {
                            context.Token = accessToken;
                        }
                        
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();

        // CORS configuration
        var allowedOrigins = configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options => options.AddPolicy("CorsPolicy",
            builder =>
            {
                if (allowedOrigins.Length > 0)
                {
                    builder.WithOrigins(allowedOrigins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                }
                else
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                }
            }));

        return services;
    }
}

