// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MessagePack;

namespace Vult.Messaging.Events;

[Union(0, typeof(ProductCreatedEvent))]
[Union(1, typeof(ProductUpdatedEvent))]
[Union(2, typeof(ProductDeletedEvent))]
[Union(3, typeof(UserCreatedEvent))]
[Union(4, typeof(UserUpdatedEvent))]
[Union(5, typeof(UserDeletedEvent))]
[Union(6, typeof(CustomerCreatedEvent))]
[Union(7, typeof(CustomerUpdatedEvent))]
[Union(8, typeof(CustomerDeletedEvent))]
[Union(9, typeof(OrderCreatedEvent))]
[Union(10, typeof(OrderStatusChangedEvent))]
[Union(11, typeof(TestimonialCreatedEvent))]
[Union(12, typeof(TestimonialUpdatedEvent))]
[Union(13, typeof(TestimonialDeletedEvent))]
[Union(14, typeof(DigitalAssetCreatedEvent))]
[Union(15, typeof(DigitalAssetDeletedEvent))]
public interface IIntegrationEvent
{
    Guid EventId { get; }
    DateTime OccurredOn { get; }
    string EventType { get; }
}
