// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Vult.Core;

public class Privilege
{
    public Guid PrivilegeId { get; set; }
    public Guid RoleId { get; set; }
    public string Aggregate { get; set; } = string.Empty;
    public AccessRight AccessRight { get; set; }

    public Role? Role { get; set; }
}
