// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.Roles;
using Vult.Api.Features.Users;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/role")]
[Authorize]
public class RoleController : ControllerBase
{
    private readonly IMediator _mediator;

    public RoleController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<GetRolesQueryResponse>> GetRoles()
    {
        var response = await _mediator.Send(new GetRolesQuery());
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RoleDto>> GetById(Guid id)
    {
        var role = await _mediator.Send(new GetRoleByIdQuery { RoleId = id });
        if (role == null)
        {
            return NotFound();
        }
        return Ok(role);
    }

    [HttpPost]
    public async Task<ActionResult<RoleDto>> Create([FromBody] CreateRoleCommand command)
    {
        try
        {
            var role = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = role.RoleId }, role);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RoleDto>> Update(Guid id, [FromBody] UpdateRoleCommand command)
    {
        command.RoleId = id;
        try
        {
            var role = await _mediator.Send(command);
            if (role == null)
            {
                return NotFound();
            }
            return Ok(role);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteRoleCommand { RoleId = id });
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
