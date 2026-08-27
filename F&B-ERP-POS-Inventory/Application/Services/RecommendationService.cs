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
    /// Recommendation Engine adapted from WebBanQuanAo.
    /// Provides personalized F&B recommendations, trending dishes, and Apriori cross-sell recommendations.
    /// </summary>
    public class RecommendationService
    {
        private readonly AppDbContext _dbContext;
        private readonly AprioriService _aprioriService;

        public RecommendationService(AppDbContext dbContext, AprioriService aprioriService)
        {
            _dbContext = dbContext;
            _aprioriService = aprioriService;
        }

        public async Task<List<Product>> GetPersonalizedRecommendationsAsync(Guid? userId, string? sessionId, int limit = 6)
        {
            var startDate = DateTime.UtcNow.AddDays(-30);

            var userLogs = await _dbContext.Set<UserBehaviorLog>()
                .Where(l => l.Timestamp >= startDate &&
                            ((userId.HasValue && l.UserId == userId) || (!string.IsNullOrEmpty(sessionId) && l.SessionId == sessionId)))
                .OrderByDescending(l => l.Timestamp)
                .Take(50)
                .ToListAsync();

            if (!userLogs.Any())
            {
                return await GetTrendingDishesAsync(limit);
            }

            var interactedProductIds = userLogs.Where(l => l.ProductId.HasValue).Select(l => l.ProductId!.Value).Distinct().ToList();
            var interactedCategories = await _dbContext.Products
                .Where(p => interactedProductIds.Contains(p.Id))
                .Select(p => p.CategoryId)
                .Distinct()
                .ToListAsync();

            var recommended = await _dbContext.Products
                .Where(p => p.IsActive &&
                            !interactedProductIds.Contains(p.Id) &&
                            interactedCategories.Contains(p.CategoryId))
                .Include(p => p.Category)
                .Take(limit)
                .ToListAsync();

            if (recommended.Count < limit)
            {
                var trending = await GetTrendingDishesAsync(limit - recommended.Count);
                foreach (var item in trending)
                {
                    if (!recommended.Any(r => r.Id == item.Id))
                    {
                        recommended.Add(item);
                    }
                }
            }

            return recommended;
        }

        public async Task<List<Product>> GetTrendingDishesAsync(int limit = 6)
        {
            return await _dbContext.Products
                .Where(p => p.IsActive)
                .Include(p => p.Category)
                .OrderByDescending(p => p.StockQuantity)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<List<Product>> GetFrequentlyBoughtTogetherAsync(Guid productId, int limit = 4)
        {
            var rules = await _aprioriService.GetRecommendationsAsync(productId, limit);
            var consequentIds = rules.Select(r => r.ConsequentProductId).ToList();

            if (consequentIds.Any())
            {
                return await _dbContext.Products
                    .Where(p => consequentIds.Contains(p.Id) && p.IsActive)
                    .Include(p => p.Category)
                    .ToListAsync();
            }

            var product = await _dbContext.Products.FindAsync(productId);
            if (product == null) return new List<Product>();

            return await _dbContext.Products
                .Where(p => p.CategoryId == product.CategoryId && p.Id != productId && p.IsActive)
                .Take(limit)
                .ToListAsync();
        }
    }
}
