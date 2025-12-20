// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.Security.Cryptography;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.UserInvitations;

public class SendUserInvitationCommandHandler : IRequestHandler<SendUserInvitationCommand, SendUserInvitationCommandResult>
{
    private readonly IVultContext _context;

    public SendUserInvitationCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<SendUserInvitationCommandResult> Handle(SendUserInvitationCommand command, CancellationToken cancellationToken)
    {
        var result = new SendUserInvitationCommandResult();

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == command.Invitation.Email.ToLower(), cancellationToken);

        if (existingUser != null)
        {
            result.Errors.Add("A user with this email already exists");
            return result;
        }

        var existingInvitation = await _context.UserInvitations
            .FirstOrDefaultAsync(i =>
                i.Email.ToLower() == command.Invitation.Email.ToLower() &&
                !i.IsAccepted &&
                !i.IsCancelled &&
                i.ExpiresAt > DateTime.UtcNow,
                cancellationToken);

        if (existingInvitation != null)
        {
            result.Errors.Add("A pending invitation for this email already exists");
            return result;
        }

        var token = GenerateInvitationToken();

        var invitation = new UserInvitation
        {
            UserInvitationId = Guid.NewGuid(),
            Email = command.Invitation.Email,
            Token = token,
            InvitedByUserId = command.InvitedByUserId,
            SentAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsAccepted = false,
            IsCancelled = false,
            RoleIds = UserInvitationExtensions.SerializeRoleIds(command.Invitation.RoleIds),
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _context.UserInvitations.Add(invitation);
        await _context.SaveChangesAsync(cancellationToken);

        invitation = await _context.UserInvitations
            .Include(i => i.InvitedByUser)
            .FirstOrDefaultAsync(i => i.UserInvitationId == invitation.UserInvitationId, cancellationToken);

        result.Success = true;
        result.Invitation = invitation!.ToDto();

        return result;
    }

    private static string GenerateInvitationToken()
    {
        var bytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").TrimEnd('=');
    }
}
