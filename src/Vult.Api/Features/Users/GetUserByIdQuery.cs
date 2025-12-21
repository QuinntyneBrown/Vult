// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Api.Authorization;

namespace Vult.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.User)]
public class GetUserByIdQuery : IRequest<UserDto?>
{
    public Guid UserId { get; set; }
}
