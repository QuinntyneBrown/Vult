// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Api.Authorization;

namespace Vult.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Write, AggregateNames.User)]
public class UpdateUserCommand : IRequest<UserDto?>
{
    public Guid UserId { get; set; }
    public string? Username { get; set; }
    public List<string>? Roles { get; set; }
}
