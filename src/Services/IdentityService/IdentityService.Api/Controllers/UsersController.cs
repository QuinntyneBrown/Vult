// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.Security.Claims;
using IdentityService.Api.Features.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("token")]
    public async Task<ActionResult<LoginResultDto>> Login([FromBody] LoginDto dto)
    {
        var command = new LoginCommand
        {
            Username = dto.Username,
            Password = dto.Password
        };

        var result = await _mediator.Send(command);

        if (result == null)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        return Ok(result);
    }

    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetUserByIdQuery { UserId = userId };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<UserDto>>> GetUsers([FromQuery] bool includeDeleted = false)
    {
        var query = new GetUsersQuery { IncludeDeleted = includeDeleted };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        var query = new GetUserByIdQuery { UserId = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("exists/{username}")]
    public async Task<ActionResult<bool>> UserExists(string username)
    {
        var query = new GetUsersQuery();
        var users = await _mediator.Send(query);
        var exists = users.Any(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
        return Ok(exists);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
    {
        var command = new CreateUserCommand { User = dto };
        var result = await _mediator.Send(command);

        if (result == null)
        {
            return BadRequest(new { message = "Username already exists" });
        }

        return CreatedAtAction(nameof(GetUser), new { id = result.UserId }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UserDto>> UpdateUser(Guid id, [FromBody] UpdateUserDto dto)
    {
        var command = new UpdateUserCommand { UserId = id, User = dto };
        var result = await _mediator.Send(command);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> DeleteUser(Guid id)
    {
        var command = new DeleteUserCommand { UserId = id };
        var result = await _mediator.Send(command);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var command = new ChangePasswordCommand
        {
            UserId = userId,
            CurrentPassword = dto.CurrentPassword,
            NewPassword = dto.NewPassword
        };

        var result = await _mediator.Send(command);

        if (!result)
        {
            return BadRequest(new { message = "Failed to change password" });
        }

        return Ok(new { message = "Password changed successfully" });
    }
}
