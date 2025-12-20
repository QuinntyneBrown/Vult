// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class LockUserCommandHandler : IRequestHandler<LockUserCommand, LockUserCommandResult>
{
    private readonly IVultContext _context;

    public LockUserCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<LockUserCommandResult> Handle(LockUserCommand command, CancellationToken cancellationToken)
    {
        var result = new LockUserCommandResult();

        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == command.UserId, cancellationToken);

        if (user == null)
        {
            result.Errors.Add("User not found");
            return result;
        }

        if (user.Status == UserStatus.Locked)
        {
            result.Errors.Add("User is already locked");
            return result;
        }

        if (user.Status == UserStatus.Deleted)
        {
            result.Errors.Add("Cannot lock a deleted user");
            return result;
        }

        if (string.IsNullOrWhiteSpace(command.Data.Reason))
        {
            result.Errors.Add("Reason is required for locking");
            return result;
        }

        user.Status = UserStatus.Locked;
        user.LockedAt = DateTime.UtcNow;
        user.LockReason = command.Data.Reason;

        if (command.Data.DurationMinutes.HasValue && command.Data.DurationMinutes.Value > 0)
        {
            user.LockDurationTicks = TimeSpan.FromMinutes(command.Data.DurationMinutes.Value).Ticks;
        }
        else
        {
            user.LockDurationTicks = null;
        }

        user.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.User = user.ToDto();

        return result;
    }
}
