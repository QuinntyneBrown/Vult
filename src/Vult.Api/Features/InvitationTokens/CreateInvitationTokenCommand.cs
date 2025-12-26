// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Core.Services.Authorization;
using Vult.Core;

namespace Vult.Api.Features.InvitationTokens;

[AuthorizeResourceOperation(Operations.Create, AggregateNames.InvitationToken)]
public class CreateInvitationTokenCommand : IRequest<InvitationTokenDto>
{
    public DateTime? Expiry { get; set; }
    public InvitationTokenType Type { get; set; } = InvitationTokenType.Standard;
}
