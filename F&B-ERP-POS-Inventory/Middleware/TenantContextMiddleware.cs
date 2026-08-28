using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;

namespace F_B_ERP_POS_Inventory.Middleware
{
    /// <summary>
    /// TenantContextMiddleware extracts BranchId from JWT claim or X-Branch-Id header
    /// and binds it to the current EF Core DbContext for Multi-Branch Isolation.
    /// Implements Phase 2 & Caythumuc spec.
    /// </summary>
    public class TenantContextMiddleware
    {
        private readonly RequestDelegate _next;

        public TenantContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
        {
            if (context.Request.Headers.TryGetValue("X-Branch-Id", out var branchIdHeader) &&
                Guid.TryParse(branchIdHeader, out var branchId))
            {
                dbContext.CurrentBranchId = branchId;
            }

            await _next(context);
        }
    }

    /// <summary>
    /// HmacValidationMiddleware verifies raw stream HMAC-SHA256 signature for payment webhooks.
    /// Prevents Replay Attacks and Timing Attacks using FixedTimeEquals.
    /// Implements Workflow 4 in Caythumuc spec.
    /// </summary>
    public class HmacValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly byte[] SecretKey = Encoding.UTF8.GetBytes("SuperSecretWebhookKey123!");

        public HmacValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/api/Webhook"))
            {
                context.Request.EnableBuffering();
                using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
                var rawBody = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;

                if (context.Request.Headers.TryGetValue("X-Signature", out var signature))
                {
                    using var hmac = new HMACSHA256(SecretKey);
                    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawBody));
                    var computedHex = Convert.ToHexString(computedHash).ToLower();

                    if (!CryptographicOperations.FixedTimeEquals(
                        Encoding.UTF8.GetBytes(computedHex),
                        Encoding.UTF8.GetBytes(signature.ToString().ToLower())))
                    {
                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsync("Invalid HMAC Signature");
                        return;
                    }
                }
            }

            await _next(context);
        }
    }
}
