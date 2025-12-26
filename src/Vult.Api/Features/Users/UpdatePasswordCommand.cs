// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Vult.Core.Services.Authorization;

namespace Vult.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Write, AggregateNames.User)]
public class UpdatePasswordCommand : IRequest<bool>
{
    public Guid UserId { get; set; }
    public string Password { get; set; } = string.Empty;
}
