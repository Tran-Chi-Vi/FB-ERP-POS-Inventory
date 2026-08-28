using F_B_ERP_POS_Inventory.Application.Services;
using F_B_ERP_POS_Inventory.BackgroundServices;
using F_B_ERP_POS_Inventory.Domain.Entities;
using F_B_ERP_POS_Inventory.Hubs;
using F_B_ERP_POS_Inventory.Infrastructure.Persistence;
using F_B_ERP_POS_Inventory.Middleware;
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

// Swagger Documentation setup per Caythumuc spec
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "FnbPos.Api - F&B ERP POS Inventory System Engine API",
        Version = "v1",
        Description = "API chuẩn hóa theo Caythumuc.docx (8 Roles RBAC, Multi-Branch Isolation, FEFO Inventory, Apriori AI & SignalR Hubs)"
    });
});

// Register DbContext with SQL Server instance DESKTOP-JE3MPP4\ViDay
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

// Register Application & Domain Services
builder.Services.AddScoped<InventoryLedgerService>();
builder.Services.AddScoped<BomEngineService>();
builder.Services.AddScoped<PosService>();
builder.Services.AddScoped<PromptOptimizerService>();
builder.Services.AddScoped<SkillsEngineService>();
builder.Services.AddScoped<SuperpowerWorkflowEngine>();
builder.Services.AddSingleton<ImpeccableDesignService>();
builder.Services.AddScoped<HrManagementService>();
builder.Services.AddScoped<CrmService>();
builder.Services.AddScoped<BiAnalyticsService>();
builder.Services.AddScoped<AprioriService>();
builder.Services.AddScoped<RecommendationService>();

// Hosted Background Workers per Caythumuc spec
builder.Services.AddHostedService<OrderAutoCancelBackgroundService>();
builder.Services.AddHostedService<WeeklyChurnWinBackBackgroundService>();
builder.Services.AddHostedService<StockReservationTtlWorker>();
builder.Services.AddHostedService<BatchExpiryScannerWorker>();

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

// Ensure Database & Tables are Created on SQL Server DESKTOP-JE3MPP4\ViDay with seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        
        // Migrate or EnsureCreated on SQL Server instance DESKTOP-JE3MPP4\ViDay
        try
        {
            dbContext.Database.Migrate();
        }
        catch
        {
            dbContext.Database.EnsureCreated();
        }

        // Seed Users across 8 roles if empty
        if (!dbContext.Users.Any())
        {
            var defaultBranchId = Guid.NewGuid();
            var seedUsers = new[]
            {
                new User { Username = "superadmin", FullName = "Nguyễn Văn Quảng", Email = "superadmin@fnb.com", Role = "SuperAdmin", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                new User { Username = "admin", FullName = "Trần Chí Vĩ", Email = "admin@fnb.com", Role = "Admin", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                new User { Username = "manager1", FullName = "Lê Hoàng Phúc", Email = "manager1@fnb.com", Role = "Manager", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                new User { Username = "warehouse1", FullName = "Phạm Quốc Bảo", Email = "warehouse1@fnb.com", Role = "Warehouse", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                new User { Username = "cashier1", FullName = "Nguyễn Thị Mai", Email = "cashier1@fnb.com", Role = "Cashier", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                new User { Username = "kitchen1", FullName = "Đặng Văn Lâm", Email = "kitchen1@fnb.com", Role = "Kitchen", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                new User { Username = "staff1", FullName = "Trần Thanh Tâm", Email = "staff1@fnb.com", Role = "Staff", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." },
                new User { Username = "customer1", FullName = "Nguyễn Văn A", Email = "customer1@fnb.com", Role = "Customer", BranchId = defaultBranchId, PasswordHash = "AQAAAAEAACcQAAAAE..." }
            };
            dbContext.Users.AddRange(seedUsers);
            dbContext.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Log.Warning("Automated SQL Server initialization notice: {Message}", ex.Message);
    }
}

app.UseSerilogRequestLogging();
app.UseCors("AllowReactApp");

// Custom Middlewares per Caythumuc spec
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<TenantContextMiddleware>();
app.UseMiddleware<HmacValidationMiddleware>();

// Enable Swagger UI at /swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FnbPos API v1");
    c.RoutePrefix = "swagger";
});

// Serve Static Files & React SPA from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<PosHub>("/hubs/pos");
app.MapHub<KdsHub>("/hubs/kds");

// Fallback to React SPA index.html
app.MapFallbackToFile("index.html");

app.Run();
