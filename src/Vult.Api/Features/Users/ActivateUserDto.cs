// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.ComponentModel.DataAnnotations;

namespace Vult.Api.Features.Users;

public class ActivateUserDto
{
    [Required]
    [StringLength(30)]
    public string ActivationMethod { get; set; } = "AdminManual";
}
