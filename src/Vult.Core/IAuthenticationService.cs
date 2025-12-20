// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core;

public interface IAuthenticationService
{
    Task<string?> AuthenticateAsync(string username, string password, CancellationToken cancellationToken = default);
    Task<User?> RegisterAsync(string username, string email, string password, CancellationToken cancellationToken = default);
    Task<string?> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    bool ValidateToken(string token);
    Guid? GetUserIdFromToken(string token);
}
