// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Vult.Api.Features.Users;

namespace Vult.Api.Features.UserInvitations;

public class AcceptUserInvitationCommand : IRequest<AcceptUserInvitationCommandResult>
{
    public AcceptUserInvitationDto Data { get; set; } = null!;
}

public class AcceptUserInvitationCommandResult
{
    public UserDto? User { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
