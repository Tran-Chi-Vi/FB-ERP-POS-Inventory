using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace F_B_ERP_POS_Inventory.Hubs
{
    public class PosHub : Hub
    {
        public async Task JoinBranchGroup(string branchId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Branch_{branchId}");
        }

        public async Task NotifyTableStatusChanged(string branchId, string tableName, string status)
        {
            await Clients.Group($"Branch_{branchId}").SendAsync("TableStatusUpdated", tableName, status);
        }
    }

    public class KdsHub : Hub
    {
        public async Task JoinKitchenStation(string branchId, string stationName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Kitchen_{branchId}_{stationName}");
        }

        public async Task SendOrderToKitchen(string branchId, object orderData)
        {
            await Clients.Group($"Kitchen_{branchId}_All").SendAsync("NewKitchenOrder", orderData);
        }
    }
}
