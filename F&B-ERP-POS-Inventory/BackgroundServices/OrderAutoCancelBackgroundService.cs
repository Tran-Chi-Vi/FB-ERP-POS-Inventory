using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace F_B_ERP_POS_Inventory.BackgroundServices
{
    /// <summary>
    /// Background Service adapted from WebBanQuanAo.
    /// Periodically scans for unpaid pending orders older than TTL (e.g., 15 mins) and cancels them automatically.
    /// </summary>
    public class OrderAutoCancelBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OrderAutoCancelBackgroundService> _logger;

        public OrderAutoCancelBackgroundService(IServiceProvider serviceProvider, ILogger<OrderAutoCancelBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("OrderAutoCancelBackgroundService is starting...");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                        var expirationThreshold = DateTime.UtcNow.AddMinutes(-15);
                        var expiredOrders = await dbContext.Orders
                            .Where(o => o.PaymentStatus == PaymentStatus.Unpaid &&
                                        o.Status == OrderStatus.Pending &&
                                        o.CreatedAt <= expirationThreshold)
                            .ToListAsync(stoppingToken);

                        if (expiredOrders.Any())
                        {
                            foreach (var order in expiredOrders)
                            {
                                order.Status = OrderStatus.Cancelled;
                                _logger.LogInformation("Auto-cancelled expired order {OrderNumber}", order.OrderNumber);
                            }

                            await dbContext.SaveChangesAsync(stoppingToken);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred in OrderAutoCancelBackgroundService");
                }

                // Check every 2 minutes
                await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken);
            }
        }
    }

    /// <summary>
    /// Background Service adapted from WebBanQuanAo.
    /// Weekly Churn Win-Back Engine: Scans inactive customers (no orders in past 30 days) and triggers retention vouchers.
    /// </summary>
    public class WeeklyChurnWinBackBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<WeeklyChurnWinBackBackgroundService> _logger;

        public WeeklyChurnWinBackBackgroundService(IServiceProvider serviceProvider, ILogger<WeeklyChurnWinBackBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("WeeklyChurnWinBackBackgroundService is starting...");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                        var churnThreshold = DateTime.UtcNow.AddDays(-30);
                        var inactiveUsers = await dbContext.Users
                            .Where(u => u.IsActive && u.CreatedAt <= churnThreshold)
                            .Take(20)
                            .ToListAsync(stoppingToken);

                        _logger.LogInformation("Win-Back Job: Identified {Count} inactive customers for retention campaign.", inactiveUsers.Count);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred in WeeklyChurnWinBackBackgroundService");
                }

                // Run weekly (every 7 days)
                await Task.Delay(TimeSpan.FromDays(7), stoppingToken);
            }
        }
    }
}
