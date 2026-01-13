// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using Vult.Messaging.Events;
using Vult.Messaging.Serialization;

namespace Vult.Messaging.PubSub;

public class RedisEventPublisher : IEventPublisher
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IMessageSerializer _serializer;
    private readonly ILogger<RedisEventPublisher> _logger;

    public RedisEventPublisher(
        IConnectionMultiplexer redis,
        IMessageSerializer serializer,
        ILogger<RedisEventPublisher> logger)
    {
        _redis = redis;
        _serializer = serializer;
        _logger = logger;
    }

    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IIntegrationEvent
    {
        var channel = GetChannelName<TEvent>();
        await PublishAsync(channel, @event, cancellationToken);
    }

    public async Task PublishAsync<TEvent>(string channel, TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IIntegrationEvent
    {
        try
        {
            var subscriber = _redis.GetSubscriber();
            var data = _serializer.Serialize(@event);

            await subscriber.PublishAsync(
                RedisChannel.Literal(channel),
                data);

            _logger.LogInformation(
                "Published event {EventType} with ID {EventId} to channel {Channel}",
                @event.EventType,
                @event.EventId,
                channel);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to publish event {EventType} with ID {EventId} to channel {Channel}",
                @event.EventType,
                @event.EventId,
                channel);
            throw;
        }
    }

    private static string GetChannelName<TEvent>() where TEvent : IIntegrationEvent
    {
        return $"vult:{typeof(TEvent).Name.ToLowerInvariant()}";
    }
}
