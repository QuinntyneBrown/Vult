// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Api.Authorization;
using Vult.Api.Features.Users;

namespace Vult.Api.Features.Roles;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Role)]
public class GetRoleByIdQuery : IRequest<RoleDto?>
{
    public Guid RoleId { get; set; }
}
