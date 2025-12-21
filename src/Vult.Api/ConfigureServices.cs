// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Vult.Api.Authorization;
using Vult.Api.Behaviours;
using Vult.Api.Configuration;
using Vult.Api.Services;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {

        services.AddControllers();
        services.AddSignalR();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddHttpContextAccessor();

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(ConfigureServices).Assembly);
            config.AddOpenBehavior(typeof(ResourceOperationAuthorizationBehavior<,>));
        });

        services.AddDbContext<VultContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("Vult.Api")));

        services.AddScoped<IVultContext>(provider => provider.GetRequiredService<VultContext>());

        services.AddScoped<Vult.Infrastructure.ISeedService, Vult.Infrastructure.SeedService>();

        // Identity services
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthorizationHandler, ResourceOperationAuthorizationHandler>();

        // Azure AI services
        services.AddSingleton<IAzureOpenAIService>(sp =>
        {
            var azureOpenAIEndpoint = configuration["AzureOpenAI:Endpoint"] ?? configuration["AzureOpenAIEndpoint"] ?? "https://api.openai.azure.com";
            var azureOpenAIKey = configuration["AzureOpenAI:Key"] ?? configuration["AzureOpenAIKey"] ?? "";
            var azureOpenAIDeployment = configuration["AzureOpenAI:DeploymentName"] ?? configuration["AzureOpenAIDeploymentName"] ?? "gpt-4";

            return new AzureOpenAIService(azureOpenAIEndpoint, azureOpenAIKey, azureOpenAIDeployment);
        });

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
        services.AddCors(options => options.AddPolicy("CorsPolicy",
            builder => builder
            .WithOrigins("http://localhost:4201")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(isOriginAllowed: _ => true)
            .AllowCredentials()));

        return services;
    }
}

