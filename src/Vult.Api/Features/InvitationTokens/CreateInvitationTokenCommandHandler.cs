// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Cryptography;
using MediatR;
using Vult.Core;

namespace Vult.Api.Features.InvitationTokens;

public class CreateInvitationTokenCommandHandler : IRequestHandler<CreateInvitationTokenCommand, InvitationTokenDto>
{
    private readonly IVultContext _context;

    public CreateInvitationTokenCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<InvitationTokenDto> Handle(CreateInvitationTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenValue = GenerateSecureToken();

        var token = new InvitationToken
        {
            InvitationTokenId = Guid.NewGuid(),
            Value = tokenValue,
            Expiry = request.Expiry,
            Type = request.Type
        };

        _context.InvitationTokens.Add(token);
        await _context.SaveChangesAsync(cancellationToken);

        return token.ToDto();
    }

    private static string GenerateSecureToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes).Replace("+", "-").Replace("/", "_").TrimEnd('=');
    }
}
