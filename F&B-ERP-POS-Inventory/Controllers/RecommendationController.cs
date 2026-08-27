using System;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace F_B_ERP_POS_Inventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationController : ControllerBase
    {
        private readonly RecommendationService _recommendationService;
        private readonly AprioriService _aprioriService;

        public RecommendationController(RecommendationService recommendationService, AprioriService aprioriService)
        {
            _recommendationService = recommendationService;
            _aprioriService = aprioriService;
        }

        [HttpGet("personalized")]
        public async Task<IActionResult> GetPersonalized([FromQuery] Guid? userId, [FromQuery] string? sessionId)
        {
            var result = await _recommendationService.GetPersonalizedRecommendationsAsync(userId, sessionId);
            return Ok(result);
        }

        [HttpGet("frequently-bought-together")]
        public async Task<IActionResult> GetFrequentlyBoughtTogether([FromQuery] Guid productId)
        {
            var result = await _recommendationService.GetFrequentlyBoughtTogetherAsync(productId);
            return Ok(result);
        }

        [HttpPost("run-apriori-job")]
        public async Task<IActionResult> RunAprioriJob([FromQuery] Guid branchId)
        {
            await _aprioriService.RunAprioriJobAsync(branchId);
            return Ok(new { message = $"Apriori Market Basket Analysis completed for Branch '{branchId}'." });
        }
    }
}
