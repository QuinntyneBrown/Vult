// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Model.CustomerAggregate;

public class Customer
{
    public Guid CustomerId { get; set; }

    // Link to User for authentication
    public Guid? UserId { get; set; }

    // Contact
    public string Email { get; set; } = string.Empty;

    // Profile
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }

    // Status
    public bool IsEmailVerified { get; set; }
    public bool IsDeleted { get; set; }

    // Preferences
    public bool MarketingEmailOptIn { get; set; }
    public bool SmsOptIn { get; set; }

    // Metadata
    public DateTime? LastLoginDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }

    // Navigation
    public ICollection<CustomerAddress> Addresses { get; set; } = new List<CustomerAddress>();

    // Computed properties
    public string FullName => $"{FirstName} {LastName}".Trim();

    // Business methods
    public bool CanLogin() => !IsDeleted;

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
