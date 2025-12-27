// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Vult.Core.Services;

public interface IPasswordHasher
{
    string HashPassword(string password, byte[] salt);
    byte[] GenerateSalt();
    bool VerifyPassword(string password, string hashedPassword, byte[] salt);
}
