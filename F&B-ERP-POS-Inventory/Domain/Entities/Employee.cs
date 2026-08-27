using System;

namespace F_B_ERP_POS_Inventory.Domain.Entities
{
    public class Employee
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Staff"; // SuperAdmin, Admin, Manager, Cashier, Kitchen, HR, Staff
        public string Phone { get; set; } = string.Empty;
        public decimal BaseSalary { get; set; } = 8000000;
        public decimal HourlyRate { get; set; } = 35000;
        public bool IsActive { get; set; } = true;
        public DateTime JoinedDate { get; set; } = DateTime.UtcNow;

        public Branch? Branch { get; set; }
    }

    public class Attendance
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public Guid EmployeeId { get; set; }
        public DateTime CheckInTime { get; set; } = DateTime.UtcNow;
        public DateTime? CheckOutTime { get; set; }
        public string WifiBssid { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public bool IsVerified { get; set; } = true;
        public string Note { get; set; } = string.Empty;

        public Employee? Employee { get; set; }
    }

    public class PayrollRecord
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BranchId { get; set; }
        public Guid EmployeeId { get; set; }
        public string MonthYear { get; set; } = DateTime.UtcNow.ToString("yyyy-MM");
        public double TotalHoursWorked { get; set; }
        public decimal TotalSalary { get; set; }
        public decimal Bonus { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public bool IsLocked { get; set; } = false;
        public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

        public Employee? Employee { get; set; }
    }
}
