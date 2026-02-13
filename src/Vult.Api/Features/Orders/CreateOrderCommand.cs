// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;

namespace Vult.Api.Features.Orders;

public class CreateOrderCommand : IRequest<CreateOrderCommandResult>
{
    public CreateOrderDto Order { get; set; } = null!;
}

public class CreateOrderCommandResult
{
    public OrderDto? Order { get; set; }
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
