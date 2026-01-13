// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using TestimonialService.Api.Model;

namespace TestimonialService.Api.Features.Testimonials;

public class TestimonialDto
{
    public Guid TestimonialId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}

public class CreateTestimonialDto
{
    public string CustomerName { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
}

public class UpdateTestimonialDto
{
    public string? CustomerName { get; set; }
    public string? PhotoUrl { get; set; }
    public int? Rating { get; set; }
    public string? Text { get; set; }
}

public static class TestimonialExtensions
{
    public static TestimonialDto ToDto(this Testimonial testimonial)
    {
        return new TestimonialDto
        {
            TestimonialId = testimonial.TestimonialId,
            CustomerName = testimonial.CustomerName,
            PhotoUrl = testimonial.PhotoUrl,
            Rating = testimonial.Rating,
            Text = testimonial.Text,
            CreatedDate = testimonial.CreatedDate,
            UpdatedDate = testimonial.UpdatedDate
        };
    }
}
