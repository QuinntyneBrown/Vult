// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.Security.Cryptography;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.Users;
using Vult.Core;

namespace Vult.Api.Features.UserInvitations;

public class AcceptUserInvitationCommandHandler : IRequestHandler<AcceptUserInvitationCommand, AcceptUserInvitationCommandResult>
{
    private readonly IVultContext _context;

    public AcceptUserInvitationCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<AcceptUserInvitationCommandResult> Handle(AcceptUserInvitationCommand command, CancellationToken cancellationToken)
    {
        var result = new AcceptUserInvitationCommandResult();

        var invitation = await _context.UserInvitations
            .FirstOrDefaultAsync(i => i.Token == command.Data.Token, cancellationToken);

        if (invitation == null)
        {
            result.Errors.Add("Invalid invitation token");
            return result;
        }

        if (invitation.IsAccepted)
        {
            result.Errors.Add("This invitation has already been used");
            return result;
        }

        if (invitation.IsCancelled)
        {
            result.Errors.Add("This invitation has been cancelled");
            return result;
        }

        if (invitation.IsExpired)
        {
            result.Errors.Add("This invitation has expired");
            return result;
        }

        var existingUsername = await _context.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == command.Data.Username.ToLower(), cancellationToken);

        if (existingUsername != null)
        {
            result.Errors.Add("Username is already taken");
            return result;
        }

        var existingEmail = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == invitation.Email.ToLower(), cancellationToken);

        if (existingEmail != null)
        {
            result.Errors.Add("A user with this email already exists");
            return result;
        }

        var roleIds = UserInvitationExtensions.DeserializeRoleIds(invitation.RoleIds);
        var roles = await _context.Roles
            .Where(r => roleIds.Contains(r.RoleId))
            .ToListAsync(cancellationToken);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = command.Data.Username,
            Email = invitation.Email,
            PasswordHash = HashPassword(command.Data.Password),
            FirstName = command.Data.FirstName,
            LastName = command.Data.LastName,
            Status = UserStatus.Active,
            ActivatedAt = DateTime.UtcNow,
            ActivationMethod = ActivationMethod.EmailVerification,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            Roles = roles
        };

        _context.Users.Add(user);

        invitation.IsAccepted = true;
        invitation.AcceptedAt = DateTime.UtcNow;
        invitation.AcceptedByUserId = user.UserId;
        invitation.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == user.UserId, cancellationToken);

        result.Success = true;
        result.User = user!.ToDto();

        return result;
    }

    private static string HashPassword(string password)
    {
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[16];
        rng.GetBytes(salt);

        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 10000, HashAlgorithmName.SHA256, 32);

        var hashBytes = new byte[48];
        Array.Copy(salt, 0, hashBytes, 0, 16);
        Array.Copy(hash, 0, hashBytes, 16, 32);

        return Convert.ToBase64String(hashBytes);
    }
}
