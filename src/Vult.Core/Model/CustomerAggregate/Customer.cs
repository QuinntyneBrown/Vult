// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Model.CustomerAggregate;

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
        return Addresses.FirstOrDefault(a => a.IsDefault)
            ?? Addresses.FirstOrDefault();
    }

    public bool CanAddAddress(int maxAddresses = 10)
    {
        return Addresses.Count < maxAddresses;
    }

    public void SetDefaultAddress(Guid addressId)
    {
        foreach (var address in Addresses)
        {
            address.IsDefault = address.CustomerAddressId == addressId;
        }
    }
}
