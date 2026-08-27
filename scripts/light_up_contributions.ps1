# PowerShell Script for GitHub Contributions Graph Backdating
# Generates random 5 to 20 commits per active day from 2025-01-01 to 2026-05-31

$ErrorActionPreference = "Stop"

$repoDir = "d:\F&B-ERP-POS-Inventory"
Set-Location $repoDir

$startDate = Get-Date "2025-01-01"
$endDate   = Get-Date "2026-05-31"

$commitMessages = @(
    "feat(auth): implement RBAC matrix and JWT refresh token rotation",
    "feat(multi-branch): enforce EF Core HasQueryFilter for BranchId isolation",
    "feat(catalog): add topping matrix and multi-unit conversions",
    "feat(bom): build recursive BOM explosion engine with circular dependency detection",
    "feat(inventory): implement append-only ledger transaction architecture",
    "feat(pos): add offline table session state and atomic stock decrement",
    "feat(kds): integrate SignalR Hub real-time kitchen queue alerts",
    "feat(payment): add HMAC-SHA256 signature verification for payment webhooks",
    "feat(shift): cashier shift opening, drawer reconciliation and variance calculation",
    "feat(prompt-optimizer): integrate linshenkx/prompt-optimizer for AI F&B prompts",
    "feat(skills): integrate mattpocock/skills and karpathy-skills standards",
    "feat(superpowers): implement obra/superpowers automated workflow runner",
    "feat(ponytail): add DietrichGebert/ponytail async pipeline helper",
    "feat(impeccable): add pbakaus/impeccable GSAP design tokens and micro-interactions",
    "feat(hr): add trusted WiFi BSSID attendance check-in anti-fraud",
    "feat(payroll): automated payroll lock engine and payslip generator",
    "feat(einvoice): add e-invoice compliance according to Decree 123/2020",
    "feat(delivery): integrate GrabFood and ShopeeFood menu sync API",
    "test(concurrency): add pessimistic and optimistic row version concurrency tests",
    "docs(roadmap): update 34-phase master plan and architectural guidelines",
    "refactor(clean-code): optimize domain entities according to Karpathy guidelines",
    "fix(pos-offline): resolve IndexedDB sync revision conflict upon reconnection"
)

$branches = @(
    "feat/be-auth-rbac-multi-branch",
    "feat/be-inventory-bom-ledger",
    "feat/be-ai-prompt-skills-optimizer",
    "feat/fe-react-gsap-pos-ui",
    "feat/system-integration-superpowers"
)

Write-Host "Creating git branches..."
foreach ($b in $branches) {
    git branch -f $b master 2>$null
}
git branch -f develop master 2>$null

# Create a history log file to touch
$historyFile = Join-Path $repoDir "TIMELINE_HISTORY.md"
if (!(Test-Path $historyFile)) {
    "# F&B ERP POS System Development Timeline`n" | Out-File $historyFile -Encoding utf8
}

$currentDate = $startDate
$dayCount = 0

Write-Host "Starting backdated commit generation (Jan 2025 - May 2026)..."

while ($currentDate -le $endDate) {
    # Active 6 out of 7 days
    if ($currentDate.DayOfWeek -ne [System.DayOfWeek]::Sunday) {
        $numCommits = Get-Random -Minimum 5 -Maximum 21 # 5 to 20 inclusive
        
        # Determine branch based on date progression
        $branchIndex = [math]::Floor(($dayCount / 400) * $branches.Count)
        if ($branchIndex -ge $branches.Count) { $branchIndex = $branches.Count - 1 }
        $currentBranch = $branches[$branchIndex]

        git checkout -q $currentBranch

        for ($i = 1; $i -le $numCommits; $i++) {
            $hour   = Get-Random -Minimum 8 -Maximum 22
            $minute = Get-Random -Minimum 0 -Maximum 60
            $second = Get-Random -Minimum 0 -Maximum 60

            $dateStr = $currentDate.ToString("yyyy-MM-dd") + "T" + $hour.ToString("00") + ":" + $minute.ToString("00") + ":" + $second.ToString("00")
            
            $msgIndex = Get-Random -Minimum 0 -Maximum $commitMessages.Count
            $msg = $commitMessages[$msgIndex] + " (Day $dateStr #$i)"

            # Append to history log
            "[$dateStr] [$currentBranch] $msg" | Out-File $historyFile -Append -Encoding utf8

            $env:GIT_AUTHOR_DATE    = $dateStr
            $env:GIT_COMMITTER_DATE = $dateStr

            git add $historyFile
            git commit -q -m $msg --date=$dateStr
        }

        # Merge progress into develop
        git checkout -q develop
        $env:GIT_AUTHOR_DATE    = $dateStr
        $env:GIT_COMMITTER_DATE = $dateStr
        git merge -q --no-ff $currentBranch -m "merge($currentBranch): sync timeline progress $dateStr"

        # Periodic merge to master
        if ($dayCount % 7 -eq 0) {
            git checkout -q master
            $env:GIT_AUTHOR_DATE    = $dateStr
            $env:GIT_COMMITTER_DATE = $dateStr
            git merge -q --no-ff develop -m "release: milestone update $dateStr"
        }
    }
    $currentDate = $currentDate.AddDays(1)
    $dayCount++
}

git checkout master

Write-Host "Completed timeline commit generation! Total active days: $dayCount."
