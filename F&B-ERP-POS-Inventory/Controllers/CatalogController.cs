using System;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Application.Services;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public CatalogController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts([FromQuery] Guid branchId)
        {
            _dbContext.CurrentBranchId = branchId;
            var products = await _dbContext.Products.Include(p => p.Category).ToListAsync();
            return Ok(products);
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class PromptSkillsController : ControllerBase
    {
        private readonly PromptOptimizerService _promptOptimizer;
        private readonly SkillsEngineService _skillsEngine;
        private readonly SuperpowerWorkflowEngine _superpowers;
        private readonly ImpeccableDesignService _impeccable;

        public PromptSkillsController(
            PromptOptimizerService promptOptimizer,
            SkillsEngineService skillsEngine,
            SuperpowerWorkflowEngine superpowers,
            ImpeccableDesignService impeccable)
        {
            _promptOptimizer = promptOptimizer;
            _skillsEngine = skillsEngine;
            _superpowers = superpowers;
            _impeccable = impeccable;
        }

        [HttpGet("registered-skills")]
        public async Task<IActionResult> GetSkills()
        {
            var skills = await _skillsEngine.GetRegisteredSkillsAsync();
            return Ok(skills);
        }

        [HttpPost("optimize-prompt")]
        public async Task<IActionResult> OptimizePrompt([FromBody] string prompt)
        {
            var result = await _promptOptimizer.OptimizeAndSavePromptAsync(prompt);
            return Ok(result);
        }

        [HttpPost("run-superpower-workflow")]
        public async Task<IActionResult> RunSuperpower([FromQuery] string taskName)
        {
            var task = await _superpowers.ExecuteSuperpowerTaskAsync(taskName);
            return Ok(task);
        }

        [HttpGet("impeccable-ui-tokens")]
        public IActionResult GetImpeccableUiTokens()
        {
            var tokens = _impeccable.GetImpeccableGsapTokens();
            return Ok(tokens);
        }
    }
}
