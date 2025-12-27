// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Testimonials;

public class UpdateTestimonialCommand : IRequest<UpdateTestimonialCommandResult>
{
    public UpdateTestimonialDto Testimonial { get; set; } = null!;
}

public class UpdateTestimonialCommandResult
{
    public TestimonialDto? Testimonial { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
