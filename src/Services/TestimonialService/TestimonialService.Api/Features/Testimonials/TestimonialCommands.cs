// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using TestimonialService.Api.Data;
using TestimonialService.Api.Model;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace TestimonialService.Api.Features.Testimonials;

public class CreateTestimonialCommand : IRequest<TestimonialDto>
{
    public CreateTestimonialDto Testimonial { get; set; } = null!;
}

public class CreateTestimonialCommandHandler : IRequestHandler<CreateTestimonialCommand, TestimonialDto>
{
    private readonly TestimonialDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<CreateTestimonialCommandHandler> _logger;

    public CreateTestimonialCommandHandler(
        TestimonialDbContext context,
        IEventPublisher eventPublisher,
        ILogger<CreateTestimonialCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<TestimonialDto> Handle(CreateTestimonialCommand request, CancellationToken cancellationToken)
    {
        var testimonial = new Testimonial
        {
            TestimonialId = Guid.NewGuid(),
            CustomerName = request.Testimonial.CustomerName,
            PhotoUrl = request.Testimonial.PhotoUrl ?? string.Empty,
            Rating = Math.Clamp(request.Testimonial.Rating, 1, 5),
            Text = request.Testimonial.Text,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _context.Testimonials.Add(testimonial);
        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new TestimonialCreatedEvent
        {
            TestimonialId = testimonial.TestimonialId,
            CustomerName = testimonial.CustomerName,
            Rating = testimonial.Rating,
            Text = testimonial.Text
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published TestimonialCreatedEvent for testimonial {TestimonialId}", testimonial.TestimonialId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish TestimonialCreatedEvent for testimonial {TestimonialId}", testimonial.TestimonialId);
        }

        return testimonial.ToDto();
    }
}

public class UpdateTestimonialCommand : IRequest<TestimonialDto?>
{
    public Guid TestimonialId { get; set; }
    public UpdateTestimonialDto Testimonial { get; set; } = null!;
}

public class UpdateTestimonialCommandHandler : IRequestHandler<UpdateTestimonialCommand, TestimonialDto?>
{
    private readonly TestimonialDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<UpdateTestimonialCommandHandler> _logger;

    public UpdateTestimonialCommandHandler(
        TestimonialDbContext context,
        IEventPublisher eventPublisher,
        ILogger<UpdateTestimonialCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<TestimonialDto?> Handle(UpdateTestimonialCommand request, CancellationToken cancellationToken)
    {
        var testimonial = await _context.Testimonials
            .FirstOrDefaultAsync(t => t.TestimonialId == request.TestimonialId, cancellationToken);

        if (testimonial == null)
        {
            return null;
        }

        if (request.Testimonial.CustomerName != null) testimonial.CustomerName = request.Testimonial.CustomerName;
        if (request.Testimonial.PhotoUrl != null) testimonial.PhotoUrl = request.Testimonial.PhotoUrl;
        if (request.Testimonial.Rating.HasValue) testimonial.Rating = Math.Clamp(request.Testimonial.Rating.Value, 1, 5);
        if (request.Testimonial.Text != null) testimonial.Text = request.Testimonial.Text;

        testimonial.UpdatedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new TestimonialUpdatedEvent
        {
            TestimonialId = testimonial.TestimonialId,
            CustomerName = testimonial.CustomerName,
            Rating = testimonial.Rating,
            Text = testimonial.Text
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published TestimonialUpdatedEvent for testimonial {TestimonialId}", testimonial.TestimonialId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish TestimonialUpdatedEvent for testimonial {TestimonialId}", testimonial.TestimonialId);
        }

        return testimonial.ToDto();
    }
}

public class DeleteTestimonialCommand : IRequest<bool>
{
    public Guid TestimonialId { get; set; }
}

public class DeleteTestimonialCommandHandler : IRequestHandler<DeleteTestimonialCommand, bool>
{
    private readonly TestimonialDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<DeleteTestimonialCommandHandler> _logger;

    public DeleteTestimonialCommandHandler(
        TestimonialDbContext context,
        IEventPublisher eventPublisher,
        ILogger<DeleteTestimonialCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteTestimonialCommand request, CancellationToken cancellationToken)
    {
        var testimonial = await _context.Testimonials
            .FirstOrDefaultAsync(t => t.TestimonialId == request.TestimonialId, cancellationToken);

        if (testimonial == null)
        {
            return false;
        }

        _context.Testimonials.Remove(testimonial);
        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new TestimonialDeletedEvent
        {
            TestimonialId = testimonial.TestimonialId
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published TestimonialDeletedEvent for testimonial {TestimonialId}", testimonial.TestimonialId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish TestimonialDeletedEvent for testimonial {TestimonialId}", testimonial.TestimonialId);
        }

        return true;
    }
}
