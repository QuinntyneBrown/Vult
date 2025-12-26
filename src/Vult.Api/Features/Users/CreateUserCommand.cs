// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Core.Services.Authorization;

namespace Vult.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Create, AggregateNames.User)]
public class CreateUserCommand : IRequest<UserDto>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
}
