// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Testimonials;

public class GetTestimonialsQuery : IRequest<GetTestimonialsQueryResult>
{
    private int _pageNumber = 1;
    private int _pageSize = 10;

    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = value >= 1 ? value : 1;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value switch
        {
            <= 0 => 10,
            > 100 => 100,
            _ => value
        };
    }

    public int? MinRating { get; set; }
    public string? SortBy { get; set; }
}

public class GetTestimonialsQueryResult
{
    public List<TestimonialDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
