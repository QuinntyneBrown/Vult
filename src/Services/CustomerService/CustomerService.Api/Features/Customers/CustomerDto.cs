// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using CustomerService.Api.Model;

namespace CustomerService.Api.Features.Customers;

public class CustomerDto
{
    public Guid CustomerId { get; set; }
    public Guid? UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public List<CustomerAddressDto> Addresses { get; set; } = new();
}

public class CustomerAddressDto
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
}

public class CreateCustomerDto
{
    public Guid? UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
}

public class UpdateCustomerDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
}

public class CreateCustomerAddressDto
{
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
}

public static class CustomerExtensions
{
    public static CustomerDto ToDto(this Customer customer)
    {
        return new CustomerDto
        {
            CustomerId = customer.CustomerId,
            UserId = customer.UserId,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Phone = customer.Phone,
            DateOfBirth = customer.DateOfBirth,
            CreatedDate = customer.CreatedDate,
            UpdatedDate = customer.UpdatedDate,
            Addresses = customer.Addresses.Select(a => a.ToDto()).ToList()
        };
    }

    public static CustomerAddressDto ToDto(this CustomerAddress address)
    {
        return new CustomerAddressDto
        {
            CustomerAddressId = address.CustomerAddressId,
            CustomerId = address.CustomerId,
            Label = address.Label,
            FullName = address.FullName,
            AddressLine1 = address.AddressLine1,
            AddressLine2 = address.AddressLine2,
            City = address.City,
            Province = address.Province,
            PostalCode = address.PostalCode,
            Country = address.Country,
            Phone = address.Phone,
            IsDefault = address.IsDefault
        };
    }
}
