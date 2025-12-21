// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Vult.Core;

namespace Vult.Api.Features.Users;

public class PrivilegeDto
{
    public Guid PrivilegeId { get; set; }
    public Guid RoleId { get; set; }
    public string Aggregate { get; set; } = string.Empty;
    public AccessRight AccessRight { get; set; }
}
