// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using IdentityService.Api.Data;
using IdentityService.Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Api.Features.Users;

public class ChangePasswordCommand : IRequest<bool>
{
    public Guid UserId { get; set; }
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IdentityDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<ChangePasswordCommandHandler> _logger;

    public ChangePasswordCommandHandler(
        IdentityDbContext context,
        IPasswordHasher passwordHasher,
        ILogger<ChangePasswordCommandHandler> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == request.UserId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Password change failed: user {UserId} not found", request.UserId);
            return false;
        }

        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.Password, user.Salt))
        {
            _logger.LogWarning("Password change failed: invalid current password for user {UserId}", request.UserId);
            return false;
        }

        var newSalt = _passwordHasher.GenerateSalt();
        user.Salt = newSalt;
        user.Password = _passwordHasher.HashPassword(request.NewPassword, newSalt);
        user.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Password changed successfully for user {UserId}", request.UserId);
        return true;
    }
}
