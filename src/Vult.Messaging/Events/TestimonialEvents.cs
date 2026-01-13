// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MessagePack;

namespace Vult.Messaging.Events;

[MessagePackObject]
public class TestimonialCreatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid TestimonialId { get; set; }

    [Key(4)]
    public string CustomerName { get; set; } = string.Empty;

    [Key(5)]
    public int Rating { get; set; }

    [Key(6)]
    public string Text { get; set; } = string.Empty;
}

[MessagePackObject]
public class TestimonialUpdatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid TestimonialId { get; set; }

    [Key(4)]
    public string CustomerName { get; set; } = string.Empty;

    [Key(5)]
    public int Rating { get; set; }

    [Key(6)]
    public string Text { get; set; } = string.Empty;
}

[MessagePackObject]
public class TestimonialDeletedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid TestimonialId { get; set; }
}
