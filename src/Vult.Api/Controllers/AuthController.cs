// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.Auth;
using Vult.Core;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthenticationService _authenticationService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthenticationService authenticationService, ILogger<AuthController> logger)
    {
        _authenticationService = authenticationService;
        _logger = logger;
    }

    /// <summary>
    /// Authenticates a user and returns JWT access and refresh tokens.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var token = await _authenticationService.AuthenticateAsync(request.Username, request.Password, cancellationToken);
        if (token == null)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        // For now, use the same JWT value as both access and refresh token
        var response = new LoginResponse
        {
            AccessToken = token,
            RefreshToken = token
        };

        return Ok(response);
    }

    /// <summary>
    /// Registers a new user account.
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _authenticationService.RegisterAsync(request.Username, request.Email, request.Password, cancellationToken);
        if (user == null)
        {
            return BadRequest(new { message = "Username or email already exists" });
        }

        _logger.LogInformation("User {Username} registered successfully", user.Username);

        return Created(string.Empty, new
        {
            user.UserId,
            user.Username,
            user.Email
        });
    }

    /// <summary>
    /// Refreshes an access token using a refresh token.
    /// </summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponse>> Refresh([FromBody] RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var newAccessToken = await _authenticationService.RefreshTokenAsync(request.RefreshToken, cancellationToken);
        if (newAccessToken == null)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token" });
        }

        var response = new LoginResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = request.RefreshToken
        };

        return Ok(response);
    }
}
