// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Users;

public class GetUserRolesQuery : IRequest<GetUserRolesQueryResult>
{
    public Guid UserId { get; set; }
}

public class GetUserRolesQueryResult
{
    public List<RoleDto> Roles { get; set; } = new();
    public bool UserFound { get; set; }
}
