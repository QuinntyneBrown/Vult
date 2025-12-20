// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Users;

public class ActivateUserCommand : IRequest<ActivateUserCommandResult>
{
    public Guid UserId { get; set; }
    public ActivateUserDto Data { get; set; } = null!;
}

public class ActivateUserCommandResult
{
    public UserDto? User { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
