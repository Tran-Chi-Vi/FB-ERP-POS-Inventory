using System;

namespace F_B_ERP_POS_Inventory.Domain.Entities
{
    public class CashierShift
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public Guid CashierId { get; set; }
        public DateTime StartTime { get; set; } = DateTime.UtcNow;
        public DateTime? EndTime { get; set; }
        public decimal InitialCash { get; set; }
        public decimal TotalCashSales { get; set; }
        public decimal TotalQrSales { get; set; }
        public decimal ActualCashEnded { get; set; }
        public decimal Variance { get; set; }
        public bool IsClosed { get; set; } = false;
    }

    public class AuditLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public Guid UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string StateBefore { get; set; } = string.Empty;
        public string StateAfter { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
