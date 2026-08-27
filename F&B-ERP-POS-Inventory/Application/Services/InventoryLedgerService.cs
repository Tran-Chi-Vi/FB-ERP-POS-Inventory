using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace F_B_ERP_POS_Inventory.Application.Services
{
    public class InventoryLedgerService
    {
        private readonly AppDbContext _dbContext;

        public InventoryLedgerService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<InventoryTransaction> RecordTransactionAsync(
            Guid branchId,
            Guid productId,
            TransactionType type,
            decimal quantity,
            decimal unitPrice,
            string refNumber,
            string note,
            Guid userId)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null)
            {
                throw new InvalidOperationException($"Product with ID {productId} not found.");
            }

            // Atomic balance calculation
            decimal newBalance = product.StockQuantity + quantity;
            if (newBalance < 0 && (type == TransactionType.Sale || type == TransactionType.Waste))
            {
                throw new InvalidOperationException($"Insufficient stock for product '{product.Name}'. Current: {product.StockQuantity}, Requested: {quantity}");
            }

            product.StockQuantity = newBalance;

            // Append-Only Inventory Ledger record
            var tx = new InventoryTransaction
            {
                BranchId = branchId,
                ProductId = productId,
                Type = type,
                Quantity = quantity,
                UnitPrice = unitPrice,
                BalanceAfter = newBalance,
                ReferenceNumber = refNumber,
                Note = note,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.InventoryTransactions.Add(tx);
            await _dbContext.SaveChangesAsync();

            return tx;
        }
    }
}
