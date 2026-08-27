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
    /// Integration Service based on mattpocock/skills & multica-ai/andrej-karpathy-skills
    /// Manages engineering skills, coding rules, and algorithm optimization guidelines.
    /// </summary>
    public class SkillsEngineService
    {
        private readonly AppDbContext _dbContext;

        public SkillsEngineService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<PromptSkill>> GetRegisteredSkillsAsync()
        {
            var skills = await _dbContext.PromptSkills.Where(s => s.IsActive).ToListAsync();
            if (!skills.Any())
            {
                // Seed default skills from mattpocock/skills & karpathy-skills
                var defaultSkills = new List<PromptSkill>
                {
                    new PromptSkill
                    {
                        Title = "TypeScript & React State Integrity",
                        SourceRepo = "https://github.com/mattpocock/skills",
                        Category = "Frontend Engineering",
                        PromptContent = "Ensure React is purely presentation; Business state authority belongs to Backend ASP.NET Core.",
                        OptimizedPrompt = "Use TanStack Query for cache invalidation; local component state for transient UI."
                    },
                    new PromptSkill
                    {
                        Title = "Karpathy Algorithm & Code Cleanliness Standard",
                        SourceRepo = "https://github.com/multica-ai/andrej-karpathy-skills",
                        Category = "Algorithm & Code Quality",
                        PromptContent = "Avoid unnecessary abstractions, write minimal clear code, keep single source of truth.",
                        OptimizedPrompt = "Append-only Ledger pattern for inventory; EF Core Global Filters for multi-tenant isolation."
                    }
                };

                _dbContext.PromptSkills.AddRange(defaultSkills);
                await _dbContext.SaveChangesAsync();
                return defaultSkills;
            }
            return skills;
        }
    }
}
