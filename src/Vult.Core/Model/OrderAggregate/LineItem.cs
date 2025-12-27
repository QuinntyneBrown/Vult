// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Core.Model.OrderAggregate;

public class LineItem
{
    public Guid LineItemId { get; set; }
    public Guid OrderId { get; set; }

    // Product snapshot (immutable at order time)
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductSize { get; set; }
    public string? ProductImageUrl { get; set; }
    public decimal UnitPrice { get; set; }

    // Order details
    public int Quantity { get; set; }
    public decimal SubTotal => UnitPrice * Quantity;

    // Navigation
    public Order Order { get; set; } = null!;
}
