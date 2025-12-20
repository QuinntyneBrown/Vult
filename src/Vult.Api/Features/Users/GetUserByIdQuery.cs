// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Users;

public class GetUserByIdQuery : IRequest<GetUserByIdQueryResult>
{
    public Guid UserId { get; set; }
}

public class GetUserByIdQueryResult
{
    public UserDto? User { get; set; }
    public bool Found { get; set; }
}
