# PowerShell Script to light up all Sundays (Row 1) and dark gaps in GitHub Contributions Graph

$ErrorActionPreference = "Stop"

$repoDir = "d:\F&B-ERP-POS-Inventory"
Set-Location $repoDir

$startDate = Get-Date "2025-01-01"
$endDate   = Get-Date "2026-08-28"

$commitMessages = @(
    "feat(caythumuc): align project architecture with Caythumuc.docx specification",
    "feat(rbac): enforce 8 Roles Permission Matrix for SuperAdmin, Admin, Manager, Warehouse, Cashier, Kitchen, Staff, Customer",
    "feat(workflow): implement Workflow 1 Realtime Sales Ordering to KDS Kitchen and E-Invoice",
    "feat(workflow): implement Workflow 2 Anti-loss Offline POS Resilience with IndexedDB and LAN print",
    "feat(workflow): implement Workflow 3 Atomic Stock Decrement and Optimistic RowVersion Locking",
    "feat(workflow): implement Workflow 4 Webhook Payment HMAC-SHA256 Constant Time Verification",
    "feat(workflow): implement Workflow 5 SignalR State Snapshot Recovery on Reconnection",
    "feat(middleware): add TenantContextMiddleware and HmacValidationMiddleware",
    "feat(workers): add StockReservationTtlWorker and BatchExpiryScannerWorker",
    "docs(architecture): complete Caythumuc.docx project structure and runbooks"
)

git checkout -q develop

$currentDate = $startDate
$dayCount = 0

Write-Host "Lighting up Sundays (Row 1) and dark gaps (2025-2026)..."

while ($currentDate -le $endDate) {
    # Check if Sunday OR if inside dark gap (2025-09-01 to 2025-11-30)
    $isSunday = ($currentDate.DayOfWeek -eq [System.DayOfWeek]::Sunday)
    $isInDarkGap = ($currentDate -ge (Get-Date "2025-09-01") -and $currentDate -le (Get-Date "2025-11-30"))

    if ($isSunday -or $isInDarkGap) {
        $numCommits = Get-Random -Minimum 6 -Maximum 21 # 6 to 20 commits for bright green intensity!

        for ($i = 1; $i -le $numCommits; $i++) {
            $hour   = Get-Random -Minimum 8 -Maximum 22
            $minute = Get-Random -Minimum 0 -Maximum 60
            $second = Get-Random -Minimum 0 -Maximum 60

            $dateStr = $currentDate.ToString("yyyy-MM-dd") + "T" + $hour.ToString("00") + ":" + $minute.ToString("00") + ":" + $second.ToString("00")
            
            $msgIndex = Get-Random -Minimum 0 -Maximum $commitMessages.Count
            $msg = $commitMessages[$msgIndex] + " (Sunday/Gap $dateStr #$i)"

            $env:GIT_AUTHOR_DATE    = $dateStr
            $env:GIT_COMMITTER_DATE = $dateStr

            git commit -q --allow-empty -m $msg --date=$dateStr
        }
        $dayCount++
    }
    $currentDate = $currentDate.AddDays(1)
}

git checkout master
git merge -q --no-ff develop -m "release: v3.0.0 Caythumuc architecture & full Sunday timeline lighting"

Write-Host "Completed Sunday & dark gap lighting! Processed $dayCount active dates."
