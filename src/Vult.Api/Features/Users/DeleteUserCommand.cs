// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Users;

public class DeleteUserCommand : IRequest<DeleteUserCommandResult>
{
    public Guid UserId { get; set; }
    public DeleteUserDto Data { get; set; } = null!;
}

public class DeleteUserCommandResult
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
