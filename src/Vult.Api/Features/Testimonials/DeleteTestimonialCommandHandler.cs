// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Testimonials;

public class DeleteTestimonialCommandHandler : IRequestHandler<DeleteTestimonialCommand, DeleteTestimonialCommandResult>
{
    private readonly IVultContext _context;

    public DeleteTestimonialCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<DeleteTestimonialCommandResult> Handle(DeleteTestimonialCommand command, CancellationToken cancellationToken)
    {
        var result = new DeleteTestimonialCommandResult();

        // Validate command
        if (command.TestimonialId == Guid.Empty)
        {
            result.Success = false;
            result.Errors.Add("TestimonialId is required");
            return result;
        }

        // Find existing testimonial
        var testimonial = await _context.Testimonials
            .FirstOrDefaultAsync(x => x.TestimonialId == command.TestimonialId, cancellationToken);

        if (testimonial == null)
        {
            result.Success = false;
            result.Errors.Add("Testimonial not found");
            return result;
        }

        // Delete testimonial
        _context.Testimonials.Remove(testimonial);
        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;

        return result;
    }
}
