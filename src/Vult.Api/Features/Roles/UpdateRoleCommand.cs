// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Api.Authorization;
using Vult.Api.Features.Users;
using Vult.Core;

namespace Vult.Api.Features.Roles;

[AuthorizeResourceOperation(Operations.Write, AggregateNames.Role)]
public class UpdateRoleCommand : IRequest<RoleDto?>
{
    public Guid RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<UpdatePrivilegeDto> Privileges { get; set; } = new();
}

public class UpdatePrivilegeDto
{
    public Guid? PrivilegeId { get; set; }
    public string Aggregate { get; set; } = string.Empty;
    public AccessRight AccessRight { get; set; }
}
