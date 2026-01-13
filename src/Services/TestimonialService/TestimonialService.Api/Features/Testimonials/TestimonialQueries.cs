// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using TestimonialService.Api.Data;

namespace TestimonialService.Api.Features.Testimonials;

public class GetTestimonialsQuery : IRequest<GetTestimonialsQueryResult>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? MinRating { get; set; }
    public string? SortBy { get; set; }
}

public class GetTestimonialsQueryResult
{
    public List<TestimonialDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}

public class GetTestimonialsQueryHandler : IRequestHandler<GetTestimonialsQuery, GetTestimonialsQueryResult>
{
    private readonly TestimonialDbContext _context;

    public GetTestimonialsQueryHandler(TestimonialDbContext context)
    {
        _context = context;
    }

    public async Task<GetTestimonialsQueryResult> Handle(GetTestimonialsQuery query, CancellationToken cancellationToken)
    {
        var queryable = _context.Testimonials.AsQueryable();

        if (query.MinRating.HasValue)
        {
            queryable = queryable.Where(t => t.Rating >= query.MinRating.Value);
        }

        queryable = query.SortBy?.ToLower() switch
        {
            "rating" => queryable.OrderBy(t => t.Rating),
            "rating_desc" => queryable.OrderByDescending(t => t.Rating),
            "date" => queryable.OrderBy(t => t.CreatedDate),
            "date_desc" => queryable.OrderByDescending(t => t.CreatedDate),
            _ => queryable.OrderByDescending(t => t.CreatedDate)
        };

        var totalCount = await queryable.CountAsync(cancellationToken);

        var items = await queryable
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new GetTestimonialsQueryResult
        {
            Items = items.Select(t => t.ToDto()).ToList(),
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}

public class GetTestimonialByIdQuery : IRequest<TestimonialDto?>
{
    public Guid TestimonialId { get; set; }
}

public class GetTestimonialByIdQueryHandler : IRequestHandler<GetTestimonialByIdQuery, TestimonialDto?>
{
    private readonly TestimonialDbContext _context;

    public GetTestimonialByIdQueryHandler(TestimonialDbContext context)
    {
        _context = context;
    }

    public async Task<TestimonialDto?> Handle(GetTestimonialByIdQuery request, CancellationToken cancellationToken)
    {
        var testimonial = await _context.Testimonials
            .FirstOrDefaultAsync(t => t.TestimonialId == request.TestimonialId, cancellationToken);

        return testimonial?.ToDto();
    }
}
