// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Testimonials;

public class GetTestimonialByIdQueryHandler : IRequestHandler<GetTestimonialByIdQuery, GetTestimonialByIdQueryResult>
{
    private readonly IVultContext _context;

    public GetTestimonialByIdQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetTestimonialByIdQueryResult> Handle(GetTestimonialByIdQuery query, CancellationToken cancellationToken)
    {
        var testimonial = await _context.Testimonials
            .FirstOrDefaultAsync(x => x.TestimonialId == query.TestimonialId, cancellationToken);

        return new GetTestimonialByIdQueryResult
        {
            Testimonial = testimonial?.ToDto()
        };
    }
}
