// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Core.Authorization;

namespace Vult.Api.Features.InvitationTokens;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.InvitationToken)]
public class GetInvitationTokensQuery : IRequest<GetInvitationTokensQueryResponse>
{
}

public class GetInvitationTokensQueryResponse
{
    public List<InvitationTokenDto> InvitationTokens { get; set; } = new();
}
