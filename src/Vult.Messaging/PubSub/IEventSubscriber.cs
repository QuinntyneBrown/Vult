// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Messaging.Events;

namespace Vult.Messaging.PubSub;

public interface IEventSubscriber
{
    Task SubscribeAsync<TEvent>(string channel, Func<TEvent, Task> handler, CancellationToken cancellationToken = default)
        where TEvent : class, IIntegrationEvent;

    Task SubscribeAsync<TEvent>(Func<TEvent, Task> handler, CancellationToken cancellationToken = default)
        where TEvent : class, IIntegrationEvent;

    Task UnsubscribeAsync(string channel, CancellationToken cancellationToken = default);
}
