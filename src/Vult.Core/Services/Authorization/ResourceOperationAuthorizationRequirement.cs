// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Authorization;

namespace Vult.Core.Services.Authorization;

public class ResourceOperationAuthorizationRequirement : IAuthorizationRequirement
{
    public string Name { get; set; } = string.Empty;
    public string Resource { get; set; } = string.Empty;
}
