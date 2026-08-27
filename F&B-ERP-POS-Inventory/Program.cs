using F_B_ERP_POS_Inventory.Application.Services;
using F_B_ERP_POS_Inventory.BackgroundServices;
using F_B_ERP_POS_Inventory.Hubs;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog Logging
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();
builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Register DbContext with SQL Server (and fallback to InMemory for quick local testing)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (!string.IsNullOrEmpty(connectionString))
    {
        try
        {
            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorNumbersToAdd: null);
            });
        }
        catch
        {
            options.UseInMemoryDatabase("FbErpPosDb");
        }
    }
    else
    {
        options.UseInMemoryDatabase("FbErpPosDb");
    }
});

// Register Application & Domain Services (Integrating 6 GitHub Repositories + WebBanQuanAo Intelligence)
builder.Services.AddScoped<InventoryLedgerService>();
builder.Services.AddScoped<BomEngineService>();
builder.Services.AddScoped<PosService>();
builder.Services.AddScoped<PromptOptimizerService>();
builder.Services.AddScoped<SkillsEngineService>();
builder.Services.AddScoped<SuperpowerWorkflowEngine>();
builder.Services.AddSingleton<ImpeccableDesignService>();

// WebBanQuanAo Data Mining & Recommendation Services
builder.Services.AddScoped<AprioriService>();
builder.Services.AddScoped<RecommendationService>();

// Hosted Background Services
builder.Services.AddHostedService<OrderAutoCancelBackgroundService>();
builder.Services.AddHostedService<WeeklyChurnWinBackBackgroundService>();

// SignalR Realtime Hubs
builder.Services.AddSignalR();

// CORS for Frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseCors("AllowReactApp");

app.MapControllers();
app.MapHub<PosHub>("/hubs/pos");
app.MapHub<KdsHub>("/hubs/kds");

app.MapGet("/", () => "F&B ERP + POS + Inventory Engine connected to Localhost SQL Server (FbErpPosDb) is Running!");

app.Run();
