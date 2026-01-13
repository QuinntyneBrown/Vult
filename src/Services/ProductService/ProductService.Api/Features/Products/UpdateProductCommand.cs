// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ProductService.Api.Data;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace ProductService.Api.Features.Products;

public class UpdateProductCommand : IRequest<ProductDto?>
{
    public Guid ProductId { get; set; }
    public UpdateProductDto Product { get; set; } = null!;
}

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto?>
{
    private readonly ProductDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<UpdateProductCommandHandler> _logger;

    public UpdateProductCommandHandler(
        ProductDbContext context,
        IEventPublisher eventPublisher,
        ILogger<UpdateProductCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<ProductDto?> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(x => x.ProductImages)
            .FirstOrDefaultAsync(x => x.ProductId == request.ProductId, cancellationToken);

        if (product == null)
        {
            return null;
        }

        product.Name = request.Product.Name;
        product.EstimatedMSRP = request.Product.EstimatedMSRP;
        product.EstimatedResaleValue = request.Product.EstimatedResaleValue;
        product.Description = request.Product.Description;
        product.ShortDescription = request.Product.ShortDescription;
        product.Size = request.Product.Size;
        product.BrandName = request.Product.BrandName;
        product.Gender = request.Product.Gender;
        product.ItemType = request.Product.ItemType;
        product.IsFeatured = request.Product.IsFeatured;
        product.Benefits = request.Product.Benefits;
        product.Details = request.Product.Details;
        product.Shipping = request.Product.Shipping;
        product.PromotionalMessage = request.Product.PromotionalMessage;
        product.IsMemberExclusive = request.Product.IsMemberExclusive;
        product.IsNew = request.Product.IsNew;
        product.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Publish integration event
        var integrationEvent = new ProductUpdatedEvent
        {
            ProductId = product.ProductId,
            Name = product.Name,
            EstimatedMSRP = product.EstimatedMSRP,
            EstimatedResaleValue = product.EstimatedResaleValue,
            BrandName = product.BrandName,
            IsFeatured = product.IsFeatured
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published ProductUpdatedEvent for product {ProductId}", product.ProductId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish ProductUpdatedEvent for product {ProductId}", product.ProductId);
        }

        return product.ToDto();
    }
}
