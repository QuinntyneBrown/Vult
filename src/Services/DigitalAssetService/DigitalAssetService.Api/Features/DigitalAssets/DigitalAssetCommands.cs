// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using DigitalAssetService.Api.Data;
using DigitalAssetService.Api.Model;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace DigitalAssetService.Api.Features.DigitalAssets;

public class UploadDigitalAssetCommand : IRequest<DigitalAssetDto>
{
    public string Name { get; set; } = string.Empty;
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = string.Empty;
    public float Height { get; set; }
    public float Width { get; set; }
}

public class UploadDigitalAssetCommandHandler : IRequestHandler<UploadDigitalAssetCommand, DigitalAssetDto>
{
    private readonly DigitalAssetDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<UploadDigitalAssetCommandHandler> _logger;

    public UploadDigitalAssetCommandHandler(
        DigitalAssetDbContext context,
        IEventPublisher eventPublisher,
        ILogger<UploadDigitalAssetCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<DigitalAssetDto> Handle(UploadDigitalAssetCommand request, CancellationToken cancellationToken)
    {
        var asset = new DigitalAsset
        {
            DigitalAssetId = Guid.NewGuid(),
            Name = request.Name,
            Bytes = request.Bytes,
            ContentType = request.ContentType,
            Height = request.Height,
            Width = request.Width,
            CreatedDate = DateTime.UtcNow
        };

        _context.DigitalAssets.Add(asset);
        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new DigitalAssetCreatedEvent
        {
            DigitalAssetId = asset.DigitalAssetId,
            Name = asset.Name,
            ContentType = asset.ContentType,
            Size = asset.Bytes.Length
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published DigitalAssetCreatedEvent for asset {AssetId}", asset.DigitalAssetId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish DigitalAssetCreatedEvent for asset {AssetId}", asset.DigitalAssetId);
        }

        return asset.ToDto();
    }
}

public class DeleteDigitalAssetCommand : IRequest<bool>
{
    public Guid DigitalAssetId { get; set; }
}

public class DeleteDigitalAssetCommandHandler : IRequestHandler<DeleteDigitalAssetCommand, bool>
{
    private readonly DigitalAssetDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<DeleteDigitalAssetCommandHandler> _logger;

    public DeleteDigitalAssetCommandHandler(
        DigitalAssetDbContext context,
        IEventPublisher eventPublisher,
        ILogger<DeleteDigitalAssetCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteDigitalAssetCommand request, CancellationToken cancellationToken)
    {
        var asset = await _context.DigitalAssets
            .FirstOrDefaultAsync(a => a.DigitalAssetId == request.DigitalAssetId, cancellationToken);

        if (asset == null)
        {
            return false;
        }

        _context.DigitalAssets.Remove(asset);
        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new DigitalAssetDeletedEvent
        {
            DigitalAssetId = asset.DigitalAssetId
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published DigitalAssetDeletedEvent for asset {AssetId}", asset.DigitalAssetId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish DigitalAssetDeletedEvent for asset {AssetId}", asset.DigitalAssetId);
        }

        return true;
    }
}
