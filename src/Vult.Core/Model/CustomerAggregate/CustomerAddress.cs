// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Model.CustomerAggregate;

public class CustomerAddress
{
    public Guid CustomerAddressId { get; set; }
    public Guid CustomerId { get; set; }

    // Address details
    public string Label { get; set; } = string.Empty;  // "Home", "Work", etc.
    public string FullName { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Phone { get; set; }

    // Status
    public bool IsDefault { get; set; }

    // Metadata
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }

    // Navigation
    public Customer Customer { get; set; } = null!;
}
