// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.InvitationTokens;

public class GetInvitationTokenByIdQueryHandler : IRequestHandler<GetInvitationTokenByIdQuery, InvitationTokenDto?>
{
    private readonly IVultContext _context;

    public GetInvitationTokenByIdQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<InvitationTokenDto?> Handle(GetInvitationTokenByIdQuery request, CancellationToken cancellationToken)
    {
        var token = await _context.InvitationTokens
            .FirstOrDefaultAsync(t => t.InvitationTokenId == request.InvitationTokenId, cancellationToken);

        return token?.ToDto();
    }
}
