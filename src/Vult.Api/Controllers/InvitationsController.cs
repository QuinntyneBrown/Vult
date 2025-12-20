// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.UserInvitations;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvitationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<InvitationsController> _logger;

    public InvitationsController(IMediator mediator, ILogger<InvitationsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Gets a paginated list of invitations
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(GetUserInvitationsQueryResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetUserInvitationsQueryResult>> GetInvitations(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] bool? pendingOnly = null,
        [FromQuery] string? searchTerm = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetUserInvitationsQuery
        {
            PageNumber = pageNumber,
            PageSize = Math.Min(pageSize, 100),
            PendingOnly = pendingOnly,
            SearchTerm = searchTerm
        };

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Sends a new user invitation
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(SendUserInvitationCommandResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SendUserInvitationCommandResult>> SendInvitation(
        [FromBody] SendUserInvitationDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();
        if (userId == Guid.Empty)
        {
            return Unauthorized(new { message = "Unable to identify current user" });
        }

        var command = new SendUserInvitationCommand
        {
            Invitation = dto,
            InvitedByUserId = userId
        };

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(new { errors = result.Errors });
        }

        _logger.LogInformation("User invitation sent to {Email} by user {UserId}", dto.Email, userId);

        return CreatedAtAction(nameof(GetInvitations), result);
    }

    /// <summary>
    /// Accepts a user invitation and creates a new user account
    /// </summary>
    [HttpPost("accept")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AcceptUserInvitationCommandResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AcceptUserInvitationCommandResult>> AcceptInvitation(
        [FromBody] AcceptUserInvitationDto dto,
        CancellationToken cancellationToken = default)
    {
        var command = new AcceptUserInvitationCommand { Data = dto };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            return BadRequest(new { errors = result.Errors });
        }

        _logger.LogInformation("Invitation accepted. New user created: {Username}", dto.Username);

        return Ok(result);
    }

    /// <summary>
    /// Cancels a pending invitation
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelInvitation(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var command = new CancelUserInvitationCommand { UserInvitationId = id };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.Success)
        {
            if (result.Errors.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            {
                return NotFound(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        _logger.LogInformation("Invitation {InvitationId} cancelled", id);

        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (Guid.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }

        return Guid.Empty;
    }
}
