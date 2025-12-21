// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IVultContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ChangePasswordCommandHandler(
        IVultContext context,
        IPasswordHasher passwordHasher,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated");
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        if (!_passwordHasher.VerifyPassword(request.OldPassword, user.Password, user.Salt))
        {
            throw new UnauthorizedAccessException("Current password is incorrect");
        }

        var newSalt = _passwordHasher.GenerateSalt();
        user.Salt = newSalt;
        user.Password = _passwordHasher.HashPassword(request.NewPassword, newSalt);

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
