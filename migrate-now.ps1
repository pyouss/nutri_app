# Quick Migration Script for Nutrition Schema V2
# This script uses the Supabase REST API to execute the migration

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Nutrition Schema V2 Migration" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
$envFile = ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*?)\s*=\s*(.*?)\s*$') {
            $name = $matches[1]
            $value = $matches[2]
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "[OK] Loaded environment variables from .env.local" -ForegroundColor Green
} else {
    Write-Host "[ERROR] .env.local file not found!" -ForegroundColor Red
    exit 1
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$anonKey = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY

if (-not $supabaseUrl -or -not $anonKey) {
    Write-Host "[ERROR] Missing Supabase configuration in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Supabase Project: $supabaseUrl" -ForegroundColor Yellow
Write-Host ""

# Check if service role key is set
$serviceKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $serviceKey) {
    Write-Host "Service Role Key Required" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To run migrations, you need your Supabase Service Role Key." -ForegroundColor White
    Write-Host ""
    Write-Host "Steps to get it:" -ForegroundColor White
    Write-Host "1. Go to: https://supabase.com/dashboard/project/iwszzotcejmepumidpxt/settings/api" -ForegroundColor White
    Write-Host "2. Find 'Service Role Key' (secret)" -ForegroundColor White
    Write-Host "3. Click 'Copy' button" -ForegroundColor White
    Write-Host ""
    
    $serviceKey = Read-Host "Paste your Service Role Key here"
    
    if ([string]::IsNullOrWhiteSpace($serviceKey)) {
        Write-Host "[ERROR] No service key provided. Exiting." -ForegroundColor Red
        exit 1
    }
    
    # Add to .env.local
    Add-Content -Path $envFile -Value "`nSUPABASE_SERVICE_ROLE_KEY=$serviceKey"
    Write-Host "[OK] Service key added to .env.local" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Reading migration file..." -ForegroundColor Yellow
$migrationFile = "supabase\migrations\006_improved_nutrition_schema.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "[ERROR] Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

$sqlContent = Get-Content $migrationFile -Raw
Write-Host "[OK] Migration file loaded (" -NoNewline -ForegroundColor Green
Write-Host $sqlContent.Length -NoNewline
Write-Host " bytes)" -ForegroundColor Green
Write-Host ""

Write-Host "EASIEST MIGRATION METHOD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The simplest way to run this migration is through the Supabase Dashboard:" -ForegroundColor White
Write-Host ""
Write-Host "1. Open: https://supabase.com/dashboard/project/iwszzotcejmepumidpxt/sql/new" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Copy the entire content of:" -ForegroundColor White
Write-Host "   $migrationFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Paste it into the SQL Editor" -ForegroundColor White
Write-Host ""
Write-Host "4. Click 'Run' button" -ForegroundColor White
Write-Host ""
Write-Host "This will create:" -ForegroundColor White
Write-Host "  - 12 normalized tables" -ForegroundColor Gray
Write-Host "  - 8 automatic calculation triggers" -ForegroundColor Gray
Write-Host "  - 2 helper views" -ForegroundColor Gray
Write-Host "  - 30+ optimized indexes" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "Have you completed the migration in the Dashboard? (yes/no)"

if ($continue -eq "yes" -or $continue -eq "y") {
    Write-Host ""
    Write-Host "[OK] Great! Now let's import the nutrition data..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Running: npm run import:nutrition-plan-v2" -ForegroundColor Yellow
    Write-Host ""
    
    npm run import:nutrition-plan-v2
    
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "Migration Complete!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Check your database in Supabase Dashboard" -ForegroundColor Gray
    Write-Host "2. Visit http://localhost:3000/nutrition-plan to view data" -ForegroundColor Gray
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "No problem! Run this script again when ready." -ForegroundColor Yellow
    Write-Host ""
}
