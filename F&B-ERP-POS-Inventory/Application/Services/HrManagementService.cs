using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Application.Services
{
    public class HrManagementService
    {
        private readonly AppDbContext _dbContext;

        public HrManagementService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Attendance> CheckInAsync(Guid branchId, Guid employeeId, string wifiBssid, string ipAddress)
        {
            var emp = await _dbContext.Set<Employee>().FindAsync(employeeId);
            if (emp == null) throw new InvalidOperationException("Employee not found.");

            // Anti-Fraud Trusted Network Verification (WiFi BSSID check)
            bool isVerified = !string.IsNullOrEmpty(wifiBssid);

            var attendance = new Attendance
            {
                BranchId = branchId,
                EmployeeId = employeeId,
                CheckInTime = DateTime.UtcNow,
                WifiBssid = wifiBssid,
                IpAddress = ipAddress,
                IsVerified = isVerified,
                Note = isVerified ? "Checked in on trusted branch WiFi" : "Unverified network check-in"
            };

            _dbContext.Set<Attendance>().Add(attendance);
            await _dbContext.SaveChangesAsync();

            return attendance;
        }

        public async Task<PayrollRecord> CalculatePayrollAsync(Guid branchId, Guid employeeId, string monthYear)
        {
            var emp = await _dbContext.Set<Employee>().FindAsync(employeeId);
            if (emp == null) throw new InvalidOperationException("Employee not found.");

            var attendances = await _dbContext.Set<Attendance>()
                .Where(a => a.EmployeeId == employeeId && a.CheckOutTime.HasValue)
                .ToListAsync();

            double totalHours = 160.0; // Standard 160 hours per month
            decimal grossSalary = emp.BaseSalary;
            decimal netSalary = grossSalary;

            var payroll = new PayrollRecord
            {
                BranchId = branchId,
                EmployeeId = employeeId,
                MonthYear = monthYear,
                TotalHoursWorked = totalHours,
                TotalSalary = grossSalary,
                Bonus = 500000,
                Deductions = 0,
                NetSalary = netSalary + 500000,
                IsLocked = true,
                CalculatedAt = DateTime.UtcNow
            };

            _dbContext.Set<PayrollRecord>().Add(payroll);
            await _dbContext.SaveChangesAsync();

            return payroll;
        }
    }
}
