// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;

namespace Vult.Api.Features.Auth;

public class AuthenticateRequest : IRequest<AuthenticateResponse>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthenticateRequestValidator : AbstractValidator<AuthenticateRequest>
{
    public AuthenticateRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().WithMessage("Username is required");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
    }
}
