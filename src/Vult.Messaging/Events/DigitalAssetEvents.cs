// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MessagePack;

namespace Vult.Messaging.Events;

[MessagePackObject]
public class DigitalAssetCreatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid DigitalAssetId { get; set; }

    [Key(4)]
    public string Name { get; set; } = string.Empty;

    [Key(5)]
    public string ContentType { get; set; } = string.Empty;

    [Key(6)]
    public int Size { get; set; }
}

[MessagePackObject]
public class DigitalAssetDeletedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid DigitalAssetId { get; set; }
}
