// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class UnlockUserCommandHandler : IRequestHandler<UnlockUserCommand, UnlockUserCommandResult>
{
    private readonly IVultContext _context;

    public UnlockUserCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<UnlockUserCommandResult> Handle(UnlockUserCommand command, CancellationToken cancellationToken)
    {
        var result = new UnlockUserCommandResult();

        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == command.UserId, cancellationToken);

        if (user == null)
        {
            result.Errors.Add("User not found");
            return result;
        }

        if (user.Status != UserStatus.Locked)
        {
            result.Errors.Add("User is not locked");
            return result;
        }

        user.Status = UserStatus.Active;
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
