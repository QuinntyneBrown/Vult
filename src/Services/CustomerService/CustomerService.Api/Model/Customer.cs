// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace CustomerService.Api.Model;

public class Customer
{
    public Guid CustomerId { get; set; }
    public Guid? UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public ICollection<CustomerAddress> Addresses { get; set; } = new List<CustomerAddress>();

    public CustomerAddress? GetDefaultAddress()
    {
        return Addresses.FirstOrDefault(a => a.IsDefault) ?? Addresses.FirstOrDefault();
    }

    public void SetDefaultAddress(Guid addressId)
    {
        foreach (var address in Addresses)
        {
            address.IsDefault = address.CustomerAddressId == addressId;
        }
    }
}

public class CustomerAddress
{
    public Guid CustomerAddressId { get; set; }
    public Guid CustomerId { get; set; }
    public string Label { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool IsDefault { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public Customer Customer { get; set; } = null!;
}
