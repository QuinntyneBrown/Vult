// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.InvitationTokens;

public class DeleteInvitationTokenCommandHandler : IRequestHandler<DeleteInvitationTokenCommand, bool>
{
    private readonly IVultContext _context;

    public DeleteInvitationTokenCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteInvitationTokenCommand request, CancellationToken cancellationToken)
    {
        var token = await _context.InvitationTokens
            .FirstOrDefaultAsync(t => t.InvitationTokenId == request.InvitationTokenId, cancellationToken);

        if (token == null)
        {
            return false;
        }

        _context.InvitationTokens.Remove(token);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
