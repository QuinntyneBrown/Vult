// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Vult.Core;

namespace Vult.Api.Features.Testimonials;

public class CreateTestimonialCommandHandler : IRequestHandler<CreateTestimonialCommand, CreateTestimonialCommandResult>
{
    private readonly IVultContext _context;

    public CreateTestimonialCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<CreateTestimonialCommandResult> Handle(CreateTestimonialCommand command, CancellationToken cancellationToken)
    {
        var result = new CreateTestimonialCommandResult();

        // Validate command
        var errors = ValidateCommand(command);
        if (errors.Any())
        {
            result.Success = false;
            result.Errors = errors;
            return result;
        }

        // Create testimonial
        var testimonial = command.Testimonial.ToTestimonial();

        _context.Testimonials.Add(testimonial);
        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.Testimonial = testimonial.ToDto();

        return result;
    }

    private List<string> ValidateCommand(CreateTestimonialCommand command)
    {
        var errors = new List<string>();

        if (command.Testimonial == null)
        {
            errors.Add("Testimonial is required");
            return errors;
        }

        if (string.IsNullOrWhiteSpace(command.Testimonial.CustomerName))
        {
            errors.Add("Customer name is required");
        }
        else if (command.Testimonial.CustomerName.Length > 100)
        {
            errors.Add("Customer name cannot exceed 100 characters");
        }

        if (string.IsNullOrWhiteSpace(command.Testimonial.PhotoUrl))
        {
            errors.Add("Photo URL is required");
        }
        else if (command.Testimonial.PhotoUrl.Length > 500)
        {
            errors.Add("Photo URL cannot exceed 500 characters");
        }

        if (command.Testimonial.Rating < 1 || command.Testimonial.Rating > 5)
        {
            errors.Add("Rating must be between 1 and 5");
        }

        if (string.IsNullOrWhiteSpace(command.Testimonial.Text))
        {
            errors.Add("Testimonial text is required");
        }
        else if (command.Testimonial.Text.Length > 1000)
        {
            errors.Add("Testimonial text cannot exceed 1000 characters");
        }

        return errors;
    }
}
