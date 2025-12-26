// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Core.Services.Authorization;

namespace Vult.Api.Features.InvitationTokens;

[AuthorizeResourceOperation(Operations.Delete, AggregateNames.InvitationToken)]
public class DeleteInvitationTokenCommand : IRequest<bool>
{
    public Guid InvitationTokenId { get; set; }
}
