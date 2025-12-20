// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.UserInvitations;

public class GetUserInvitationsQueryHandler : IRequestHandler<GetUserInvitationsQuery, GetUserInvitationsQueryResult>
{
    private readonly IVultContext _context;

    public GetUserInvitationsQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetUserInvitationsQueryResult> Handle(GetUserInvitationsQuery query, CancellationToken cancellationToken)
    {
        var queryable = _context.UserInvitations
            .Include(i => i.InvitedByUser)
            .AsQueryable();

        if (query.PendingOnly == true)
        {
            queryable = queryable.Where(i => !i.IsAccepted && !i.IsCancelled && i.ExpiresAt > DateTime.UtcNow);
        }

        if (!string.IsNullOrEmpty(query.SearchTerm))
        {
            var searchTermLower = query.SearchTerm.ToLower();
            queryable = queryable.Where(i => i.Email.ToLower().Contains(searchTermLower));
        }

        queryable = queryable.OrderByDescending(i => i.SentAt);

        var totalCount = await queryable.CountAsync(cancellationToken);

        var invitations = await queryable
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new GetUserInvitationsQueryResult
        {
            Invitations = invitations.Select(i => i.ToDto()).ToList(),
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}
