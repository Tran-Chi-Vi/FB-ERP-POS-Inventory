using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Application.Services
{
    public class CrmService
    {
        private readonly AppDbContext _dbContext;

        public CrmService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Customer> EarnPointsAsync(Guid branchId, Guid customerId, decimal orderAmount, string orderNumber)
        {
            var customer = await _dbContext.Set<Customer>().FindAsync(customerId);
            if (customer == null) throw new InvalidOperationException("Customer not found.");

            int pointsEarned = (int)(orderAmount / 10000); // 1 point per 10,000 VND spent
            customer.TotalSpent += orderAmount;
            customer.TotalPoints += pointsEarned;

            // Recalculate Tier
            if (customer.TotalSpent >= 50000000) customer.Tier = "Diamond";
            else if (customer.TotalSpent >= 20000000) customer.Tier = "Gold";
            else if (customer.TotalSpent >= 5000000) customer.Tier = "Silver";
            else customer.Tier = "Bronze";

            var ledger = new LoyaltyLedger
            {
                BranchId = branchId,
                CustomerId = customerId,
                PointsChanged = pointsEarned,
                BalanceAfter = customer.TotalPoints,
                ReferenceNumber = orderNumber,
                Description = $"Earned {pointsEarned} points for order {orderNumber}",
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Set<LoyaltyLedger>().Add(ledger);
            await _dbContext.SaveChangesAsync();

            return customer;
        }
    }

    public class BiAnalyticsService
    {
        private readonly AppDbContext _dbContext;

        public BiAnalyticsService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<object> GetMenuEngineeringMatrixAsync(Guid branchId)
        {
            _dbContext.CurrentBranchId = branchId;
            var products = await _dbContext.Products.Include(p => p.Category).ToListAsync();

            var matrix = products.Select(p => new
            {
                p.Id,
                p.Name,
                Category = p.Category?.Name ?? "N/A",
                p.Price,
                p.CostPrice,
                ProfitMargin = p.Price - p.CostPrice,
                Popularity = p.StockQuantity, // Sales volume
                Classification = (p.Price - p.CostPrice > 15000)
                    ? (p.StockQuantity > 50 ? "Star ⭐ (High Profit, High Sales)" : "Puzzle 🧩 (High Profit, Low Sales)")
                    : (p.StockQuantity > 50 ? "Plowhorse 🐴 (Low Profit, High Sales)" : "Dog 🐕 (Low Profit, Low Sales)")
            });

            return matrix;
        }

        public async Task<object> GetRealtimePandLReportAsync(Guid branchId)
        {
            _dbContext.CurrentBranchId = branchId;

            var orders = await _dbContext.Orders.Where(o => o.PaymentStatus == PaymentStatus.Paid).ToListAsync();
            decimal grossRevenue = orders.Sum(o => o.FinalAmount);

            var transactions = await _dbContext.InventoryTransactions.Where(t => t.Quantity < 0).ToListAsync();
            decimal costOfGoodsSold = Math.Abs(transactions.Sum(t => t.Quantity * t.UnitPrice));

            decimal netProfit = grossRevenue - costOfGoodsSold;

            return new
            {
                BranchId = branchId,
                GrossRevenue = grossRevenue,
                CostOfGoodsSold = costOfGoodsSold,
                GrossMargin = grossRevenue > 0 ? ((grossRevenue - costOfGoodsSold) / grossRevenue) * 100 : 0,
                NetProfit = netProfit,
                GeneratedAt = DateTime.UtcNow
            };
        }
    }
}
