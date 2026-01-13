// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MessagePack;

namespace Vult.Messaging.Events;

[MessagePackObject]
public class CustomerCreatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid CustomerId { get; set; }

    [Key(4)]
    public Guid? UserId { get; set; }

    [Key(5)]
    public string FirstName { get; set; } = string.Empty;

    [Key(6)]
    public string LastName { get; set; } = string.Empty;

    [Key(7)]
    public string? Phone { get; set; }
}

[MessagePackObject]
public class CustomerUpdatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid CustomerId { get; set; }

    [Key(4)]
    public Guid? UserId { get; set; }

    [Key(5)]
    public string FirstName { get; set; } = string.Empty;

    [Key(6)]
    public string LastName { get; set; } = string.Empty;

    [Key(7)]
    public string? Phone { get; set; }
}

[MessagePackObject]
public class CustomerDeletedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid CustomerId { get; set; }
}
