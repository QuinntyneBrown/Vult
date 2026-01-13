// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using Vult.Messaging.PubSub;
using Vult.Messaging.Serialization;

namespace Vult.Messaging.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddVultMessaging(this IServiceCollection services, string redisConnectionString)
    {
        services.AddSingleton<IConnectionMultiplexer>(_ =>
            ConnectionMultiplexer.Connect(redisConnectionString));

        services.AddSingleton<IMessageSerializer, MessagePackMessageSerializer>();
        services.AddSingleton<IEventPublisher, RedisEventPublisher>();
        services.AddSingleton<IEventSubscriber, RedisEventSubscriber>();

        return services;
    }

    public static IServiceCollection AddVultMessaging(this IServiceCollection services, ConfigurationOptions redisOptions)
    {
        services.AddSingleton<IConnectionMultiplexer>(_ =>
            ConnectionMultiplexer.Connect(redisOptions));

        services.AddSingleton<IMessageSerializer, MessagePackMessageSerializer>();
        services.AddSingleton<IEventPublisher, RedisEventPublisher>();
        services.AddSingleton<IEventSubscriber, RedisEventSubscriber>();

        return services;
    }
}
