// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using CustomerService.Api.Data;
using CustomerService.Api.Model;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace CustomerService.Api.Features.Customers;

public class CreateCustomerCommand : IRequest<CustomerDto>
{
    public CreateCustomerDto Customer { get; set; } = null!;
}

public class CreateCustomerCommandHandler : IRequestHandler<CreateCustomerCommand, CustomerDto>
{
    private readonly CustomerDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<CreateCustomerCommandHandler> _logger;

    public CreateCustomerCommandHandler(
        CustomerDbContext context,
        IEventPublisher eventPublisher,
        ILogger<CreateCustomerCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<CustomerDto> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = new Customer
        {
            CustomerId = Guid.NewGuid(),
            UserId = request.Customer.UserId,
            FirstName = request.Customer.FirstName,
            LastName = request.Customer.LastName,
            Phone = request.Customer.Phone,
            DateOfBirth = request.Customer.DateOfBirth,
            IsDeleted = false,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new CustomerCreatedEvent
        {
            CustomerId = customer.CustomerId,
            UserId = customer.UserId,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Phone = customer.Phone
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published CustomerCreatedEvent for customer {CustomerId}", customer.CustomerId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish CustomerCreatedEvent for customer {CustomerId}", customer.CustomerId);
        }

        return customer.ToDto();
    }
}

public class UpdateCustomerCommand : IRequest<CustomerDto?>
{
    public Guid CustomerId { get; set; }
    public UpdateCustomerDto Customer { get; set; } = null!;
}

public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, CustomerDto?>
{
    private readonly CustomerDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<UpdateCustomerCommandHandler> _logger;

    public UpdateCustomerCommandHandler(
        CustomerDbContext context,
        IEventPublisher eventPublisher,
        ILogger<UpdateCustomerCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<CustomerDto?> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId && !c.IsDeleted, cancellationToken);

        if (customer == null)
        {
            return null;
        }

        if (request.Customer.FirstName != null) customer.FirstName = request.Customer.FirstName;
        if (request.Customer.LastName != null) customer.LastName = request.Customer.LastName;
        if (request.Customer.Phone != null) customer.Phone = request.Customer.Phone;
        if (request.Customer.DateOfBirth.HasValue) customer.DateOfBirth = request.Customer.DateOfBirth;

        customer.UpdatedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new CustomerUpdatedEvent
        {
            CustomerId = customer.CustomerId,
            UserId = customer.UserId,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Phone = customer.Phone
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published CustomerUpdatedEvent for customer {CustomerId}", customer.CustomerId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish CustomerUpdatedEvent for customer {CustomerId}", customer.CustomerId);
        }

        return customer.ToDto();
    }
}

public class DeleteCustomerCommand : IRequest<bool>
{
    public Guid CustomerId { get; set; }
}

public class DeleteCustomerCommandHandler : IRequestHandler<DeleteCustomerCommand, bool>
{
    private readonly CustomerDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<DeleteCustomerCommandHandler> _logger;

    public DeleteCustomerCommandHandler(
        CustomerDbContext context,
        IEventPublisher eventPublisher,
        ILogger<DeleteCustomerCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId && !c.IsDeleted, cancellationToken);

        if (customer == null)
        {
            return false;
        }

        customer.IsDeleted = true;
        customer.UpdatedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        var integrationEvent = new CustomerDeletedEvent
        {
            CustomerId = customer.CustomerId
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published CustomerDeletedEvent for customer {CustomerId}", customer.CustomerId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish CustomerDeletedEvent for customer {CustomerId}", customer.CustomerId);
        }

        return true;
    }
}

public class AddCustomerAddressCommand : IRequest<CustomerAddressDto?>
{
    public Guid CustomerId { get; set; }
    public CreateCustomerAddressDto Address { get; set; } = null!;
}

public class AddCustomerAddressCommandHandler : IRequestHandler<AddCustomerAddressCommand, CustomerAddressDto?>
{
    private readonly CustomerDbContext _context;

    public AddCustomerAddressCommandHandler(CustomerDbContext context)
    {
        _context = context;
    }

    public async Task<CustomerAddressDto?> Handle(AddCustomerAddressCommand request, CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId && !c.IsDeleted, cancellationToken);

        if (customer == null)
        {
            return null;
        }

        // If this is the default address, clear default from others
        if (request.Address.IsDefault)
        {
            foreach (var addr in customer.Addresses)
            {
                addr.IsDefault = false;
            }
        }

        var address = new CustomerAddress
        {
            CustomerAddressId = Guid.NewGuid(),
            CustomerId = customer.CustomerId,
            Label = request.Address.Label,
            FullName = request.Address.FullName,
            AddressLine1 = request.Address.AddressLine1,
            AddressLine2 = request.Address.AddressLine2,
            City = request.Address.City,
            Province = request.Address.Province,
            PostalCode = request.Address.PostalCode,
            Country = request.Address.Country,
            Phone = request.Address.Phone,
            IsDefault = request.Address.IsDefault || !customer.Addresses.Any(),
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        customer.Addresses.Add(address);
        await _context.SaveChangesAsync(cancellationToken);

        return address.ToDto();
    }
}
