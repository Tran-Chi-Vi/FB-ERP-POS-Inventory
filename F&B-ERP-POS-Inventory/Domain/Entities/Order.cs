using System;
using System.Collections.Generic;

namespace F_B_ERP_POS_Inventory.Domain.Entities
{
    public enum OrderStatus
    {
        Pending,
        InKitchen,
        Ready,
        Completed,
        Cancelled
    }

    public enum PaymentStatus
    {
        Unpaid,
        Paid,
        Refunded
    }

    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string TableName { get; set; } = string.Empty;
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;
        public string PaymentMethod { get; set; } = "Cash"; // Cash, VietQR, Card
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
        public string IdempotencyKey { get; set; } = string.Empty;
        public Guid CashierId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Branch? Branch { get; set; }
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    public class OrderItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string Notes { get; set; } = string.Empty;

        public Order? Order { get; set; }
        public Product? Product { get; set; }
    }
}
