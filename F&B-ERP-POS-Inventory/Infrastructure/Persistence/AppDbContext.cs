using System;
using F_B_ERP_POS_Inventory.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public Guid CurrentBranchId { get; set; } = Guid.Empty;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Branch> Branches => Set<Branch>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Bom> Boms => Set<Bom>();
        public DbSet<BomDetail> BomDetails => Set<BomDetail>();
        public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<CashierShift> CashierShifts => Set<CashierShift>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
        public DbSet<PromptSkill> PromptSkills => Set<PromptSkill>();
        public DbSet<SuperpowerTask> SuperpowerTasks => Set<SuperpowerTask>();
        public DbSet<AssociationRule> AssociationRules => Set<AssociationRule>();
        public DbSet<UserBehaviorLog> UserBehaviorLogs => Set<UserBehaviorLog>();
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<Attendance> Attendances => Set<Attendance>();
        public DbSet<PayrollRecord> PayrollRecords => Set<PayrollRecord>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<LoyaltyLedger> LoyaltyLedgers => Set<LoyaltyLedger>();
        public DbSet<Promotion> Promotions => Set<Promotion>();
        public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Optimistic concurrency RowVersion for Product stock & Order status
            modelBuilder.Entity<Product>()
                .Property(p => p.RowVersion)
                .IsRowVersion();

            // Multi-Branch Global Query Filter (Enforces Multi-Branch Isolation)
            modelBuilder.Entity<User>().HasQueryFilter(u => CurrentBranchId == Guid.Empty || u.BranchId == CurrentBranchId);
            modelBuilder.Entity<Category>().HasQueryFilter(c => CurrentBranchId == Guid.Empty || c.BranchId == CurrentBranchId);
            modelBuilder.Entity<Product>().HasQueryFilter(p => CurrentBranchId == Guid.Empty || p.BranchId == CurrentBranchId);
            modelBuilder.Entity<Bom>().HasQueryFilter(b => CurrentBranchId == Guid.Empty || b.BranchId == CurrentBranchId);
            modelBuilder.Entity<InventoryTransaction>().HasQueryFilter(t => CurrentBranchId == Guid.Empty || t.BranchId == CurrentBranchId);
            modelBuilder.Entity<Order>().HasQueryFilter(o => CurrentBranchId == Guid.Empty || o.BranchId == CurrentBranchId);
            modelBuilder.Entity<CashierShift>().HasQueryFilter(s => CurrentBranchId == Guid.Empty || s.BranchId == CurrentBranchId);
            modelBuilder.Entity<AuditLog>().HasQueryFilter(a => CurrentBranchId == Guid.Empty || a.BranchId == CurrentBranchId);
            modelBuilder.Entity<AssociationRule>().HasQueryFilter(r => CurrentBranchId == Guid.Empty || r.BranchId == CurrentBranchId);
            modelBuilder.Entity<UserBehaviorLog>().HasQueryFilter(l => CurrentBranchId == Guid.Empty || l.BranchId == CurrentBranchId);
            modelBuilder.Entity<Employee>().HasQueryFilter(e => CurrentBranchId == Guid.Empty || e.BranchId == CurrentBranchId);
            modelBuilder.Entity<Attendance>().HasQueryFilter(a => CurrentBranchId == Guid.Empty || a.BranchId == CurrentBranchId);
            modelBuilder.Entity<PayrollRecord>().HasQueryFilter(p => CurrentBranchId == Guid.Empty || p.BranchId == CurrentBranchId);
            modelBuilder.Entity<Customer>().HasQueryFilter(c => CurrentBranchId == Guid.Empty || c.BranchId == CurrentBranchId);
            modelBuilder.Entity<LoyaltyLedger>().HasQueryFilter(l => CurrentBranchId == Guid.Empty || l.BranchId == CurrentBranchId);
            modelBuilder.Entity<Promotion>().HasQueryFilter(p => CurrentBranchId == Guid.Empty || p.BranchId == CurrentBranchId);
            modelBuilder.Entity<PurchaseOrder>().HasQueryFilter(po => CurrentBranchId == Guid.Empty || po.BranchId == CurrentBranchId);
        }
    }
}
