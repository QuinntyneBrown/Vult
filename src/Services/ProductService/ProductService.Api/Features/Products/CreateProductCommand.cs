// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using ProductService.Api.Data;
using ProductService.Api.Model;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace ProductService.Api.Features.Products;

public class CreateProductCommand : IRequest<ProductDto>
{
    public CreateProductDto Product { get; set; } = null!;
}

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly ProductDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<CreateProductCommandHandler> _logger;

    public CreateProductCommandHandler(
        ProductDbContext context,
        IEventPublisher eventPublisher,
        ILogger<CreateProductCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            ProductId = Guid.NewGuid(),
            Name = request.Product.Name,
            EstimatedMSRP = request.Product.EstimatedMSRP,
            EstimatedResaleValue = request.Product.EstimatedResaleValue,
            Description = request.Product.Description,
            ShortDescription = request.Product.ShortDescription,
            Size = request.Product.Size,
            BrandName = request.Product.BrandName,
            Gender = request.Product.Gender,
            ItemType = request.Product.ItemType,
            IsFeatured = request.Product.IsFeatured,
            Benefits = request.Product.Benefits,
            Details = request.Product.Details,
            Shipping = request.Product.Shipping,
            PromotionalMessage = request.Product.PromotionalMessage,
            IsMemberExclusive = request.Product.IsMemberExclusive,
            IsNew = request.Product.IsNew,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        // Publish integration event
        var integrationEvent = new ProductCreatedEvent
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
            _logger.LogInformation("Published ProductCreatedEvent for product {ProductId}", product.ProductId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish ProductCreatedEvent for product {ProductId}", product.ProductId);
        }

        return product.ToDto();
    }
}
