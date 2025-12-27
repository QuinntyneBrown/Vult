// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Testimonials;

public class GetTestimonialByIdQuery : IRequest<GetTestimonialByIdQueryResult>
{
    public Guid TestimonialId { get; set; }

    public GetTestimonialByIdQuery(Guid testimonialId)
    {
        TestimonialId = testimonialId;
    }
}

public class GetTestimonialByIdQueryResult
{
    public TestimonialDto? Testimonial { get; set; }
}
