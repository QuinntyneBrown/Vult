// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Core;
using Vult.Core.Services;
using Vult.Infrastructure.Data;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static void AddCliServices(this IServiceCollection services, IConfiguration configuration)
    {

        // MediatR
        services.AddMediatR(configuration =>
        {
            configuration.RegisterServicesFromAssembly(typeof(ConfigureServices).Assembly);
        });

        // Database
        services.AddDbContext<VultContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("Vult.Infrastructure")));

        // IVultContext abstraction
        services.AddScoped<IVultContext>(provider => provider.GetRequiredService<VultContext>());

        // Seed service
        services.AddScoped<Vult.Infrastructure.ISeedService, Vult.Infrastructure.SeedService>();

        // Azure AI services
        services.AddSingleton<IAzureOpenAIService, AzureOpenAIService>();
        services.AddSingleton<IAzureOpenAIService>(sp =>
        {
            
            return new AzureOpenAIService(
                configuration["AzureOpenAIEndpoint"],
                configuration["AzureOpenAIKey"],
                "gpt-4.1");
        });

        services.AddSingleton<IImageAnalysisService, ImageAnalysisService>();
        services.AddScoped<IProductIngestionService, ProductIngestionService>();
        services.AddScoped<IProductEvaluationService, ProductEvaluationService>();
    }


}

