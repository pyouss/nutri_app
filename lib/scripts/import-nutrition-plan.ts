/**
 * Script to import nutrition plan data from CSV files into Supabase
 * Run with: node --loader ts-node/esm lib/scripts/import-nutrition-plan.ts
 * Or: tsx lib/scripts/import-nutrition-plan.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface MealTemplateData {
  name: string
  description?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string
}

interface DailyMenuData {
  phase: 'maintenance' | 'deficit'
  menuName: string
  menuType: string | null
  calories: number
  protein: number
  carbs: number
  fat: number
  meals: string[]
}

// Parse macros from string like "96G - 41L - 83P"
function parseMacros(macroString: string): { carbs: number; fat: number; protein: number } | null {
  if (!macroString) return null
  
  const match = macroString.match(/(\d+(?:\.\d+)?)G\s*-\s*(\d+(?:\.\d+)?)L\s*-\s*(\d+(?:\.\d+)?)P/)
  if (!match) return null
  
  return {
    carbs: parseFloat(match[1]),
    fat: parseFloat(match[2]),
    protein: parseFloat(match[3])
  }
}

// Parse calories from string like "1000 kcal" or "1000kcal"
function parseCalories(calorieString: string): number | null {
  if (!calorieString) return null
  
  const match = calorieString.match(/(\d+(?:,\d+)?)\s*kcal/)
  if (!match) return null
  
  return parseInt(match[1].replace(',', ''))
}

async function importNutritionProtocol() {
  console.log('\n📋 Creating Nutrition Protocol: Protocole 2 - Recomposition corporelle')
  
  const { data: protocol, error: protocolError } = await supabase
    .from('nutrition_protocols')
    .insert({
      name: 'Protocole 2: Recomposition corporelle',
      description: 'Programme adapté pour la recomposition corporelle (skinny fat). Commence par 2 semaines de maintenance, puis déficit de -300 calories jusqu\'à atteindre le pourcentage de bodyfat souhaité.'
    })
    .select()
    .single()
  
  if (protocolError) {
    console.error('❌ Error creating protocol:', protocolError)
    return null
  }
  
  console.log('✅ Protocol created:', protocol.id)
  
  // Create phases
  const phases = [
    {
      protocol_id: protocol.id,
      phase_name: 'Maintenance',
      daily_calories: 2867,
      target_protein: 133,
      target_carbs: 398,
      target_fat: 83,
      phase_order: 1
    },
    {
      protocol_id: protocol.id,
      phase_name: 'Déficit -300kcal',
      daily_calories: 2567,
      target_protein: 133,
      target_carbs: 323,
      target_fat: 83,
      phase_order: 2
    }
  ]
  
  const { data: createdPhases, error: phasesError } = await supabase
    .from('protocol_phases')
    .insert(phases)
    .select()
  
  if (phasesError) {
    console.error('❌ Error creating phases:', phasesError)
    return null
  }
  
  console.log(`✅ Created ${createdPhases.length} phases`)
  
  return {
    protocol,
    phases: createdPhases
  }
}

async function importMealTemplates() {
  console.log('\n🍽️  Importing Meal Templates...')
  
  const templates: MealTemplateData[] = [
    {
      name: 'Spaghettis gourmands',
      calories: 1000,
      protein: 67,
      carbs: 123,
      fat: 29,
      ingredients: '160g pâtes pesées crues, 175g viande hachée 5%, 10mL huile d\'olive, 50g purée de tomate, 30g fromage au choix'
    },
    {
      name: 'Baguette gourmande',
      calories: 1050,
      protein: 83,
      carbs: 96,
      fat: 41,
      ingredients: '120g baguette, 100g cantal, 150g bifteak, 15g foie de veau (optionnel), 1 banane, 1 carré chocolat noir 85%'
    },
    {
      name: 'Bowl gourmand',
      calories: 994,
      protein: 70,
      carbs: 115,
      fat: 27,
      ingredients: '10g miel, 25g purée d\'amandes, 1 carré chocolat noir, 250g skyr 0%, 30g Whey Native Isolate 94%, 100g muesli, 1 banane, 100g fruits rouges'
    },
    {
      name: 'Club gourmand',
      calories: 970,
      protein: 58,
      carbs: 80,
      fat: 47,
      ingredients: '4 tranches de pain de mie, 150g émincé de poulet, 15g mayonnaise, 2 tranches d\'emmental, 1 tomate, 1 banane, 1 carré de chocolat noir'
    },
    {
      name: 'Pancakes gourmands',
      calories: 900,
      protein: 63,
      carbs: 95,
      fat: 35,
      ingredients: '4 oeufs, 2 bananes, 100g de fruits rouges, 20g miel, 2 carrés chocolat noir, 250mL lait demi-écrémé, 30g Whey Native Isolate 94%'
    },
    {
      name: 'Pokebowl',
      calories: 850,
      protein: 41,
      carbs: 91,
      fat: 22,
      ingredients: '1 pokebowl classique (de préférence saumon, crudités)',
      description: 'Commander ou préparer un pokebowl classique'
    },
    {
      name: 'Basmati gourmand',
      calories: 823,
      protein: 66,
      carbs: 87,
      fat: 19,
      ingredients: '300g riz pesé cuit, 200g bifteak, 10mL huile d\'olive, 50g purée de tomates'
    },
    {
      name: 'Poulet Crudités',
      calories: 770,
      protein: 30,
      carbs: 102,
      fat: 25,
      ingredients: '1 sandwich poulet crudités',
      description: 'Sandwich du commerce ou fait maison'
    },
    {
      name: 'Omelette gourmande',
      calories: 700,
      protein: 50,
      carbs: 78,
      fat: 22,
      ingredients: '500g pommes de terre grenailles, 100g bifteak, 3 oeufs'
    },
    {
      name: 'Subway (Sub 30)',
      calories: 670,
      protein: 42,
      carbs: 84,
      fat: 26,
      ingredients: '1 sandwich Subway 30cm',
      description: 'Sub 30cm au choix (privilégier poulet ou dinde)'
    }
  ]
  
  const templatesWithIngredients = templates.map(t => ({
    name: t.name,
    description: t.description || null,
    total_calories: t.calories,
    total_protein: t.protein,
    total_carbs: t.carbs,
    total_fat: t.fat,
    ingredients: parseIngredientsToJSON(t.ingredients),
    preparation_notes: null,
    is_public: true,
    created_by: null
  }))
  
  const { data, error } = await supabase
    .from('meal_templates')
    .insert(templatesWithIngredients)
    .select()
  
  if (error) {
    console.error('❌ Error importing meal templates:', error)
    return []
  }
  
  console.log(`✅ Imported ${data.length} meal templates`)
  return data
}

function parseIngredientsToJSON(ingredientString: string): any[] {
  // Simple parser - splits by comma and extracts quantity/name
  const ingredients = ingredientString.split(',').map(ing => {
    const trimmed = ing.trim()
    // Try to extract quantity and unit
    const match = trimmed.match(/^(\d+(?:\.\d+)?)(g|mL|ml|kg)?\s+(.+)$/)
    
    if (match) {
      return {
        name: match[3],
        quantity: parseFloat(match[1]),
        unit: match[2] || 'g'
      }
    }
    
    // If no quantity found, treat as whole item
    return {
      name: trimmed,
      quantity: 1,
      unit: 'piece'
    }
  })
  
  return ingredients
}

async function importDailyMealPlans(phases: any[], templates: any[]) {
  console.log('\n📅 Importing Daily Meal Plans...')
  
  const maintenancePhase = phases.find(p => p.phase_name === 'Maintenance')
  const deficitPhase = phases.find(p => p.phase_name === 'Déficit -300kcal')
  
  if (!maintenancePhase || !deficitPhase) {
    console.error('❌ Phases not found')
    return
  }
  
  // Menus for maintenance phase (simplified - you can expand these)
  const maintenanceMenus = [
    {
      phase_id: maintenancePhase.id,
      menu_name: 'Menu 1',
      menu_type: 'P+',
      total_calories: 2880,
      total_protein: 130,
      total_carbs: 391,
      total_fat: 82,
      meal_items: [
        { template_name: 'Spaghettis gourmands', notes: 'Recette complète' },
        { template_name: 'Poulet Crudités', notes: null },
        { custom_meal: { name: '2 oeufs', calories: 160, protein: 14, carbs: 0, fat: 15 }},
        { custom_meal: { name: 'Pommes de terre cuites (600g)', calories: 486, protein: 0, carbs: 136, fat: 0 }},
        { custom_meal: { name: 'Thon conserves (2)', calories: 218, protein: 50, carbs: 0, fat: 0 }},
        { custom_meal: { name: 'Huile d\'olive (2 cuillères à soupe)', calories: 246, protein: 0, carbs: 0, fat: 27.2 }}
      ],
      notes: 'Menu riche en protéines, recommandé pour les jours énergiques ou de sport'
    },
    {
      phase_id: maintenancePhase.id,
      menu_name: 'Menu 2',
      menu_type: 'L+',
      total_calories: 2817,
      total_protein: 130,
      total_carbs: 391,
      total_fat: 82,
      meal_items: [
        { template_name: 'Pancakes gourmands', notes: null },
        { template_name: 'Subway (Sub 30)', notes: null },
        { custom_meal: { name: '2 oeufs', calories: 160, protein: 14, carbs: 0, fat: 15 }},
        { custom_meal: { name: 'Pâtes crues (178g)', calories: 641, protein: 21.3, carbs: 133.5, fat: 0 }},
        { custom_meal: { name: 'Pain complet (2 tranches)', calories: 200, protein: 6, carbs: 34, fat: 0 }},
        { custom_meal: { name: 'Huile d\'olive (2 cuillères à soupe)', calories: 246, protein: 0, carbs: 0, fat: 27.2 }}
      ],
      notes: 'Menu riche en lipides, recommandé pour les jours de récupération post-sport'
    },
    {
      phase_id: maintenancePhase.id,
      menu_name: 'Menu 3',
      menu_type: 'L+',
      total_calories: 2818,
      total_protein: 130,
      total_carbs: 391,
      total_fat: 82,
      meal_items: [
        { template_name: 'Club gourmand', notes: null },
        { template_name: 'Spaghettis gourmands', notes: null },
        { custom_meal: { name: '4 oeufs', calories: 240, protein: 21, carbs: 0, fat: 22.5 }},
        { custom_meal: { name: 'Riz uncle bens (309g)', calories: 485, protein: 10.2, carbs: 93.4, fat: 0 }},
        { custom_meal: { name: 'Huile d\'olive (1 cuillère à soupe)', calories: 123, protein: 0, carbs: 0, fat: 13.6 }}
      ],
      notes: 'Menu riche en lipides'
    }
  ]
  
  // Menus for deficit phase
  const deficitMenus = [
    {
      phase_id: deficitPhase.id,
      menu_name: 'Menu 1',
      menu_type: 'P+',
      total_calories: 2509,
      total_protein: 130,
      total_carbs: 316,
      total_fat: 82,
      meal_items: [
        { template_name: 'Spaghettis gourmands', notes: null },
        { template_name: 'Poulet Crudités', notes: null },
        { custom_meal: { name: '2 oeufs', calories: 160, protein: 14, carbs: 0, fat: 15 }},
        { custom_meal: { name: 'Pommes de terre cuites (525g)', calories: 425, protein: 0, carbs: 119, fat: 0 }},
        { custom_meal: { name: 'Thon conserves (2)', calories: 218, protein: 50, carbs: 0, fat: 0 }},
        { custom_meal: { name: 'Huile d\'olive (1 cuillère à soupe)', calories: 123, protein: 0, carbs: 0, fat: 13.6 }}
      ],
      notes: 'Menu déficit riche en protéines'
    },
    {
      phase_id: deficitPhase.id,
      menu_name: 'Menu 2',
      menu_type: 'L+',
      total_calories: 2517,
      total_protein: 130,
      total_carbs: 316,
      total_fat: 82,
      meal_items: [
        { template_name: 'Pancakes gourmands', notes: null },
        { template_name: 'Subway (Sub 30)', notes: null },
        { custom_meal: { name: '2 oeufs', calories: 160, protein: 14, carbs: 0, fat: 15 }},
        { custom_meal: { name: 'Pâtes crues (108g)', calories: 389, protein: 12.9, carbs: 81, fat: 0 }},
        { custom_meal: { name: 'Pain complet (2 tranches)', calories: 200, protein: 6, carbs: 34, fat: 0 }},
        { custom_meal: { name: 'Huile d\'olive (2 cuillères à soupe)', calories: 246, protein: 0, carbs: 0, fat: 27.2 }}
      ],
      notes: 'Menu déficit riche en lipides'
    }
  ]
  
  const allMenus = [...maintenanceMenus, ...deficitMenus]
  
  const { data, error } = await supabase
    .from('daily_meal_plans')
    .insert(allMenus)
    .select()
  
  if (error) {
    console.error('❌ Error importing daily meal plans:', error)
    return
  }
  
  console.log(`✅ Imported ${data.length} daily meal plans`)
}

async function main() {
  console.log('🚀 Starting nutrition plan import...')
  console.log('=' . repeat(50))
  
  try {
    // 1. Import protocol and phases
    const protocolData = await importNutritionProtocol()
    if (!protocolData) {
      console.error('❌ Failed to create protocol, aborting...')
      process.exit(1)
    }
    
    // 2. Import meal templates
    const templates = await importMealTemplates()
    
    // 3. Import daily meal plans
    await importDailyMealPlans(protocolData.phases, templates)
    
    console.log('\n' + '='.repeat(50))
    console.log('✅ Import completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Run the migration: npm run supabase:migrate')
    console.log('2. Verify data in Supabase dashboard')
    console.log('3. Create UI components to display the nutrition plan')
    
  } catch (error) {
    console.error('❌ Fatal error during import:', error)
    process.exit(1)
  }
}

// Run the import
main()
