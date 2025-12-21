// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.InvitationTokens;

public class GetInvitationTokensQueryHandler : IRequestHandler<GetInvitationTokensQuery, GetInvitationTokensQueryResponse>
{
    private readonly IVultContext _context;

    public GetInvitationTokensQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetInvitationTokensQueryResponse> Handle(GetInvitationTokensQuery request, CancellationToken cancellationToken)
    {
        var tokens = await _context.InvitationTokens.ToListAsync(cancellationToken);

        return new GetInvitationTokensQueryResponse
        {
            InvitationTokens = tokens.Select(t => t.ToDto()).ToList()
        };
    }
}
