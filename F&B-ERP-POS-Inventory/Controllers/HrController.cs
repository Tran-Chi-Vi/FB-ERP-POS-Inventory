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
    public class HrController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly HrManagementService _hrService;

        public HrController(AppDbContext dbContext, HrManagementService hrService)
        {
            _dbContext = dbContext;
            _hrService = hrService;
        }

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await _dbContext.Set<Employee>().ToListAsync();
            if (!employees.Any())
            {
                // Seed default employees for testing
                var defaultEmps = new[]
                {
                    new Employee { EmployeeCode = "NV001", FullName = "Trần Chi Vi", Role = "SuperAdmin", BaseSalary = 25000000 },
                    new Employee { EmployeeCode = "NV002", FullName = "Nguyễn Văn Thu Ngân", Role = "Cashier", BaseSalary = 8000000 },
                    new Employee { EmployeeCode = "NV003", FullName = "Lê Thị Bếp Trưởng", Role = "Kitchen", BaseSalary = 12000000 },
                    new Employee { EmployeeCode = "NV004", FullName = "Phạm Văn Quản Lý", Role = "Manager", BaseSalary = 15000000 },
                    new Employee { EmployeeCode = "NV005", FullName = "Hoàng Thị HR", Role = "HR", BaseSalary = 11000000 }
                };

                _dbContext.Set<Employee>().AddRange(defaultEmps);
                await _dbContext.SaveChangesAsync();
                return Ok(defaultEmps);
            }
            return Ok(employees);
        }

        [HttpPost("check-in")]
        public async Task<IActionResult> CheckIn([FromQuery] Guid branchId, [FromQuery] Guid employeeId, [FromQuery] string wifiBssid)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var attendance = await _hrService.CheckInAsync(branchId, employeeId, wifiBssid, ip);
            return Ok(attendance);
        }

        [HttpPost("calculate-payroll")]
        public async Task<IActionResult> CalculatePayroll([FromQuery] Guid branchId, [FromQuery] Guid employeeId, [FromQuery] string monthYear)
        {
            var payroll = await _hrService.CalculatePayrollAsync(branchId, employeeId, monthYear);
            return Ok(payroll);
        }
    }
}
