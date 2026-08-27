using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Application.Services
{
    public class PosService
    {
        private readonly AppDbContext _dbContext;
        private readonly InventoryLedgerService _inventoryLedger;
        private readonly BomEngineService _bomEngine;

        public PosService(AppDbContext dbContext, InventoryLedgerService inventoryLedger, BomEngineService bomEngine)
        {
            _dbContext = dbContext;
            _inventoryLedger = inventoryLedger;
            _bomEngine = bomEngine;
        }

        public async Task<Order> CreateOrderAsync(
            Guid branchId,
            string tableName,
            List<(Guid productId, int qty, decimal price, string notes)> items,
            string idempotencyKey,
            Guid cashierId)
        {
            // Idempotency Key check to prevent duplicate order creation
            if (!string.IsNullOrEmpty(idempotencyKey))
            {
                var existingOrder = await _dbContext.Orders
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.IdempotencyKey == idempotencyKey);
                if (existingOrder != null)
                {
                    return existingOrder;
                }
            }

            var order = new Order
            {
                BranchId = branchId,
                OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}",
                TableName = tableName,
                Status = OrderStatus.Pending,
                PaymentStatus = PaymentStatus.Unpaid,
                IdempotencyKey = idempotencyKey,
                CashierId = cashierId,
                CreatedAt = DateTime.UtcNow
            };

            decimal total = 0;
            foreach (var item in items)
            {
                var product = await _dbContext.Products.FindAsync(item.productId);
                if (product == null) continue;

                decimal itemTotal = item.qty * item.price;
                total += itemTotal;

                order.Items.Add(new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.productId,
                    ProductName = product.Name,
                    Quantity = item.qty,
                    UnitPrice = item.price,
                    TotalPrice = itemTotal,
                    Notes = item.notes
                });

                // Deduct Inventory via BOM Explosion & Ledger
                var ingredients = await _bomEngine.ExplodeRecipeAsync(item.productId, item.qty);
                foreach (var (ingId, ingQty) in ingredients)
                {
                    await _inventoryLedger.RecordTransactionAsync(
                        branchId,
                        ingId,
                        TransactionType.Sale,
                        -ingQty,
                        product.CostPrice,
                        order.OrderNumber,
                        $"POS Sale for Table {tableName}",
                        cashierId);
                }
            }

            order.TotalAmount = total;
            order.FinalAmount = total;

            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();

            return order;
        }
    }
}
