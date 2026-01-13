// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using CustomerService.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CustomerService.Api.Features.Customers;

public class GetCustomersQuery : IRequest<List<CustomerDto>>
{
    public bool IncludeDeleted { get; set; } = false;
}

public class GetCustomersQueryHandler : IRequestHandler<GetCustomersQuery, List<CustomerDto>>
{
    private readonly CustomerDbContext _context;

    public GetCustomersQueryHandler(CustomerDbContext context)
    {
        _context = context;
    }

    public async Task<List<CustomerDto>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Customers
            .Include(c => c.Addresses)
            .AsQueryable();

        if (!request.IncludeDeleted)
        {
            query = query.Where(c => !c.IsDeleted);
        }

        var customers = await query.ToListAsync(cancellationToken);
        return customers.Select(c => c.ToDto()).ToList();
    }
}

public class GetCustomerByIdQuery : IRequest<CustomerDto?>
{
    public Guid CustomerId { get; set; }
}

public class GetCustomerByIdQueryHandler : IRequestHandler<GetCustomerByIdQuery, CustomerDto?>
{
    private readonly CustomerDbContext _context;

    public GetCustomerByIdQueryHandler(CustomerDbContext context)
    {
        _context = context;
    }

    public async Task<CustomerDto?> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId && !c.IsDeleted, cancellationToken);

        return customer?.ToDto();
    }
}

public class GetCustomerByUserIdQuery : IRequest<CustomerDto?>
{
    public Guid UserId { get; set; }
}

public class GetCustomerByUserIdQueryHandler : IRequestHandler<GetCustomerByUserIdQuery, CustomerDto?>
{
    private readonly CustomerDbContext _context;

    public GetCustomerByUserIdQueryHandler(CustomerDbContext context)
    {
        _context = context;
    }

    public async Task<CustomerDto?> Handle(GetCustomerByUserIdQuery request, CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(c => c.UserId == request.UserId && !c.IsDeleted, cancellationToken);

        return customer?.ToDto();
    }
}
