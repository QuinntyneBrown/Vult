// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Core.Services.Authorization;

namespace Vult.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.User)]
public class GetUsersQuery : IRequest<GetUsersQueryResponse>
{
}

public class GetUsersQueryResponse
{
    public List<UserDto> Users { get; set; } = new();
}
