// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Testimonials;

public class GetTestimonialsQueryHandler : IRequestHandler<GetTestimonialsQuery, GetTestimonialsQueryResult>
{
    private readonly IVultContext _context;

    public GetTestimonialsQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetTestimonialsQueryResult> Handle(GetTestimonialsQuery query, CancellationToken cancellationToken)
    {
        var queryable = _context.Testimonials.AsQueryable();

        // Apply filters
        if (query.MinRating.HasValue)
        {
            queryable = queryable.Where(x => x.Rating >= query.MinRating.Value);
        }

        // Apply sorting
        queryable = query.SortBy?.ToLower() switch
        {
            "rating" => queryable.OrderBy(x => x.Rating),
            "rating_desc" => queryable.OrderByDescending(x => x.Rating),
            "date" => queryable.OrderBy(x => x.CreatedDate),
            "date_desc" => queryable.OrderByDescending(x => x.CreatedDate),
            "name" => queryable.OrderBy(x => x.CustomerName),
            "name_desc" => queryable.OrderByDescending(x => x.CustomerName),
            _ => queryable.OrderByDescending(x => x.CreatedDate) // Default sort
        };

        var totalCount = await queryable.CountAsync(cancellationToken);

        var items = await queryable
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new GetTestimonialsQueryResult
        {
            Items = items.Select(x => x.ToDto()).ToList(),
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }
}
