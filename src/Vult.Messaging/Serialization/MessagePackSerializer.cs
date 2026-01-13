// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MessagePack;
using MessagePack.Resolvers;

namespace Vult.Messaging.Serialization;

public class MessagePackMessageSerializer : IMessageSerializer
{
    private static readonly MessagePackSerializerOptions Options = MessagePackSerializerOptions.Standard
        .WithResolver(CompositeResolver.Create(
            StandardResolver.Instance,
            ContractlessStandardResolver.Instance
        ))
        .WithSecurity(MessagePackSecurity.UntrustedData);

    public byte[] Serialize<T>(T message)
    {
        return MessagePackSerializer.Serialize(message, Options);
    }

    public T? Deserialize<T>(byte[] data)
    {
        return MessagePackSerializer.Deserialize<T>(data, Options);
    }

    public object? Deserialize(byte[] data, Type type)
    {
        return MessagePackSerializer.Deserialize(type, data, Options);
    }
}
