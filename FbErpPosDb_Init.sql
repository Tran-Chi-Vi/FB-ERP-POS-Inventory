-- =================================================================================
-- F&B ERP POS INVENTORY SYSTEM - FULL SQL SERVER DATABASE CREATION & SEED SCRIPT
-- Open and Execute in SQL Server Management Studio (SSMS 21 / SSMS 20 / SSMS 19)
-- =================================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'FbErpPosDb')
BEGIN
    CREATE DATABASE [FbErpPosDb];
    PRINT 'Database [FbErpPosDb] created successfully.';
END
GO

USE [FbErpPosDb];
GO

-- 1. Branches Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'Branches')
BEGIN
    CREATE TABLE [Branches] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [Code] NVARCHAR(50) NOT NULL,
        [Name] NVARCHAR(255) NOT NULL,
        [Address] NVARCHAR(500) NULL,
        [Phone] NVARCHAR(50) NULL,
        [IsActive] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- 2. Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'Users')
BEGIN
    CREATE TABLE [Users] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [Username] NVARCHAR(100) NOT NULL,
        [Email] NVARCHAR(255) NOT NULL,
        [PasswordHash] NVARCHAR(500) NOT NULL,
        [FullName] NVARCHAR(255) NOT NULL,
        [Role] NVARCHAR(50) NOT NULL DEFAULT 'Staff',
        [IsActive] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_Users_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id])
    );
END
GO

-- 3. Categories Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'Categories')
BEGIN
    CREATE TABLE [Categories] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [Name] NVARCHAR(255) NOT NULL,
        [Description] NVARCHAR(500) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_Categories_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id])
    );
END
GO

-- 4. Products Table (With RowVersion for Optimistic Concurrency)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'Products')
BEGIN
    CREATE TABLE [Products] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [CategoryId] UNIQUEIDENTIFIER NOT NULL,
        [Sku] NVARCHAR(100) NOT NULL,
        [Name] NVARCHAR(255) NOT NULL,
        [Unit] NVARCHAR(50) NOT NULL DEFAULT N'Phần',
        [Price] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [CostPrice] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [StockQuantity] DECIMAL(18,4) NOT NULL DEFAULT 0.0000,
        [RowVersion] TIMESTAMP NOT NULL,
        [IsActive] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_Products_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id]),
        CONSTRAINT [FK_Products_Categories] FOREIGN KEY ([CategoryId]) REFERENCES [Categories]([Id])
    );
END
GO

-- 5. Boms Table (Recipe Header)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'Boms')
BEGIN
    CREATE TABLE [Boms] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [FinishedProductId] UNIQUEIDENTIFIER NOT NULL,
        [Version] NVARCHAR(50) NOT NULL DEFAULT 'v1.0',
        [IsActive] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_Boms_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id]),
        CONSTRAINT [FK_Boms_Products] FOREIGN KEY ([FinishedProductId]) REFERENCES [Products]([Id])
    );
END
GO

-- 6. BomDetails Table (Recipe Ingredients)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'BomDetails')
BEGIN
    CREATE TABLE [BomDetails] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BomId] UNIQUEIDENTIFIER NOT NULL,
        [IngredientProductId] UNIQUEIDENTIFIER NOT NULL,
        [Quantity] DECIMAL(18,4) NOT NULL,
        [Unit] NVARCHAR(50) NOT NULL,
        CONSTRAINT [FK_BomDetails_Boms] FOREIGN KEY ([BomId]) REFERENCES [Boms]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_BomDetails_Products] FOREIGN KEY ([IngredientProductId]) REFERENCES [Products]([Id])
    );
END
GO

-- 7. InventoryTransactions Table (Append-Only Stock Ledger)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'InventoryTransactions')
BEGIN
    CREATE TABLE [InventoryTransactions] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [ProductId] UNIQUEIDENTIFIER NOT NULL,
        [Type] INT NOT NULL, -- 0:Initial, 1:Purchase, 2:Sale, 3:ProductionUse, 4:ProductionOutput, 5:Waste, 6:Adjustment
        [Quantity] DECIMAL(18,4) NOT NULL,
        [UnitPrice] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [BalanceAfter] DECIMAL(18,4) NOT NULL,
        [ReferenceNumber] NVARCHAR(100) NULL,
        [Note] NVARCHAR(500) NULL,
        [CreatedByUserId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_InventoryTransactions_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id]),
        CONSTRAINT [FK_InventoryTransactions_Products] FOREIGN KEY ([ProductId]) REFERENCES [Products]([Id])
    );
END
GO

