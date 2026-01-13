// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Messaging.Serialization;

public interface IMessageSerializer
{
    byte[] Serialize<T>(T message);
    T? Deserialize<T>(byte[] data);
    object? Deserialize(byte[] data, Type type);
}
