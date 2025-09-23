using System;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Application.Services;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CrmController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly CrmService _crmService;

        public CrmController(AppDbContext dbContext, CrmService crmService)
        {
            _dbContext = dbContext;
            _crmService = crmService;
        }

        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _dbContext.Set<Customer>().ToListAsync();
            if (!customers.Any())
            {
                var defaults = new[]
                {
                    new Customer { FullName = "Nguyễn Văn A", Phone = "0988111222", Email = "nguyenvana@gmail.com", Tier = "Gold", TotalPoints = 1250, TotalSpent = 12500000 },
                    new Customer { FullName = "Trần Thị B", Phone = "0977333444", Email = "tranthib@gmail.com", Tier = "Diamond", TotalPoints = 5400, TotalSpent = 54000000 },
                    new Customer { FullName = "Lê Hoàng C", Phone = "0911555666", Email = "lehoangc@gmail.com", Tier = "Silver", TotalPoints = 620, TotalSpent = 6200000 }
                };

                _dbContext.Set<Customer>().AddRange(defaults);
                await _dbContext.SaveChangesAsync();
                return Ok(defaults);
            }
            return Ok(customers);
        }

        [HttpPost("earn-points")]
        public async Task<IActionResult> EarnPoints([FromQuery] Guid branchId, [FromQuery] Guid customerId, [FromQuery] decimal amount, [FromQuery] string orderNumber)
        {
            var customer = await _crmService.EarnPointsAsync(branchId, customerId, amount, orderNumber);
            return Ok(customer);
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly BiAnalyticsService _biAnalyticsService;

        public ReportsController(BiAnalyticsService biAnalyticsService)
        {
            _biAnalyticsService = biAnalyticsService;
        }

        [HttpGet("menu-engineering-matrix")]
        public async Task<IActionResult> GetMenuEngineering([FromQuery] Guid branchId)
        {
            var matrix = await _biAnalyticsService.GetMenuEngineeringMatrixAsync(branchId);
            return Ok(matrix);
        }

        [HttpGet("realtime-p-and-l")]
        public async Task<IActionResult> GetPandL([FromQuery] Guid branchId)
        {
            var pnl = await _biAnalyticsService.GetRealtimePandLReportAsync(branchId);
            return Ok(pnl);
        }
    }
}
