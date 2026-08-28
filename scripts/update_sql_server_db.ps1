# Script to apply EF Core database migrations directly to SQL Server DESKTOP-JE3MPP4\ViDay

$ErrorActionPreference = "Continue"

$projectDir = "d:\F&B-ERP-POS-Inventory\F&B-ERP-POS-Inventory"
Set-Location $projectDir

Write-Host "Connecting to SQL Server instance DESKTOP-JE3MPP4\ViDay and applying EF Core database updates..."

Stop-Process -Name "F&B-ERP-POS-Inventory" -Force -ErrorAction SilentlyContinue

dotnet ef database update --project "F&B-ERP-POS-Inventory.csproj"

Write-Host "SQL Server Database Update Completed!"
