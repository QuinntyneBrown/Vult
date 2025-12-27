// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.DigitalAssets;

public class DeleteDigitalAssetCommandHandler : IRequestHandler<DeleteDigitalAssetCommand, DeleteDigitalAssetCommandResult>
{
    private readonly IVultContext _context;

    public DeleteDigitalAssetCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<DeleteDigitalAssetCommandResult> Handle(DeleteDigitalAssetCommand command, CancellationToken cancellationToken)
    {
        var result = new DeleteDigitalAssetCommandResult();

        // Validate command
        if (command.DigitalAssetId == Guid.Empty)
        {
            result.Success = false;
            result.Errors.Add("DigitalAssetId is required");
            return result;
        }

        // Find existing asset
        var asset = await _context.DigitalAssets
            .FirstOrDefaultAsync(x => x.DigitalAssetId == command.DigitalAssetId, cancellationToken);

        if (asset == null)
        {
            result.Success = false;
            result.Errors.Add("Digital asset not found");
            return result;
        }

        // Delete asset
        _context.DigitalAssets.Remove(asset);
        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;

        return result;
    }
}
