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

// Ensure Database & Rich Seed Data Population on SQL Server DESKTOP-JE3MPP4\ViDay
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        try
        {
            dbContext.Database.Migrate();
        }
        catch
        {
            dbContext.Database.EnsureCreated();
        }

        // Rich Data Seeding for 8 Roles
        if (!dbContext.Branches.Any())
        {
            var branch1 = new Branch { Id = Guid.NewGuid(), Code = "BR01", Name = "Chi Nhánh Quận 1 (Flagship)", Address = "123 Lê Lợi, Q.1, TP.HCM", Phone = "02838221199" };
            var branch2 = new Branch { Id = Guid.NewGuid(), Code = "BR02", Name = "Chi Nhánh Quận 3", Address = "456 Nguyễn Thị Minh Khai, Q.3, TP.HCM", Phone = "02839332288" };
            dbContext.Branches.AddRange(branch1, branch2);
            dbContext.SaveChanges();

            var defaultBranchId = branch1.Id;

            // 1. Seed Users across 8 roles
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

            // 2. Seed Categories & Products
            var catDrinks = new Category { Id = Guid.NewGuid(), BranchId = defaultBranchId, Name = "Trà & Cà Phê", Description = "Đồ uống pha chế tươi nóng/lạnh" };
            var catCakes = new Category { Id = Guid.NewGuid(), BranchId = defaultBranchId, Name = "Bánh Ngọt & Tráng Miệng", Description = "Bánh tươi nhập trong ngày" };
            dbContext.Categories.AddRange(catDrinks, catCakes);

            var p1 = new Product { Id = Guid.NewGuid(), BranchId = defaultBranchId, CategoryId = catDrinks.Id, Sku = "BEV-001", Name = "Cà Phê Sữa Đá Sài Gòn", Price = 35000, CostPrice = 12000, StockQuantity = 150, Unit = "Ly" };
            var p2 = new Product { Id = Guid.NewGuid(), BranchId = defaultBranchId, CategoryId = catDrinks.Id, Sku = "BEV-002", Name = "Trà Đào Cam Sả Tươi", Price = 45000, CostPrice = 15000, StockQuantity = 95, Unit = "Ly" };
            var p3 = new Product { Id = Guid.NewGuid(), BranchId = defaultBranchId, CategoryId = catCakes.Id, Sku = "CAKE-001", Name = "Bánh Tiramisu Ý", Price = 55000, CostPrice = 22000, StockQuantity = 40, Unit = "Cái" };
            dbContext.Products.AddRange(p1, p2, p3);

            // 3. Seed Audit Logs
            var audit1 = new AuditLog { Id = Guid.NewGuid(), BranchId = defaultBranchId, UserId = seedUsers[2].Id, Action = "APPROVE_VOID", EntityType = "Order", EntityId = Guid.NewGuid().ToString(), StateBefore = "{\"Status\":\"Preparing\",\"TotalAmount\":90000}", StateAfter = "{\"Status\":\"Cancelled\",\"TotalAmount\":0,\"Reason\":\"Khách đổi ý\"}", Reason = "Khách hủy order", IpAddress = "192.168.1.15", Timestamp = DateTime.UtcNow.AddMinutes(-45) };
            var audit2 = new AuditLog { Id = Guid.NewGuid(), BranchId = defaultBranchId, UserId = seedUsers[1].Id, Action = "PAYROLL_LOCK", EntityType = "PayrollRecord", EntityId = Guid.NewGuid().ToString(), StateBefore = "{\"IsLocked\":false,\"Month\":8}", StateAfter = "{\"IsLocked\":true,\"Month\":8}", Reason = "Khóa sổ lương", IpAddress = "192.168.1.50", Timestamp = DateTime.UtcNow.AddHours(-2) };
            dbContext.AuditLogs.AddRange(audit1, audit2);

            // 4. Seed Employees & Attendance
            var emp1 = new Employee { Id = Guid.NewGuid(), BranchId = defaultBranchId, EmployeeCode = "EMP001", FullName = "Trần Thanh Tâm", Role = "Staff", Phone = "0901234567", BaseSalary = 7500000, HourlyRate = 35000, IsActive = true, JoinedDate = DateTime.UtcNow.AddMonths(-6) };
            var emp2 = new Employee { Id = Guid.NewGuid(), BranchId = defaultBranchId, EmployeeCode = "EMP002", FullName = "Nguyễn Thị Mai", Role = "Cashier", Phone = "0908765432", BaseSalary = 8500000, HourlyRate = 40000, IsActive = true, JoinedDate = DateTime.UtcNow.AddMonths(-12) };
            dbContext.Employees.AddRange(emp1, emp2);

            var att1 = new Attendance { Id = Guid.NewGuid(), BranchId = defaultBranchId, EmployeeId = emp1.Id, CheckInTime = DateTime.UtcNow.AddHours(-6), WifiBssid = "a4:b2:c8:99:11:00", IpAddress = "192.168.1.22", IsVerified = true, Note = "Selfie + BSSID Verified" };
            dbContext.Attendances.Add(att1);

            dbContext.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Log.Warning("Automated SQL Server seed notice: {Message}", ex.Message);
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
