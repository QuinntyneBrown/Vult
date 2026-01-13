// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MessagePack;

namespace Vult.Messaging.Events;

[MessagePackObject]
public class UserCreatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid UserId { get; set; }

    [Key(4)]
    public string Username { get; set; } = string.Empty;

    [Key(5)]
    public string Email { get; set; } = string.Empty;

    [Key(6)]
    public List<string> Roles { get; set; } = new();
}

[MessagePackObject]
public class UserUpdatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid UserId { get; set; }

    [Key(4)]
    public string Username { get; set; } = string.Empty;

    [Key(5)]
    public string Email { get; set; } = string.Empty;

    [Key(6)]
    public List<string> Roles { get; set; } = new();
}

[MessagePackObject]
public class UserDeletedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid UserId { get; set; }
}
