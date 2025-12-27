// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core.Model.TestimonialAggregate;

namespace Vult.Api.Features.Testimonials;

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

    public static Testimonial ToTestimonial(this CreateTestimonialDto dto)
    {
        return new Testimonial
        {
            TestimonialId = Guid.NewGuid(),
            CustomerName = dto.CustomerName,
            PhotoUrl = dto.PhotoUrl,
            Rating = dto.Rating,
            Text = dto.Text,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
    }

    public static void UpdateFromDto(this Testimonial testimonial, UpdateTestimonialDto dto)
    {
        testimonial.CustomerName = dto.CustomerName;
        testimonial.PhotoUrl = dto.PhotoUrl;
        testimonial.Rating = dto.Rating;
        testimonial.Text = dto.Text;
        testimonial.UpdatedDate = DateTime.UtcNow;
    }
}
