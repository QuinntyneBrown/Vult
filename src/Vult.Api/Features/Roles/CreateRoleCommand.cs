// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Api.Authorization;
using Vult.Api.Features.Users;
using Vult.Core;

namespace Vult.Api.Features.Roles;

[AuthorizeResourceOperation(Operations.Create, AggregateNames.Role)]
public class CreateRoleCommand : IRequest<RoleDto>
{
    public string Name { get; set; } = string.Empty;
    public List<CreatePrivilegeDto> Privileges { get; set; } = new();
}

public class CreatePrivilegeDto
{
    public string Aggregate { get; set; } = string.Empty;
    public AccessRight AccessRight { get; set; }
}
