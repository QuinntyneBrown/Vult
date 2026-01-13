// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using IdentityService.Api.Data;
using IdentityService.Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Api.Features.Users;

public class LoginCommand : IRequest<LoginResultDto?>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResultDto?>
{
    private readonly IdentityDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        IdentityDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        ILogger<LoginCommandHandler> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<LoginResultDto?> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
                .ThenInclude(r => r.Privileges)
            .FirstOrDefaultAsync(u => u.Username == request.Username && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Login attempt failed: user {Username} not found", request.Username);
            return null;
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.Password, user.Salt))
        {
            _logger.LogWarning("Login attempt failed: invalid password for user {Username}", request.Username);
            return null;
        }

        var token = _tokenService.GenerateToken(user);

        _logger.LogInformation("User {Username} logged in successfully", user.Username);

        return new LoginResultDto
        {
            Token = token,
            User = user.ToDto()
        };
    }
}
