// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ProductService.Api.Data;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace ProductService.Api.Features.Products;

public class DeleteProductCommand : IRequest<bool>
{
    public Guid ProductId { get; set; }
}

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly ProductDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<DeleteProductCommandHandler> _logger;

    public DeleteProductCommandHandler(
        ProductDbContext context,
        IEventPublisher eventPublisher,
        ILogger<DeleteProductCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(x => x.ProductId == request.ProductId, cancellationToken);

        if (product == null)
        {
            return false;
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);

        // Publish integration event
        var integrationEvent = new ProductDeletedEvent
        {
            ProductId = product.ProductId
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published ProductDeletedEvent for product {ProductId}", product.ProductId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish ProductDeletedEvent for product {ProductId}", product.ProductId);
        }

        return true;
    }
}
