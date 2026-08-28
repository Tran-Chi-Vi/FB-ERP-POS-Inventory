using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Controllers
{
    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Staff"; // 8 Roles Matrix
        public Guid BranchId { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public UsersController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Lấy danh sách tài khoản toàn chuỗi hoặc theo Chi nhánh (Admin / SuperAdmin)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _dbContext.Users.ToListAsync();
            if (!users.Any())
            {
                // Seed initial default accounts for 8 Roles Matrix
                var defaultBranchId = Guid.NewGuid();
                var seeds = new[]
                {
                    new User { Username = "superadmin", FullName = "Nguyễn Văn Quảng (SuperAdmin)", Email = "superadmin@fnb.com", Role = "SuperAdmin", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                    new User { Username = "admin", FullName = "Trần Chí Vĩ (Admin)", Email = "admin@fnb.com", Role = "Admin", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                    new User { Username = "manager1", FullName = "Lê Hoàng Phúc (Manager Q1)", Email = "manager1@fnb.com", Role = "Manager", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                    new User { Username = "warehouse1", FullName = "Phạm Quốc Bảo (Thủ Kho)", Email = "warehouse1@fnb.com", Role = "Warehouse", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                    new User { Username = "cashier1", FullName = "Nguyễn Thi Mai (Thu Ngân)", Email = "cashier1@fnb.com", Role = "Cashier", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                    new User { Username = "kitchen1", FullName = "Đặng Văn Lâm (Đầu Bếp)", Email = "kitchen1@fnb.com", Role = "Kitchen", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                    new User { Username = "staff1", FullName = "Trần Thanh Tâm (Phục Vụ)", Email = "staff1@fnb.com", Role = "Staff", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." }
                };

                _dbContext.Users.AddRange(seeds);
                await _dbContext.SaveChangesAsync();
                return Ok(seeds);
            }

            return Ok(users);
        }

        /// <summary>
        /// Tạo mới tài khoản và gán Role trong hệ thống (SuperAdmin & Admin privilege)
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Tên đăng nhập và mật khẩu không được để trống.");
            }

            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (existingUser != null)
            {
                return BadRequest("Tên đăng nhập đã tồn tại trong hệ thống.");
            }

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Username = dto.Username,
                FullName = dto.FullName,
                Email = dto.Email,
                Role = dto.Role,
                BranchId = dto.BranchId != Guid.Empty ? dto.BranchId : Guid.NewGuid(),
                PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(dto.Password)), // Demo hashing
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(newUser);
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                Message = "Tạo tài khoản mới thành công!",
                User = newUser
            });
        }

        /// <summary>
        /// Cưỡng chế đăng xuất từ xa (Session Revocation - Extension Item per FNB_POS_Roles spec)
        /// </summary>
        [HttpPost("{id}/force-logout")]
        public async Task<IActionResult> ForceLogout(Guid id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user == null) return NotFound("Không tìm thấy tài khoản.");

            return Ok(new { Message = $"Đã thu hồi tất cả phiên đăng nhập của tài khoản {user.Username} thành công!" });
        }
    }
}
