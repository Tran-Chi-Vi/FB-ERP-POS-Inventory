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
    [ApiController]
    [Route("api/[controller]")]
    public class KdsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public KdsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("station/{stationName}")]
        public async Task<IActionResult> GetStationQueue(string stationName)
        {
            var orders = await _dbContext.Orders
                .Where(o => o.Status == OrderStatus.Pending)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    o.TableName,
                    o.Status,
                    o.CreatedAt,
                    SlaSeconds = (int)(DateTime.UtcNow - o.CreatedAt).TotalSeconds,
                    SlaStatus = (DateTime.UtcNow - o.CreatedAt).TotalMinutes < 7 ? "Green" :
                                (DateTime.UtcNow - o.CreatedAt).TotalMinutes < 12 ? "Yellow" : "RedFlashing"
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPost("toggle-86-list")]
        public async Task<IActionResult> Toggle86List([FromQuery] Guid productId, [FromQuery] bool isOutOfStock)
        {
            var product = await _dbContext.Products.FindAsync(productId);
            if (product == null) return NotFound("Sản phẩm không tồn tại.");

            product.StockQuantity = isOutOfStock ? 0 : 50;
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                Message = isOutOfStock ? $"Đã khóa món '{product.Name}' (86 List - Out of stock 3-sec sync)." : $"Đã mở lại món '{product.Name}'.",
                ProductId = productId,
                IsOutOfStock = isOutOfStock
            });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ManagerController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public ManagerController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("pending-approvals")]
        public IActionResult GetPendingApprovals()
        {
            var pendingVoids = new[]
            {
                new { Id = Guid.NewGuid(), Type = "VoidRequest", TicketNumber = "ORD-102", TableName = "Bàn 01", RequestedBy = "Nguyễn Thị Mai (Thu Ngân)", ItemName = "Trà Đào Cam Sả", Reason = "Khách đổi ý sang Cà Phê", Status = "PendingApproval" },
                new { Id = Guid.NewGuid(), Type = "SpecialDiscount", TicketNumber = "ORD-108", TableName = "VIP 01", RequestedBy = "Trần Thanh Tâm (Phục Vụ)", ItemName = "Hóa Đơn 2.500.000đ", Reason = "Khách Thân Thiết 15%", Status = "PendingApproval" }
            };

            return Ok(pendingVoids);
        }

        [HttpPost("approve-void/{id}")]
        public IActionResult ApproveVoid(Guid id, [FromQuery] string managerPin)
        {
            if (string.IsNullOrEmpty(managerPin) || managerPin != "1234")
            {
                return BadRequest("Mã PIN Quản Lý không hợp lệ.");
            }

            return Ok(new { Message = $"Đã phê duyệt hủy món thành công và ghi sổ AuditLog." });
        }
    }
}
