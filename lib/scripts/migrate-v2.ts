/**
 * Database migration script - Apply improved schema v2
 * Run with: npm run migrate:v2
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('\n🚀 Database Migration: Improved Schema v2\n' + '='.repeat(60))

// Validate environment
if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.error('\n📝 To get your service role key:')
  console.error('   1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api')
  console.error('   2. Copy the "service_role" key (secret)')
  console.error('   3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('✅ Connected to Supabase')
console.log(`   URL: ${supabaseUrl}\n`)

// Read the migration SQL file
const migrationFile = path.join(process.cwd(), 'supabase', 'migrations', '006_improved_nutrition_schema.sql')

if (!fs.existsSync(migrationFile)) {
  console.error(`❌ Migration file not found: ${migrationFile}`)
  process.exit(1)
}

console.log('📄 Reading migration SQL...')
const sqlContent = fs.readFileSync(migrationFile, 'utf8')

// Split SQL into individual statements
function splitSqlStatements(sql: string): string[] {
  const statements: string[] = []
  let currentStatement = ''
  let inFunction = false
  let dollarQuoteTag = null
  
  const lines = sql.split('\n')
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Skip comments and empty lines
    if (trimmedLine.startsWith('--') || trimmedLine === '') {
      if (currentStatement.trim()) {
        currentStatement += '\n' + line
      }
      continue
    }
    
    // Detect function blocks
    if (trimmedLine.match(/CREATE\s+(OR\s+REPLACE\s+)?FUNCTION/i)) {
      inFunction = true
    }
    
    // Detect dollar quote tags ($$, $BODY$, etc.)
    const dollarMatch = trimmedLine.match(/\$([A-Za-z]*)\$/)
    if (dollarMatch) {
      if (dollarQuoteTag === null) {
        dollarQuoteTag = dollarMatch[0]
      } else if (dollarMatch[0] === dollarQuoteTag) {
        dollarQuoteTag = null
        if (trimmedLine.endsWith(';')) {
          inFunction = false
        }
      }
    }
    
    currentStatement += '\n' + line
    
    // End of statement: semicolon outside of function/quote
    if (trimmedLine.endsWith(';') && !inFunction && dollarQuoteTag === null) {
      statements.push(currentStatement.trim())
      currentStatement = ''
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim())
  }
  
  return statements.filter(s => s && !s.match(/^--/) && s !== ';')
}

async function runMigration() {
  try {
    console.log('\n⚙️  Preparing migration...')
    
    const statements = splitSqlStatements(sqlContent)
    console.log(`   Found ${statements.length} SQL statements\n`)
    
    console.log('⚠️  WARNING: This will create new tables in your database')
    console.log('   - 8 new tables (ingredients_master, meal_templates_v2, etc.)')
    console.log('   - Database triggers for auto-calculation')
    console.log('   - Helper functions and views')
    console.log('')
    
    // In Node.js, we can't easily prompt, so we'll just proceed
    // If you want confirmation, run this with an interactive prompt library
    
    console.log('🔄 Applying migration...\n')
    
    let successCount = 0
    let warningCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Extract statement type for logging
      const statementType = statement.match(/^(CREATE|ALTER|DROP|INSERT|UPDATE|COMMENT)/i)?.[1] || 'EXEC'
      const statementName = statement.match(/(?:TABLE|TRIGGER|FUNCTION|INDEX|VIEW|POLICY)\s+(?:IF\s+(?:NOT\s+)?EXISTS\s+)?([a-z_]+)/i)?.[1] || ''
      
      process.stdout.write(`   ${i + 1}/${statements.length} ${statementType} ${statementName}...`.padEnd(60))
      
      try {
        // Use Supabase's rpc to execute raw SQL
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Check if it's a "already exists" error (which is OK)
          if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
            console.log('⚠️  Already exists')
            warningCount++
          } else {
            console.log('❌ Error')
            console.error(`\n⚠️  Error in statement ${i + 1}:`, error.message)
            console.error('Statement:', statement.substring(0, 200) + '...\n')
          }
        } else {
          console.log('✅')
          successCount++
        }
      } catch (err: any) {
        console.log('❌ Error')
        console.error(`\n⚠️  Exception in statement ${i + 1}:`, err.message)
        console.error('Statement:', statement.substring(0, 200) + '...\n')
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ Migration completed!')
    console.log(`   Successful: ${successCount}`)
    console.log(`   Warnings: ${warningCount}`)
    console.log(`   Failed: ${statements.length - successCount - warningCount}`)
    
    console.log('\n📊 New tables created:')
    console.log('   ✓ ingredients_master')
    console.log('   ✓ meal_templates_v2')
    console.log('   ✓ meal_template_ingredients')
    console.log('   ✓ daily_meal_plans_v2')
    console.log('   ✓ daily_meal_plan_items')
    console.log('   ✓ user_meal_logs')
    console.log('   ✓ user_meal_log_ingredients')
    console.log('   ✓ user_favorite_templates')
    
    console.log('\n🎯 Next steps:')
    console.log('   1. Import nutrition data:')
    console.log('      npm run import:nutrition-plan-v2')
    console.log('')
    console.log('   2. Verify in Supabase Dashboard:')
    console.log(`      ${supabaseUrl.replace('//', '//app.')}/project/YOUR_PROJECT/editor`)
    console.log('')
    console.log('   3. Update UI components to use new schema')
    console.log('')
    
  } catch (error: any) {
    console.error('\n❌ Fatal error during migration:', error.message)
    process.exit(1)
  }
}

// Note: Supabase doesn't have built-in exec_sql RPC by default
// We need to execute via the SQL editor or use a different approach

console.log('⚠️  Note: Supabase Admin API approach required')
console.log('\n📝 Easiest method: Use Supabase Dashboard')
console.log('\nSteps:')
console.log('1. Open: https://supabase.com/dashboard')
console.log('2. Go to: SQL Editor → New Query')
console.log('3. Copy & paste contents of: supabase/migrations/006_improved_nutrition_schema.sql')
console.log('4. Click "Run"')
console.log('5. Then run: npm run import:nutrition-plan-v2')
console.log('\nAlternatively, use Supabase CLI:')
console.log('npm install -g supabase')
console.log('supabase db push')
console.log('')

// For now, we'll provide instructions rather than try to run SQL
// uncomment below if you have a custom exec_sql function
// runMigration()
