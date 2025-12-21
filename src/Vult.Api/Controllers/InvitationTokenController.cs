// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vult.Api.Features.InvitationTokens;

namespace Vult.Api.Controllers;

[ApiController]
[Route("api/invitation-token")]
[Authorize]
public class InvitationTokenController : ControllerBase
{
    private readonly IMediator _mediator;

    public InvitationTokenController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<GetInvitationTokensQueryResponse>> GetAll()
    {
        var response = await _mediator.Send(new GetInvitationTokensQuery());
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InvitationTokenDto>> GetById(Guid id)
    {
        var token = await _mediator.Send(new GetInvitationTokenByIdQuery { InvitationTokenId = id });
        if (token == null)
        {
            return NotFound();
        }
        return Ok(token);
    }

    [HttpPost]
    public async Task<ActionResult<InvitationTokenDto>> Create([FromBody] CreateInvitationTokenCommand command)
    {
        var token = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = token.InvitationTokenId }, token);
    }

    [HttpPut("{id:guid}/expiry")]
    public async Task<ActionResult<InvitationTokenDto>> UpdateExpiry(Guid id, [FromBody] UpdateInvitationTokenExpiryCommand command)
    {
        command.InvitationTokenId = id;
        var token = await _mediator.Send(command);
        if (token == null)
        {
            return NotFound();
        }
        return Ok(token);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteInvitationTokenCommand { InvitationTokenId = id });
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
