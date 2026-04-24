# Script to completely clean and rebuild the BTL_CNW project
Write-Host "=== CLEANING BTL_CNW PROJECT ===" -ForegroundColor Yellow

# Step 1: Stop any running processes
Write-Host "`n1. Checking for running processes..." -ForegroundColor Cyan
$processes = Get-Process | Where-Object { $_.ProcessName -like "*devenv*" -or $_.ProcessName -like "*MSBuild*" -or $_.ProcessName -like "*VBCSCompiler*" }
if ($processes) {
    Write-Host "Found running processes. Please close Visual Studio first!" -ForegroundColor Red
    exit 1
}

# Step 2: Delete bin and obj folders
Write-Host "`n2. Deleting bin and obj folders..." -ForegroundColor Cyan
$binPath = "BTL_CNW\bin"
$objPath = "BTL_CNW\obj"

if (Test-Path $binPath) {
    Remove-Item -Path $binPath -Recurse -Force
    Write-Host "   Deleted: $binPath" -ForegroundColor Green
}

if (Test-Path $objPath) {
    Remove-Item -Path $objPath -Recurse -Force
    Write-Host "   Deleted: $objPath" -ForegroundColor Green
}

# Step 3: Delete .vs folder (Visual Studio cache)
Write-Host "`n3. Deleting Visual Studio cache..." -ForegroundColor Cyan
$vsPath = "BTL_CNW\.vs"
if (Test-Path $vsPath) {
    Remove-Item -Path $vsPath -Recurse -Force
    Write-Host "   Deleted: $vsPath" -ForegroundColor Green
}

# Step 4: Instructions
Write-Host "`n=== CLEANUP COMPLETE ===" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open Visual Studio" -ForegroundColor White
Write-Host "2. Open the BTL_CNW.sln solution" -ForegroundColor White
Write-Host "3. Right-click on BTL_CNW project -> Clean" -ForegroundColor White
Write-Host "4. Right-click on BTL_CNW project -> Rebuild" -ForegroundColor White
Write-Host "5. Press F5 to run" -ForegroundColor White
Write-Host "`nThe CS1503 errors should be gone!" -ForegroundColor Green
