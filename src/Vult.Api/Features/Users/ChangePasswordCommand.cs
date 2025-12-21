// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;

namespace Vult.Api.Features.Users;

public class ChangePasswordCommand : IRequest<bool>
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmationPassword { get; set; } = string.Empty;
}

public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.OldPassword).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6);
        RuleFor(x => x.NewPassword).Must((cmd, newPassword) => newPassword != cmd.OldPassword)
            .WithMessage("New password must be different from old password");
        RuleFor(x => x.ConfirmationPassword).NotEmpty()
            .Equal(x => x.NewPassword)
            .WithMessage("Password confirmation must match new password");
    }
}
