using Vult.Core.Models;

namespace Vult.Core.Interfaces;

public interface IAuthenticationService
{
    /// <summary>
    /// Authenticates a user with username and password
    /// </summary>
    /// <param name="username">The username</param>
    /// <param name="password">The plain text password</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>JWT token if authentication succeeds, null otherwise</returns>
    Task<string?> AuthenticateAsync(string username, string password, CancellationToken cancellationToken = default);

    /// <summary>
    /// Registers a new user
    /// </summary>
    /// <param name="username">The username</param>
    /// <param name="email">The email address</param>
    /// <param name="password">The plain text password</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The created user or null if registration fails</returns>
    Task<User?> RegisterAsync(string username, string email, string password, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates a JWT token
    /// </summary>
    /// <param name="token">The JWT token to validate</param>
    /// <returns>True if token is valid, false otherwise</returns>
    bool ValidateToken(string token);

    /// <summary>
    /// Gets user ID from JWT token
    /// </summary>
    /// <param name="token">The JWT token</param>
    /// <returns>User ID if token is valid, null otherwise</returns>
    Guid? GetUserIdFromToken(string token);
}
