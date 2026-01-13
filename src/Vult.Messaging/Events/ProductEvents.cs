// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MessagePack;

namespace Vult.Messaging.Events;

[MessagePackObject]
public class ProductCreatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid ProductId { get; set; }

    [Key(4)]
    public string Name { get; set; } = string.Empty;

    [Key(5)]
    public decimal EstimatedMSRP { get; set; }

    [Key(6)]
    public decimal EstimatedResaleValue { get; set; }

    [Key(7)]
    public string BrandName { get; set; } = string.Empty;

    [Key(8)]
    public bool IsFeatured { get; set; }
}

[MessagePackObject]
public class ProductUpdatedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid ProductId { get; set; }

    [Key(4)]
    public string Name { get; set; } = string.Empty;

    [Key(5)]
    public decimal EstimatedMSRP { get; set; }

    [Key(6)]
    public decimal EstimatedResaleValue { get; set; }

    [Key(7)]
    public string BrandName { get; set; } = string.Empty;

    [Key(8)]
    public bool IsFeatured { get; set; }
}

[MessagePackObject]
public class ProductDeletedEvent : IntegrationEventBase
{
    [Key(3)]
    public Guid ProductId { get; set; }
}
