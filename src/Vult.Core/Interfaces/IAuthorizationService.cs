// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Models;

namespace Vult.Core.Interfaces;

public interface IAuthorizationService
{
    /// <summary>
    /// Checks if a user has a specific role
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="roleName">The role name to check</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if user has the role, false otherwise</returns>
    Task<bool> HasRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all roles for a user
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of role names</returns>
    Task<IEnumerable<string>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Assigns a role to a user
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="roleName">The role name to assign</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if role was assigned successfully, false otherwise</returns>
    Task<bool> AssignRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes a role from a user
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="roleName">The role name to remove</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if role was removed successfully, false otherwise</returns>
    Task<bool> RemoveRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default);
}
