// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.UserInvitations;

public class CancelUserInvitationCommandHandler : IRequestHandler<CancelUserInvitationCommand, CancelUserInvitationCommandResult>
{
    private readonly IVultContext _context;

    public CancelUserInvitationCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<CancelUserInvitationCommandResult> Handle(CancelUserInvitationCommand command, CancellationToken cancellationToken)
    {
        var result = new CancelUserInvitationCommandResult();

        var invitation = await _context.UserInvitations
            .FirstOrDefaultAsync(i => i.UserInvitationId == command.UserInvitationId, cancellationToken);

        if (invitation == null)
        {
            result.Errors.Add("Invitation not found");
            return result;
        }

        if (invitation.IsAccepted)
        {
            result.Errors.Add("Cannot cancel an already accepted invitation");
            return result;
        }

        if (invitation.IsCancelled)
        {
            result.Errors.Add("Invitation is already cancelled");
            return result;
        }

        invitation.IsCancelled = true;
        invitation.CancelledAt = DateTime.UtcNow;
        invitation.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;

        return result;
    }
}
