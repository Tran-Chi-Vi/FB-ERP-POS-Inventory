using System;

namespace F_B_ERP_POS_Inventory.Domain.Entities
{
    public class PromptSkill
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string SourceRepo { get; set; } = string.Empty; // e.g. prompt-optimizer, mattpocock/skills, karpathy-skills
        public string Category { get; set; } = string.Empty;
        public string PromptContent { get; set; } = string.Empty;
        public string OptimizedPrompt { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class SuperpowerTask
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string TaskName { get; set; } = string.Empty;
        public string WorkflowName { get; set; } = string.Empty; // e.g. obra/superpowers
        public string Status { get; set; } = "Completed";
        public string ResultSummary { get; set; } = string.Empty;
        public DateTime ExecutedAt { get; set; } = DateTime.UtcNow;
    }
}