-- 8. Orders Table (POS Orders)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'Orders')
BEGIN
    CREATE TABLE [Orders] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [OrderNumber] NVARCHAR(100) NOT NULL UNIQUE,
        [TableName] NVARCHAR(100) NOT NULL,
        [Status] INT NOT NULL DEFAULT 0, -- 0:Pending, 1:InKitchen, 2:Ready, 3:Completed, 4:Cancelled
        [PaymentStatus] INT NOT NULL DEFAULT 0, -- 0:Unpaid, 1:Paid, 2:Refunded
        [PaymentMethod] NVARCHAR(50) NOT NULL DEFAULT 'Cash',
        [TotalAmount] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [DiscountAmount] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [FinalAmount] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [IdempotencyKey] NVARCHAR(100) NULL,
        [CashierId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_Orders_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id])
    );
END
GO

-- 9. OrderItems Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'OrderItems')
BEGIN
    CREATE TABLE [OrderItems] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [OrderId] UNIQUEIDENTIFIER NOT NULL,
        [ProductId] UNIQUEIDENTIFIER NOT NULL,
        [ProductName] NVARCHAR(255) NOT NULL,
        [Quantity] INT NOT NULL DEFAULT 1,
        [UnitPrice] DECIMAL(18,2) NOT NULL,
        [TotalPrice] DECIMAL(18,2) NOT NULL,
        [Notes] NVARCHAR(255) NULL,
        CONSTRAINT [FK_OrderItems_Orders] FOREIGN KEY ([OrderId]) REFERENCES [Orders]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_OrderItems_Products] FOREIGN KEY ([ProductId]) REFERENCES [Products]([Id])
    );
END
GO

-- 10. CashierShifts Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'CashierShifts')
BEGIN
    CREATE TABLE [CashierShifts] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [CashierId] UNIQUEIDENTIFIER NOT NULL,
        [StartTime] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [EndTime] DATETIME2 NULL,
        [InitialCash] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [TotalCashSales] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [TotalQrSales] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [ActualCashEnded] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [Variance] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        [IsClosed] BIT NOT NULL DEFAULT 0,
        CONSTRAINT [FK_CashierShifts_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id])
    );
END
GO

-- 11. AuditLogs Table (Append-Only Audit)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'AuditLogs')
BEGIN
    CREATE TABLE [AuditLogs] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        [Action] NVARCHAR(100) NOT NULL,
        [EntityType] NVARCHAR(100) NOT NULL,
        [EntityId] NVARCHAR(100) NOT NULL,
        [StateBefore] NVARCHAR(MAX) NULL,
        [StateAfter] NVARCHAR(MAX) NULL,
        [Reason] NVARCHAR(500) NULL,
        [IpAddress] NVARCHAR(50) NULL,
        [Timestamp] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_AuditLogs_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id])
    );
END
GO

-- 12. PromptSkills Table (6 GitHub Repos Engine)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'PromptSkills')
BEGIN
    CREATE TABLE [PromptSkills] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [Title] NVARCHAR(255) NOT NULL,
        [SourceRepo] NVARCHAR(255) NOT NULL,
        [Category] NVARCHAR(100) NOT NULL,
        [PromptContent] NVARCHAR(MAX) NOT NULL,
        [OptimizedPrompt] NVARCHAR(MAX) NOT NULL,
        [IsActive] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- 13. SuperpowerTasks Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'SuperpowerTasks')
BEGIN
    CREATE TABLE [SuperpowerTasks] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [TaskName] NVARCHAR(255) NOT NULL,
        [WorkflowName] NVARCHAR(255) NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'Completed',
        [ResultSummary] NVARCHAR(MAX) NULL,
        [ExecutedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- 14. AssociationRules Table (WebBanQuanAo Apriori)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'AssociationRules')
BEGIN
    CREATE TABLE [AssociationRules] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [AntecedentProductId] UNIQUEIDENTIFIER NOT NULL,
        [ConsequentProductId] UNIQUEIDENTIFIER NOT NULL,
        [Support] FLOAT NOT NULL,
        [Confidence] FLOAT NOT NULL,
        [Lift] FLOAT NOT NULL,
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_AssociationRules_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id])
    );
END
GO

-- 15. UserBehaviorLogs Table (WebBanQuanAo Recommendation)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'UserBehaviorLogs')
BEGIN
    CREATE TABLE [UserBehaviorLogs] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [BranchId] UNIQUEIDENTIFIER NOT NULL,
        [UserId] UNIQUEIDENTIFIER NULL,
        [SessionId] NVARCHAR(100) NOT NULL,
        [ProductId] UNIQUEIDENTIFIER NULL,
        [Action] NVARCHAR(50) NOT NULL DEFAULT 'View',
        [SearchQuery] NVARCHAR(255) NULL,
        [Timestamp] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [FK_UserBehaviorLogs_Branches] FOREIGN KEY ([BranchId]) REFERENCES [Branches]([Id])
    );
END
GO

-- =================================================================================
-- SEED INITIAL TEST DATA FOR TESTING ON LOCALHOST SSMS
-- =================================================================================

