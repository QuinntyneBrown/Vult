// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using Vult.Messaging.Events;
using Vult.Messaging.Serialization;

namespace Vult.Messaging.PubSub;

public class RedisEventSubscriber : IEventSubscriber
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IMessageSerializer _serializer;
    private readonly ILogger<RedisEventSubscriber> _logger;

    public RedisEventSubscriber(
        IConnectionMultiplexer redis,
        IMessageSerializer serializer,
        ILogger<RedisEventSubscriber> logger)
    {
        _redis = redis;
        _serializer = serializer;
        _logger = logger;
    }

    public async Task SubscribeAsync<TEvent>(Func<TEvent, Task> handler, CancellationToken cancellationToken = default)
        where TEvent : class, IIntegrationEvent
    {
        var channel = GetChannelName<TEvent>();
        await SubscribeAsync(channel, handler, cancellationToken);
    }

    public async Task SubscribeAsync<TEvent>(string channel, Func<TEvent, Task> handler, CancellationToken cancellationToken = default)
        where TEvent : class, IIntegrationEvent
    {
        var subscriber = _redis.GetSubscriber();

        await subscriber.SubscribeAsync(
            RedisChannel.Literal(channel),
            async (_, message) =>
            {
                try
                {
                    if (message.IsNullOrEmpty)
                    {
                        _logger.LogWarning("Received empty message on channel {Channel}", channel);
                        return;
                    }

                    var @event = _serializer.Deserialize<TEvent>((byte[])message!);
                    if (@event == null)
                    {
                        _logger.LogWarning("Failed to deserialize message on channel {Channel}", channel);
                        return;
                    }

                    _logger.LogInformation(
                        "Received event {EventType} with ID {EventId} on channel {Channel}",
                        @event.EventType,
                        @event.EventId,
                        channel);

                    await handler(@event);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing message on channel {Channel}", channel);
                }
            });

        _logger.LogInformation("Subscribed to channel {Channel}", channel);
    }

    public async Task UnsubscribeAsync(string channel, CancellationToken cancellationToken = default)
    {
        var subscriber = _redis.GetSubscriber();
        await subscriber.UnsubscribeAsync(RedisChannel.Literal(channel));
        _logger.LogInformation("Unsubscribed from channel {Channel}", channel);
    }

    private static string GetChannelName<TEvent>() where TEvent : class, IIntegrationEvent
    {
        return $"vult:{typeof(TEvent).Name.ToLowerInvariant()}";
    }
}
