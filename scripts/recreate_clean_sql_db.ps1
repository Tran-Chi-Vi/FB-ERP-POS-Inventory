# PowerShell Script to drop database using EF Core and update SQL Server instance DESKTOP-JE3MPP4\ViDay cleanly

$ErrorActionPreference = "Continue"

$projectDir = "d:\F&B-ERP-POS-Inventory\F&B-ERP-POS-Inventory"
Set-Location $projectDir

Write-Host "1. Stopping any running backend processes..."
Stop-Process -Name "F&B-ERP-POS-Inventory" -Force -ErrorAction SilentlyContinue

Write-Host "2. Dropping existing database on SQL Server DESKTOP-JE3MPP4\ViDay..."
dotnet ef database drop --force --project "F&B-ERP-POS-Inventory.csproj"

Write-Host "3. Removing old migration files..."
Remove-Item -Path "Infrastructure\Persistence\Migrations" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "4. Adding fresh EF Core InitialCreate migration..."
dotnet ef migrations add InitialCreate --project "F&B-ERP-POS-Inventory.csproj"

Write-Host "5. Applying database update to SQL Server instance DESKTOP-JE3MPP4\ViDay..."
dotnet ef database update --project "F&B-ERP-POS-Inventory.csproj"

Write-Host "SUCCESS! Database FbErpPosDb has been created and populated on DESKTOP-JE3MPP4\ViDay!"
