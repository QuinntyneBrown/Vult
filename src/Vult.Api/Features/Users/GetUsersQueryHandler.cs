// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, GetUsersQueryResult>
{
    private readonly IVultContext _context;

    public GetUsersQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetUsersQueryResult> Handle(GetUsersQuery query, CancellationToken cancellationToken)
    {
        var queryable = _context.Users
            .Include(u => u.Roles)
            .AsQueryable();

        if (!string.IsNullOrEmpty(query.Status) && Enum.TryParse<UserStatus>(query.Status, true, out var status))
        {
            queryable = queryable.Where(u => u.Status == status);
        }

        if (!string.IsNullOrEmpty(query.SearchTerm))
        {
            var searchTermLower = query.SearchTerm.ToLower();
            queryable = queryable.Where(u =>
                u.Username.ToLower().Contains(searchTermLower) ||
                u.Email.ToLower().Contains(searchTermLower) ||
                (u.FirstName != null && u.FirstName.ToLower().Contains(searchTermLower)) ||
                (u.LastName != null && u.LastName.ToLower().Contains(searchTermLower)));
        }

        queryable = query.SortBy?.ToLower() switch
        {
            "username" => queryable.OrderBy(u => u.Username),
            "username_desc" => queryable.OrderByDescending(u => u.Username),
            "email" => queryable.OrderBy(u => u.Email),
            "email_desc" => queryable.OrderByDescending(u => u.Email),
            "created" => queryable.OrderBy(u => u.CreatedDate),
            "created_desc" => queryable.OrderByDescending(u => u.CreatedDate),
            "lastlogin" => queryable.OrderBy(u => u.LastLoginDate),
            "lastlogin_desc" => queryable.OrderByDescending(u => u.LastLoginDate),
            _ => queryable.OrderByDescending(u => u.CreatedDate)
        };

        var totalCount = await queryable.CountAsync(cancellationToken);

        var users = await queryable
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new GetUsersQueryResult
        {
            Users = users.Select(u => u.ToDto()).ToList(),
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}
