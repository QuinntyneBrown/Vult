// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace TestimonialService.Api.Model;

public class Testimonial
{
    public Guid TestimonialId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}
