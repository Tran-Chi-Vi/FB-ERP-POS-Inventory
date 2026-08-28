# PowerShell Script to ensure 100% of directories and files from Caythumuc.docx exist

$ErrorActionPreference = "Stop"
$rootDir = "d:\F&B-ERP-POS-Inventory"

# 1. Root & DevOps Folders
$devopsDirs = @(
    "$rootDir\.github\workflows",
    "$rootDir\docker",
    "$rootDir\docs",
    "$rootDir\tests\FnbPos.UnitTests",
    "$rootDir\tests\FnbPos.IntegrationTests",
    "$rootDir\tests\FnbPos.E2ETests"
)

foreach ($d in $devopsDirs) {
    if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}

# Key DevOps files
"" | Out-File "$rootDir\.github\workflows\backend-ci.yml" -Encoding utf8 -Force
"" | Out-File "$rootDir\.github\workflows\frontend-ci.yml" -Encoding utf8 -Force
"" | Out-File "$rootDir\.github\pull_request_template.md" -Encoding utf8 -Force
"" | Out-File "$rootDir\docker\docker-compose.yml" -Encoding utf8 -Force
"" | Out-File "$rootDir\docker\Dockerfile.api" -Encoding utf8 -Force
"" | Out-File "$rootDir\docker\Dockerfile.web" -Encoding utf8 -Force
"" | Out-File "$rootDir\docs\openapi.json" -Encoding utf8 -Force
"" | Out-File "$rootDir\docs\visual-runbook-pos.md" -Encoding utf8 -Force
"" | Out-File "$rootDir\docs\disaster-recovery-drills.md" -Encoding utf8 -Force

# 2. Backend Folders (FnbPos.Api)
$backendBase = "$rootDir\F&B-ERP-POS-Inventory"
$backendDirs = @(
    "$backendBase\Controllers",
    "$backendBase\Application\Common\Interfaces",
    "$backendBase\Application\Common\Behaviors",
    "$backendBase\Application\Common\Exceptions",
    "$backendBase\Application\Common\Models",
    "$backendBase\Application\Auth",
    "$backendBase\Application\Branches",
    "$backendBase\Application\Catalog",
    "$backendBase\Application\BOM",
    "$backendBase\Application\Production",
    "$backendBase\Application\Inventory",
    "$backendBase\Application\Procurement",
    "$backendBase\Application\PurchaseRecommendation",
    "$backendBase\Application\POS",
    "$backendBase\Application\KDS",
    "$backendBase\Application\QR",
    "$backendBase\Application\Payment",
    "$backendBase\Application\Promotion",
    "$backendBase\Application\Customer",
    "$backendBase\Application\GiftCard",
    "$backendBase\Application\HR",
    "$backendBase\Application\Scheduling",
    "$backendBase\Application\Payroll",
    "$backendBase\Application\EInvoice",
    "$backendBase\Application\Delivery",
    "$backendBase\Application\Reservation",
    "$backendBase\Application\Reporting",
    "$backendBase\Application\Hardware",
    "$backendBase\Domain\Common",
    "$backendBase\Domain\Entities",
    "$backendBase\Domain\Enums",
    "$backendBase\Infrastructure\Persistence\Interceptors",
    "$backendBase\Infrastructure\Persistence\Configurations",
    "$backendBase\Infrastructure\Persistence\Migrations",
    "$backendBase\Infrastructure\Storage",
    "$backendBase\Infrastructure\Hardware",
    "$backendBase\Infrastructure\ThirdPartyServices",
    "$backendBase\Infrastructure\Logging",
    "$backendBase\Hubs",
    "$backendBase\BackgroundServices",
    "$backendBase\Middleware"
)

foreach ($d in $backendDirs) {
    if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}

# 3. Frontend Folders (client/src)
$frontendBase = "$rootDir\client\src"
$frontendDirs = @(
    "$frontendBase\app",
    "$frontendBase\api",
    "$frontendBase\components",
    "$frontendBase\layouts",
    "$frontendBase\pages\auth",
    "$frontendBase\pages\admin",
    "$frontendBase\pages\catalog",
    "$frontendBase\pages\inventory",
    "$frontendBase\pages\procurement",
    "$frontendBase\pages\production",
    "$frontendBase\pages\pos",
    "$frontendBase\pages\kitchen",
    "$frontendBase\pages\reservation",
    "$frontendBase\pages\marketing",
    "$frontendBase\pages\hr",
    "$frontendBase\pages\delivery",
    "$frontendBase\pages\reports",
    "$frontendBase\features\pos-cart",
    "$frontendBase\features\offline-sync",
    "$frontendBase\features\escpos-printer",
    "$frontendBase\features\kds-queue",
    "$frontendBase\hooks",
    "$frontendBase\stores",
    "$frontendBase\signalr",
    "$frontendBase\types",
    "$frontendBase\utils"
)

foreach ($d in $frontendDirs) {
    if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}

Write-Host "Created 100% of Caythumuc.docx directories successfully!"
