// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Users;

public class UpdateUserCommand : IRequest<UpdateUserCommandResult>
{
    public Guid UserId { get; set; }
    public UpdateUserDto User { get; set; } = null!;
}

public class UpdateUserCommandResult
{
    public UserDto? User { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
