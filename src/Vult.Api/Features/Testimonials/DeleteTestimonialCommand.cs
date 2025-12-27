// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Testimonials;

public class DeleteTestimonialCommand : IRequest<DeleteTestimonialCommandResult>
{
    public Guid TestimonialId { get; set; }

    public DeleteTestimonialCommand(Guid testimonialId)
    {
        TestimonialId = testimonialId;
    }
}

public class DeleteTestimonialCommandResult
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
