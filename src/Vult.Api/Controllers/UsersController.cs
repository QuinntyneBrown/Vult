// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.Users;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IMediator mediator, ILogger<UsersController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Gets a paginated list of users
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(GetUsersQueryResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetUsersQueryResult>> GetUsers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetUsersQuery
        {
            PageNumber = pageNumber,
            PageSize = Math.Min(pageSize, 100),
            Status = status,
            SearchTerm = searchTerm,
            SortBy = sortBy
        };

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a single user by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(GetUserByIdQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetUserByIdQueryResult>> GetUserById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetUserByIdQuery { UserId = id };
        var result = await _mediator.Send(query, cancellationToken);

        if (!result.Found)
        {
            return NotFound(new { message = $"User with ID {id} not found" });
        }

        return Ok(result);
    }

    /// <summary>
    /// Gets the roles for a user
    /// </summary>
    [HttpGet("{id}/roles")]
    [ProducesResponseType(typeof(GetUserRolesQueryResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetUserRolesQueryResult>> GetUserRoles(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetUserRolesQuery { UserId = id };
        var result = await _mediator.Send(query, cancellationToken);

        if (!result.UserFound)
        {
            return NotFound(new { message = $"User with ID {id} not found" });
        }

        return Ok(result);
    }

    /// <summary>
    /// Updates an existing user
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UpdateUserCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UpdateUserCommandResult>> UpdateUser(
        Guid id,
        [FromBody] UpdateUserDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new UpdateUserCommand
        {
            UserId = id,
            User = dto
        };

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        return Ok(result);
    }

    /// <summary>
    /// Activates a user
    /// </summary>
    [HttpPost("{id}/activate")]
    [ProducesResponseType(typeof(ActivateUserCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ActivateUserCommandResult>> ActivateUser(
        Guid id,
        [FromBody] ActivateUserDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new ActivateUserCommand
        {
            UserId = id,
            Data = dto
        };

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        _logger.LogInformation("User {UserId} activated", id);
        return Ok(result);
    }

    /// <summary>
    /// Deactivates a user
    /// </summary>
    [HttpPost("{id}/deactivate")]
    [ProducesResponseType(typeof(DeactivateUserCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DeactivateUserCommandResult>> DeactivateUser(
        Guid id,
        [FromBody] DeactivateUserDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new DeactivateUserCommand
        {
            UserId = id,
            Data = dto
        };

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        _logger.LogInformation("User {UserId} deactivated. Reason: {Reason}", id, dto.Reason);
        return Ok(result);
    }

    /// <summary>
    /// Locks a user account
    /// </summary>
    [HttpPost("{id}/lock")]
    [ProducesResponseType(typeof(LockUserCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LockUserCommandResult>> LockUser(
        Guid id,
        [FromBody] LockUserDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new LockUserCommand
        {
            UserId = id,
            Data = dto
        };

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        _logger.LogInformation("User {UserId} locked. Reason: {Reason}", id, dto.Reason);
        return Ok(result);
    }

    /// <summary>
    /// Unlocks a user account
    /// </summary>
    [HttpPost("{id}/unlock")]
    [ProducesResponseType(typeof(UnlockUserCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UnlockUserCommandResult>> UnlockUser(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var command = new UnlockUserCommand { UserId = id };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        _logger.LogInformation("User {UserId} unlocked", id);
        return Ok(result);
    }

    /// <summary>
    /// Deletes a user (soft delete by default)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(
        Guid id,
        [FromBody] DeleteUserDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new DeleteUserCommand
        {
            UserId = id,
            Data = dto
        };

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        _logger.LogInformation("User {UserId} deleted. Type: {Type}, Reason: {Reason}",
            id, dto.HardDelete ? "Hard" : "Soft", dto.Reason);

        return NoContent();
    }

    /// <summary>
    /// Restores a soft-deleted user
    /// </summary>
    [HttpPost("{id}/restore")]
    [ProducesResponseType(typeof(RestoreUserCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RestoreUserCommandResult>> RestoreUser(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var command = new RestoreUserCommand { UserId = id };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        _logger.LogInformation("User {UserId} restored", id);
        return Ok(result);
    }
}
