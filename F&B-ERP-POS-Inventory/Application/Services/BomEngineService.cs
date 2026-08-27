using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Application.Services
{
    public class BomEngineService
    {
        private readonly AppDbContext _dbContext;

        public BomEngineService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Dictionary<Guid, decimal>> ExplodeRecipeAsync(Guid finishedProductId, decimal orderQty, HashSet<Guid>? visited = null)
        {
            visited ??= new HashSet<Guid>();

            // Circular Dependency Detection rule
            if (visited.Contains(finishedProductId))
            {
                throw new InvalidOperationException($"Circular Dependency detected in BOM recipe explosion for product ID '{finishedProductId}'.");
            }
            visited.Add(finishedProductId);

            var result = new Dictionary<Guid, decimal>();

            var bom = await _dbContext.Boms
                .Include(b => b.Details)
                .FirstOrDefaultAsync(b => b.FinishedProductId == finishedProductId && b.IsActive);

            if (bom == null || !bom.Details.Any())
            {
                // Raw ingredient / base item
                result[finishedProductId] = orderQty;
                return result;
            }

            foreach (var detail in bom.Details)
            {
                decimal ingredientNeeded = detail.Quantity * orderQty;

                // Recursive explosion for multi-level BOM
                var subRecipe = await ExplodeRecipeAsync(detail.IngredientProductId, ingredientNeeded, new HashSet<Guid>(visited));
                foreach (var (subIngId, subQty) in subRecipe)
                {
                    if (result.ContainsKey(subIngId))
                    {
                        result[subIngId] += subQty;
                    }
                    else
                    {
                        result[subIngId] = subQty;
                    }
                }
            }

            return result;
        }
    }
}
