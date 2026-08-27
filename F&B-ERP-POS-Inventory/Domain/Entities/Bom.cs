using System;
using System.Collections.Generic;

namespace F_B_ERP_POS_Inventory.Domain.Entities
{
    public class Bom
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public Guid FinishedProductId { get; set; }
        public string Version { get; set; } = "v1.0";
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Product? FinishedProduct { get; set; }
        public ICollection<BomDetail> Details { get; set; } = new List<BomDetail>();
    }

    public class BomDetail
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BomId { get; set; }
        public Guid IngredientProductId { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = string.Empty;

        public Bom? Bom { get; set; }
        public Product? IngredientProduct { get; set; }
    }
}
