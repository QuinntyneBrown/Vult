// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserDto?>
{
    private readonly IVultContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentUserQueryHandler(IVultContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<UserDto?> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return null;
        }

        var user = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .FirstOrDefaultAsync(u => u.UserId == userId && !u.IsDeleted, cancellationToken);

        return user?.ToDto();
    }
}
