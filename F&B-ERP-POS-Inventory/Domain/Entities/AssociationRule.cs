using System;

namespace F_B_ERP_POS_Inventory.Domain.Entities
{
    public class AssociationRule
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public Guid AntecedentProductId { get; set; }
        public Guid ConsequentProductId { get; set; }
        public double Support { get; set; }
        public double Confidence { get; set; }
        public double Lift { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Product? AntecedentProduct { get; set; }
        public Product? ConsequentProduct { get; set; }
    }

    public class UserBehaviorLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public Guid? UserId { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public Guid? ProductId { get; set; }
        public string Action { get; set; } = "View"; // View, AddToCart, Search, Order
        public string SearchQuery { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public Product? Product { get; set; }
    }
}
