using System;

namespace F_B_ERP_POS_Inventory.Domain.Entities
{
    public enum TransactionType
    {
        Initial,
        Purchase,
        Sale,
        ProductionUse,
        ProductionOutput,
        Waste,
        Adjustment,
        TransferIn,
        TransferOut
    }

    public class InventoryTransaction
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public Guid ProductId { get; set; }
        public TransactionType Type { get; set; }
        public decimal Quantity { get; set; } // Positive for in, Negative for out
        public decimal UnitPrice { get; set; }
        public decimal BalanceAfter { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public Guid CreatedByUserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Product? Product { get; set; }
    }
}
