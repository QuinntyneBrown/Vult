// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Api.Authorization;

namespace Vult.Api.Features.Roles;

[AuthorizeResourceOperation(Operations.Delete, AggregateNames.Role)]
public class DeleteRoleCommand : IRequest<bool>
{
    public Guid RoleId { get; set; }
}
