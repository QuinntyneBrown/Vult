// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.InvitationTokens;

public class UpdateInvitationTokenExpiryCommandHandler : IRequestHandler<UpdateInvitationTokenExpiryCommand, InvitationTokenDto?>
{
    private readonly IVultContext _context;

    public UpdateInvitationTokenExpiryCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<InvitationTokenDto?> Handle(UpdateInvitationTokenExpiryCommand request, CancellationToken cancellationToken)
    {
        var token = await _context.InvitationTokens
            .FirstOrDefaultAsync(t => t.InvitationTokenId == request.InvitationTokenId, cancellationToken);

        if (token == null)
        {
            return null;
        }

        token.Expiry = request.Expiry;
        await _context.SaveChangesAsync(cancellationToken);

        return token.ToDto();
    }
}
