// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class ActivateUserCommandHandler : IRequestHandler<ActivateUserCommand, ActivateUserCommandResult>
{
    private readonly IVultContext _context;

    public ActivateUserCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<ActivateUserCommandResult> Handle(ActivateUserCommand command, CancellationToken cancellationToken)
    {
        var result = new ActivateUserCommandResult();

        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == command.UserId, cancellationToken);

        if (user == null)
        {
            result.Errors.Add("User not found");
            return result;
        }

        if (user.Status == UserStatus.Active)
        {
            result.Errors.Add("User is already active");
            return result;
        }

        if (user.Status == UserStatus.Deleted)
        {
            result.Errors.Add("Cannot activate a deleted user. Restore the user first.");
            return result;
        }

        if (!Enum.TryParse<ActivationMethod>(command.Data.ActivationMethod, true, out var activationMethod))
        {
            result.Errors.Add("Invalid activation method");
            return result;
        }

        user.Status = UserStatus.Active;
        user.ActivatedAt = DateTime.UtcNow;
        user.ActivationMethod = activationMethod;
        user.DeactivatedAt = null;
        user.DeactivationReason = null;
        user.LockedAt = null;
        user.LockReason = null;
        user.LockDurationTicks = null;
        user.FailedLoginAttempts = 0;
        user.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.User = user.ToDto();

        return result;
    }
}
