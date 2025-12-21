// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Vult.Core;

namespace Vult.Api.Features.InvitationTokens;

public static class InvitationTokenExtensions
{
    public static InvitationTokenDto ToDto(this InvitationToken token)
    {
        return new InvitationTokenDto
        {
            InvitationTokenId = token.InvitationTokenId,
            Value = token.Value,
            Expiry = token.Expiry,
            Type = token.Type
        };
    }
}
