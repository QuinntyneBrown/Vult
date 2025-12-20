// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.UserInvitations;

public class SendUserInvitationCommand : IRequest<SendUserInvitationCommandResult>
{
    public SendUserInvitationDto Invitation { get; set; } = null!;
    public Guid InvitedByUserId { get; set; }
}

public class SendUserInvitationCommandResult
{
    public UserInvitationDto? Invitation { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