DECLARE @BranchId UNIQUEIDENTIFIER = '11111111-1111-1111-1111-111111111111';
DECLARE @AdminId UNIQUEIDENTIFIER  = '22222222-2222-2222-2222-222222222222';
DECLARE @CatCoffeeId UNIQUEIDENTIFIER = '33333333-3333-3333-3333-333333333333';
DECLARE @CatTeaBakeryId UNIQUEIDENTIFIER = '44444444-4444-4444-4444-444444444444';

DECLARE @ProdCapheSua UNIQUEIDENTIFIER = '55555555-5555-5555-5555-555555555555';
DECLARE @ProdTraDao UNIQUEIDENTIFIER   = '66666666-6666-6666-6666-666666666666';
DECLARE @ProdCroissant UNIQUEIDENTIFIER= '77777777-7777-7777-7777-777777777777';
DECLARE @IngHatCaphe UNIQUEIDENTIFIER  = '88888888-8888-8888-8888-888888888888';
DECLARE @IngSuaDac UNIQUEIDENTIFIER    = '99999999-9999-9999-9999-999999999999';

-- Seed Branch
IF NOT EXISTS (SELECT 1 FROM [Branches] WHERE [Id] = @BranchId)
BEGIN
    INSERT INTO [Branches] ([Id], [Code], [Name], [Address], [Phone], [IsActive])
    VALUES (@BranchId, 'CN01', N'Chi Nhánh Mặc Định - Quận 1', N'123 Nguyễn Huệ, Q.1, TP.HCM', '0909123456', 1);
END

-- Seed Admin User
IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Id] = @AdminId)
BEGIN
    INSERT INTO [Users] ([Id], [BranchId], [Username], [Email], [PasswordHash], [FullName], [Role], [IsActive])
    VALUES (@AdminId, @BranchId, 'admin', 'admin@fnbpos.com', 'AQAAAAEAACcQAAAAEH8...', N'Quản Trị Viên Hệ Thống', 'SuperAdmin', 1);
END

-- Seed Categories
IF NOT EXISTS (SELECT 1 FROM [Categories] WHERE [Id] = @CatCoffeeId)
BEGIN
    INSERT INTO [Categories] ([Id], [BranchId], [Name], [Description])
    VALUES 
    (@CatCoffeeId, @BranchId, N'Cà Phê Việt & Ý', N'Các loại Cà Phê Sữa, Đen, Bạc xỉu, Espresso'),
    (@CatTeaBakeryId, @BranchId, N'Trà Trái Cây & Bánh Ngọt', N'Trà Đào Cam Sả, Trà Vải, Bánh Croissant');
END

-- Seed Products
IF NOT EXISTS (SELECT 1 FROM [Products] WHERE [Id] = @ProdCapheSua)
BEGIN
    INSERT INTO [Products] ([Id], [BranchId], [CategoryId], [Sku], [Name], [Unit], [Price], [CostPrice], [StockQuantity], [IsActive])
    VALUES 
    (@ProdCapheSua, @BranchId, @CatCoffeeId, 'SP-CPS', N'Cà Phê Sữa Đá', N'Ly', 29000.00, 8000.00, 150.0000, 1),
    (@ProdTraDao, @BranchId, @CatTeaBakeryId, 'SP-TDC', N'Trà Đào Cam Sả', N'Ly', 39000.00, 10000.00, 100.0000, 1),
    (@ProdCroissant, @BranchId, @CatTeaBakeryId, 'SP-CRS', N'Bánh Croissant Bơ', N'Cái', 25000.00, 7000.00, 80.0000, 1),
    (@IngHatCaphe, @BranchId, @CatCoffeeId, 'NL-CAPHE', N'Hạt Cà Phê Robusta (Nguyên liệu)', N'Gam', 0.00, 150.00, 50000.0000, 1),
    (@IngSuaDac, @BranchId, @CatCoffeeId, 'NL-SUADAC', N'Sữa Đặc Lon (Nguyên liệu)', N'Ml', 0.00, 50.00, 20000.0000, 1);
END

-- Seed Registered Prompt Skills & Superpower Tasks
IF NOT EXISTS (SELECT 1 FROM [PromptSkills])
BEGIN
    INSERT INTO [PromptSkills] ([Id], [Title], [SourceRepo], [Category], [PromptContent], [OptimizedPrompt], [IsActive])
    VALUES 
    (NEWID(), N'GSAP Impeccable Design Token Guidelines', 'https://github.com/pbakaus/impeccable', 'Frontend Design', N'Use GSAP micro-interactions for POS tables and cart', N'GSAP power2.out transitions with emerald theme tokens', 1),
    (NEWID(), N'Apriori Market Basket Analysis Engine', 'https://github.com/linshenkx/prompt-optimizer', 'Machine Learning', N'Mine frequent F&B order itemsets for cross-selling', N'Apriori 2-itemset support/confidence/lift matrix engine', 1);
END

PRINT 'Initial Seed Data inserted successfully into [FbErpPosDb].';
GO
