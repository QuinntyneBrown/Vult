// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Api.Authorization;

namespace Vult.Api.Features.InvitationTokens;

[AuthorizeResourceOperation(Operations.Write, AggregateNames.InvitationToken)]
public class UpdateInvitationTokenExpiryCommand : IRequest<InvitationTokenDto?>
{
    public Guid InvitationTokenId { get; set; }
    public DateTime? Expiry { get; set; }
}
