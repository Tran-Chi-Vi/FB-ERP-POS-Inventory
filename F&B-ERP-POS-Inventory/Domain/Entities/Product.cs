using System;
using System.Collections.Generic;

namespace F_B_ERP_POS_Inventory.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public Guid CategoryId { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Unit { get; set; } = "Phần";
        public decimal Price { get; set; }
        public decimal CostPrice { get; set; }
        public decimal StockQuantity { get; set; }
        public byte[]? RowVersion { get; set; } // Optimistic Concurrency
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Branch? Branch { get; set; }
        public Category? Category { get; set; }
        public ICollection<Bom> Boms { get; set; } = new List<Bom>();
    }
}
