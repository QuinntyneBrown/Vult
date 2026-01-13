// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MessagePack;

namespace Vult.Messaging.Events;

[MessagePackObject]
public abstract class IntegrationEventBase : IIntegrationEvent
{
    [Key(0)]
    public Guid EventId { get; set; } = Guid.NewGuid();

    [Key(1)]
    public DateTime OccurredOn { get; set; } = DateTime.UtcNow;

    [Key(2)]
    public string EventType => GetType().Name;
}
