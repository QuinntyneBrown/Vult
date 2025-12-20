// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Vult.Api.Services;
using Vult.Core;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {

        services.AddControllers();        
        services.AddSignalR();
        services.AddOpenApi();
        services.AddMediatR(configuration =>
        {
            configuration.RegisterServicesFromAssembly(typeof(ConfigureServices).Assembly);
        });

        services.AddDbContext<VultContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("Vult.Api")));
        
        services.AddScoped<IVultContext>(provider => provider.GetRequiredService<VultContext>());

        services.AddScoped<Vult.Infrastructure.ISeedService, Vult.Infrastructure.SeedService>();

        // Auth services
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<IAuthorizationService, AuthorizationService>();

        // Azure AI services
        services.AddSingleton<IAzureOpenAIService, AzureOpenAIService>();
        services.AddSingleton<IImageAnalysisService, ImageAnalysisService>();
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

