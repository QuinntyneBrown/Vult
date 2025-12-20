// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.UserInvitations;

public class CancelUserInvitationCommand : IRequest<CancelUserInvitationCommandResult>
{
    public Guid UserInvitationId { get; set; }
}

public class CancelUserInvitationCommandResult
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
