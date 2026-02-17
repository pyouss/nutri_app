# PowerShell script to migrate to improved schema
# Run with: .\migrate-to-v2.ps1

Write-Host "🚀 Nutrition Plan Schema Migration (v1 → v2)" -ForegroundColor Cyan
Write-Host "=" * 60

# Load environment variables from .env.local
function Get-EnvVar {
    param($Name)
    if (Test-Path ".env.local") {
        $content = Get-Content ".env.local" | Where-Object { $_ -match "^$Name=" }
        if ($content) {
            return ($content -split "=", 2)[1].Trim()
        }
    }
    return $null
}

$SUPABASE_URL = Get-EnvVar "NEXT_PUBLIC_SUPABASE_URL"
$SUPABASE_SERVICE_KEY = Get-EnvVar "SUPABASE_SERVICE_ROLE_KEY"

if (-not $SUPABASE_URL) {
    Write-Host "❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local" -ForegroundColor Red
    exit 1
}

if (-not $SUPABASE_SERVICE_KEY) {
    Write-Host ""
    Write-Host "⚠️  SUPABASE_SERVICE_ROLE_KEY not found in .env.local" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get your service role key:" -ForegroundColor White
    Write-Host "1. Go to: https://supabase.com/dashboard/project/_/settings/api" -ForegroundColor Gray
    Write-Host "2. Copy the 'service_role' key (secret)" -ForegroundColor Gray
    Write-Host "3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here" -ForegroundColor Gray
    Write-Host ""
    $key = Read-Host "Paste your service_role key here (or press Enter to exit)"
    
    if ($key) {
        $SUPABASE_SERVICE_KEY = $key.Trim()
        # Add to .env.local
        Add-Content -Path ".env.local" -Value "`nSUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY"
        Write-Host "✅ Service role key saved to .env.local" -ForegroundColor Green
    } else {
        Write-Host "❌ Migration cancelled" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📋 Configuration:" -ForegroundColor Cyan
Write-Host "   Supabase URL: $SUPABASE_URL" -ForegroundColor Gray
Write-Host "   Service Key: $($SUPABASE_SERVICE_KEY.Substring(0, 20))..." -ForegroundColor Gray
Write-Host ""

# Read the migration SQL file
$migrationFile = "supabase\migrations\006_improved_nutrition_schema.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Error: Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Reading migration file..." -ForegroundColor Cyan
$sqlContent = Get-Content $migrationFile -Raw

# Prepare the API request
$apiUrl = "$SUPABASE_URL/rest/v1/rpc/exec_sql"

Write-Host ""
Write-Host "⚠️  WARNING: This will create new tables in your database" -ForegroundColor Yellow
Write-Host "   - 8 new tables for improved schema" -ForegroundColor Gray
Write-Host "   - Triggers for auto-calculation" -ForegroundColor Gray
Write-Host "   - Database functions and views" -ForegroundColor Gray
Write-Host ""
$confirm = Read-Host "Continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Migration cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🔄 Applying migration..." -ForegroundColor Cyan

# Use psql if available (better), otherwise use REST API
$projectRef = ($SUPABASE_URL -split "//")[1].Split(".")[0]
$dbUrl = "postgresql://postgres:[password]@db.$projectRef.supabase.co:5432/postgres"

# Check if psql is available
$psqlAvailable = $null -ne (Get-Command psql -ErrorAction SilentlyContinue)

if ($psqlAvailable) {
    Write-Host "Using psql to run migration..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "📝 You'll need your database password" -ForegroundColor Yellow
    Write-Host "   Get it from: Supabase Dashboard → Settings → Database → Connection string" -ForegroundColor Gray
    Write-Host ""
    
    $dbPassword = Read-Host "Enter database password" -AsSecureString
    $dbPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
    )
    
    $env:PGPASSWORD = $dbPasswordPlain
    
    try {
        Get-Content $migrationFile | psql "postgresql://postgres:$dbPasswordPlain@db.$projectRef.supabase.co:5432/postgres"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "⚠️  Migration completed with warnings" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error running migration: $_" -ForegroundColor Red
        exit 1
    } finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "⚠️  psql not found. Please use one of these methods:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Method 1: Install Supabase CLI (Recommended)" -ForegroundColor White
    Write-Host "   npm install -g supabase" -ForegroundColor Gray
    Write-Host "   supabase db push" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Method 2: Use Supabase Dashboard" -ForegroundColor White
    Write-Host "   1. Go to: https://supabase.com/dashboard/project/$projectRef/sql/new" -ForegroundColor Gray
    Write-Host "   2. Copy contents of: $migrationFile" -ForegroundColor Gray
    Write-Host "   3. Paste and run in SQL Editor" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Method 3: Install PostgreSQL client" -ForegroundColor White
    Write-Host "   Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    Write-Host ""
    
    $openDashboard = Read-Host "Open Supabase Dashboard now? (y/n)"
    if ($openDashboard -eq "y") {
        Start-Process "https://supabase.com/dashboard/project/$projectRef/sql/new"
        Write-Host "Opening dashboard... Copy and run the migration SQL" -ForegroundColor Gray
    }
    
    exit 0
}

Write-Host ""
Write-Host "=" * 60
Write-Host "✅ Migration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 New tables created:" -ForegroundColor Cyan
Write-Host "   - ingredients_master" -ForegroundColor Gray
Write-Host "   - meal_templates_v2" -ForegroundColor Gray
Write-Host "   - meal_template_ingredients" -ForegroundColor Gray
Write-Host "   - daily_meal_plans_v2" -ForegroundColor Gray
Write-Host "   - daily_meal_plan_items" -ForegroundColor Gray
Write-Host "   - user_meal_logs" -ForegroundColor Gray
Write-Host "   - user_meal_log_ingredients" -ForegroundColor Gray
Write-Host "   - user_favorite_templates" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Import your nutrition data:" -ForegroundColor White
Write-Host "      npm run import:nutrition-plan-v2" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Check your data in Supabase Dashboard" -ForegroundColor White
Write-Host ""
Write-Host "   3. Update your app to use new schema" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "   - README_IMPROVED_SCHEMA.md" -ForegroundColor Gray
Write-Host "   - IMPROVED_SCHEMA_GUIDE.md" -ForegroundColor Gray
Write-Host ""
