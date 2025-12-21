// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.Auth;
using Vult.Api.Features.Users;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("token")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthenticateResponse>> Token([FromBody] AuthenticateRequest request)
    {
        try
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrent()
    {
        var user = await _mediator.Send(new GetCurrentUserQuery());
        if (user == null)
        {
            return Unauthorized();
        }
        return Ok(user);
    }

    [HttpGet("exists/{username}")]
    [AllowAnonymous]
    public async Task<ActionResult<bool>> CheckUsernameExists(string username)
    {
        var exists = await _mediator.Send(new CheckUsernameExistsQuery { Username = username });
        return Ok(exists);
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
    {
        try
        {
            await _mediator.Send(command);
            return Ok();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<GetUsersQueryResponse>> GetUsers()
    {
        var response = await _mediator.Send(new GetUsersQuery());
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetById(Guid id)
    {
        var user = await _mediator.Send(new GetUserByIdQuery { UserId = id });
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserCommand command)
    {
        try
        {
            var user = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = user.UserId }, user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Update(Guid id, [FromBody] UpdateUserCommand command)
    {
        command.UserId = id;
        try
        {
            var user = await _mediator.Send(command);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteUserCommand { UserId = id });
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpPut("{id:guid}/password")]
    [Authorize]
    public async Task<ActionResult> UpdatePassword(Guid id, [FromBody] UpdatePasswordCommand command)
    {
        command.UserId = id;
        var result = await _mediator.Send(command);
        if (!result)
        {
            return NotFound();
        }
        return Ok();
    }
}
