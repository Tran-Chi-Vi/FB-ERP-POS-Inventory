using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;

namespace F_B_ERP_POS_Inventory.Application.Services
{
    /// <summary>
    /// Integration Service based on linshenkx/prompt-optimizer
    /// Standardizes, cleanses and optimizes AI prompts for F&B ERP POS operations.
    /// </summary>
    public class PromptOptimizerService
    {
        private readonly AppDbContext _dbContext;

        public PromptOptimizerService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PromptSkill> OptimizeAndSavePromptAsync(string originalPrompt, string category = "F&B POS AI")
        {
            // Cleanse & optimize prompt using prompt-optimizer rules
            string cleaned = Regex.Replace(originalPrompt, @"\s+", " ").Trim();
            string optimized = $"[SYSTEM ROLE: Senior F&B ERP Specialist]\n" +
                               $"[CONTEXT: Multi-branch POS & Inventory Engine]\n" +
                               $"[TASK]: {cleaned}\n" +
                               $"[OUTPUT SPEC]: Output strict JSON schema without preamble.";

            var promptEntity = new PromptSkill
            {
                Title = $"Prompt Optimization #{Guid.NewGuid().ToString()[..8]}",
                SourceRepo = "https://github.com/linshenkx/prompt-optimizer",
                Category = category,
                PromptContent = originalPrompt,
                OptimizedPrompt = optimized
            };

            _dbContext.PromptSkills.Add(promptEntity);
            await _dbContext.SaveChangesAsync();

            return promptEntity;
        }
    }
}
