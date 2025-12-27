// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;
using Vult.Core.Services;

namespace Vult.Api.Features.Auth;

public class AuthenticateRequestHandler : IRequestHandler<AuthenticateRequest, AuthenticateResponse>
{
    private readonly IVultContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthenticateRequestHandler(
        IVultContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthenticateResponse> Handle(AuthenticateRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .FirstOrDefaultAsync(u => u.Username == request.Username && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.Password, user.Salt))
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        var token = _tokenService.GenerateToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        return new AuthenticateResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            UserId = user.UserId
        };
    }
}
