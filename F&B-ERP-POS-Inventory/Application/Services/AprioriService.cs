using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Application.Services
{
    /// <summary>
    /// Apriori Market Basket Analysis Engine adapted from WebBanQuanAo.
    /// Mines frequent F&B item combinations to suggest smart combos & toppings in POS & QR ordering.
    /// </summary>
    public class AprioriService
    {
        private readonly AppDbContext _dbContext;

        public AprioriService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<AssociationRule>> GetRecommendationsAsync(Guid productId, int topN = 5)
        {
            return await _dbContext.AssociationRules
                .Where(r => r.AntecedentProductId == productId)
                .OrderByDescending(r => r.Lift)
                .Take(topN)
                .Include(r => r.ConsequentProduct)
                .ToListAsync();
        }

        public async Task RunAprioriJobAsync(Guid branchId, double minSupport = 0.01, double minConfidence = 0.2)
        {
            _dbContext.CurrentBranchId = branchId;

            var orderItems = await _dbContext.OrderItems
                .Include(oi => oi.Order)
                .Where(oi => oi.Order != null && oi.Order.BranchId == branchId)
                .Select(oi => new { oi.OrderId, oi.ProductId })
                .Distinct()
                .ToListAsync();

            var transactions = orderItems
                .GroupBy(x => x.OrderId)
                .Select(g => g.Select(x => x.ProductId).ToHashSet())
                .Where(t => t.Count > 1)
                .ToList();

            int totalTransactions = transactions.Count;
            if (totalTransactions == 0) return;

            var pairCounts = new Dictionary<(Guid, Guid), int>();
            var singleCounts = new Dictionary<Guid, int>();

            foreach (var t in transactions)
            {
                foreach (var p in t)
                    singleCounts[p] = singleCounts.GetValueOrDefault(p) + 1;

                var items = t.ToList();
                for (int i = 0; i < items.Count; i++)
                {
                    for (int j = 0; j < items.Count; j++)
                    {
                        if (i == j) continue;
                        var key = (items[i], items[j]);
                        pairCounts[key] = pairCounts.GetValueOrDefault(key) + 1;
                    }
                }
            }

            var newRules = new List<AssociationRule>();
            foreach (var ((a, b), countAB) in pairCounts)
            {
                double support = (double)countAB / totalTransactions;
                if (support < minSupport) continue;

                double confidence = (double)countAB / singleCounts[a];
                if (confidence < minConfidence) continue;

                double supportB = (double)singleCounts[b] / totalTransactions;
                double lift = supportB == 0 ? 0 : confidence / supportB;

                newRules.Add(new AssociationRule
                {
                    BranchId = branchId,
                    AntecedentProductId = a,
                    ConsequentProductId = b,
                    Support = support,
                    Confidence = confidence,
                    Lift = lift,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            var oldRules = await _dbContext.AssociationRules.Where(r => r.BranchId == branchId).ToListAsync();
            _dbContext.AssociationRules.RemoveRange(oldRules);
            await _dbContext.AssociationRules.AddRangeAsync(newRules);
            await _dbContext.SaveChangesAsync();
        }
    }
}
