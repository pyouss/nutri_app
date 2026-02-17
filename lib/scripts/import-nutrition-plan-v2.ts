/**
 * Improved import script for modular nutrition plan schema
 * Uses the new normalized table structure with proper relationships
 * Run with: npm run import:nutrition-plan-v2
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('Make sure .env.local contains:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// ============================================================================
// INGREDIENT DATA
// ============================================================================

const INGREDIENTS_DATA = [
  // Proteins
  { name: 'Viande hachée 5%', category: 'protein', calories: 131, protein: 21, carbs: 0, fat: 5, unit: 'g' },
  { name: 'Bifteak', category: 'protein', calories: 150, protein: 26, carbs: 0, fat: 5, unit: 'g' },
  { name: 'Blanc de poulet', category: 'protein', calories: 104, protein: 23, carbs: 0, fat: 1.2, unit: 'g' },
  { name: 'Émincé de poulet', category: 'protein', calories: 120, protein: 22, carbs: 0, fat: 3, unit: 'g' },
  { name: 'Saumon', category: 'protein', calories: 208, protein: 20, carbs: 0, fat: 13, unit: 'g' },
  { name: 'Thon conserve', category: 'protein', calories: 109, protein: 25, carbs: 0, fat: 0.5, unit: 'g' },
  { name: 'Oeufs', category: 'protein', calories: 155, protein: 13, carbs: 1.1, fat: 11, unit: 'piece', serving: 60 },
  
  // Dairy
  { name: 'Skyr 0%', category: 'dairy', calories: 59, protein: 10, carbs: 4, fat: 0.2, unit: 'g' },
  { name: 'Lait demi-écrémé', category: 'dairy', calories: 46, protein: 3.3, carbs: 4.8, fat: 1.6, unit: 'ml' },
  { name: 'Fromage Cantal', category: 'dairy', calories: 387, protein: 26, carbs: 0, fat: 31, unit: 'g' },
  { name: 'Emmental', category: 'dairy', calories: 356, protein: 28, carbs: 0, fat: 27, unit: 'g' },
  { name: 'Mayonnaise', category: 'fats', calories: 680, protein: 1, carbs: 0.6, fat: 75, unit: 'g' },
  
  // Carbs - Grains
  { name: 'Pâtes crues', category: 'grains', calories: 359, protein: 12, carbs: 74, fat: 1.5, unit: 'g' },
  { name: 'Riz Uncle Bens cuit', category: 'grains', calories: 157, protein: 3.2, carbs: 30, fat: 0.3, unit: 'g' },
  { name: 'Riz basmati cuit', category: 'grains', calories: 121, protein: 2.7, carbs: 25, fat: 0.3, unit: 'g' },
  { name: 'Pain de mie', category: 'grains', calories: 265, protein: 9, carbs: 49, fat: 3.5, unit: 'g' },
  { name: 'Pain complet', category: 'grains', calories: 247, protein: 9, carbs: 41, fat: 3.5, unit: 'tranche', serving: 40 },
  { name: 'Baguette', category: 'grains', calories: 280, protein: 9, carbs: 55, fat: 1.5, unit: 'g' },
  { name: 'Muesli', category: 'grains', calories: 363, protein: 10, carbs: 66, fat: 6, unit: 'g' },
  { name: 'Flocons d\'avoine', category: 'grains', calories: 389, protein: 17, carbs: 66, fat: 7, unit: 'g' },
  
  // Carbs - Starchy vegetables
  { name: 'Pommes de terre cuites', category: 'vegetables', calories: 86, protein: 2, carbs: 17, fat: 0.1, unit: 'g' },
  { name: 'Pommes de terre grenailles', category: 'vegetables', calories: 86, protein: 2, carbs: 17, fat: 0.1, unit: 'g' },
  
  // Vegetables
  { name: 'Tomate', category: 'vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, unit: 'piece', serving: 125 },
  { name: 'Purée de tomate', category: 'vegetables', calories: 38, protein: 2, carbs: 7.3, fat: 0.3, unit: 'g' },
  { name: 'Crudités mélangées', category: 'vegetables', calories: 20, protein: 1, carbs: 3, fat: 0.2, unit: 'g' },
  
  // Fruits
  { name: 'Banane', category: 'fruits', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, unit: 'piece', serving: 120 },
  { name: 'Fruits rouges', category: 'fruits', calories: 33, protein: 0.7, carbs: 7, fat: 0.3, unit: 'g' },
  
  // Fats & Condiments
  { name: 'Huile d\'olive', category: 'fats', calories: 884, protein: 0, carbs: 0, fat: 100, unit: 'ml' },
  { name: 'Purée d\'amandes', category: 'fats', calories: 614, protein: 25, carbs: 7, fat: 55, unit: 'g' },
  { name: 'Chocolat noir 85%', category: 'fats', calories: 592, protein: 7.8, carbs: 24, fat: 48, unit: 'carré', serving: 10 },
  { name: 'Miel', category: 'carbs', calories: 304, protein: 0.3, carbs: 82, fat: 0, unit: 'g' },
  
  // Supplements
  { name: 'Whey Native Isolate 94%', category: 'protein', calories: 370, protein: 88, carbs: 1, fat: 0.5, unit: 'g' },
]

async function importIngredients() {
  console.log('\n🥗 Importing Ingredients Master List...')
  
  const ingredientsToInsert = INGREDIENTS_DATA.map(ing => ({
    name: ing.name,
    category: ing.category,
    calories_per_100g: ing.calories,
    protein_per_100g: ing.protein,
    carbs_per_100g: ing.carbs,
    fat_per_100g: ing.fat,
    default_unit: ing.unit,
    default_serving_size: ing.serving || null,
    is_public: true
  }))
  
  const { data, error } = await supabase
    .from('ingredients_master')
    .upsert(ingredientsToInsert, { onConflict: 'name', ignoreDuplicates: false })
    .select()
  
  if (error) {
    console.error('❌ Error importing ingredients:', error)
    return []
  }
  
  console.log(`✅ Imported ${data.length} ingredients`)
  return data
}

// ============================================================================
// MEAL TEMPLATES WITH INGREDIENTS
// ============================================================================

async function importMealTemplates(ingredients: any[]) {
  console.log('\n🍽️  Importing Meal Templates...')
  
  // Helper to find ingredient by name
  const getIngredient = (name: string) => {
    const ing = ingredients.find(i => i.name === name)
    if (!ing) console.warn(`⚠️  Ingredient not found: ${name}`)
    return ing
  }
  
  // Define meal templates with their ingredients
  const templates = [
    {
      name: 'Spaghettis gourmands',
      description: 'Pâtes bolognaise avec viande hachée et fromage',
      meal_type: 'lunch',
      servings: 1,
      prep_time_minutes: 10,
      cook_time_minutes: 20,
      difficulty_level: 'easy',
      tags: ['high-protein', 'comfort-food'],
      ingredients: [
        { name: 'Pâtes crues', quantity: 160, unit: 'g' },
        { name: 'Viande hachée 5%', quantity: 175, unit: 'g', prep: 'cuite' },
        { name: 'Huile d\'olive', quantity: 10, unit: 'ml' },
        { name: 'Purée de tomate', quantity: 50, unit: 'g' },
        { name: 'Fromage Cantal', quantity: 30, unit: 'g', prep: 'râpé' }
      ]
    },
    {
      name: 'Bowl gourmand',
      description: 'Bowl protéiné avec skyr, muesli, fruits et chocolat',
      meal_type: 'breakfast',
      servings: 1,
      prep_time_minutes: 5,
      cook_time_minutes: 0,
      difficulty_level: 'easy',
      tags: ['breakfast', 'high-protein', 'quick'],
      ingredients: [
        { name: 'Skyr 0%', quantity: 250, unit: 'g' },
        { name: 'Muesli', quantity: 100, unit: 'g' },
        { name: 'Whey Native Isolate 94%', quantity: 30, unit: 'g' },
        { name: 'Banane', quantity: 1, unit: 'piece' },
        { name: 'Fruits rouges', quantity: 100, unit: 'g' },
        { name: 'Purée d\'amandes', quantity: 25, unit: 'g' },
        { name: 'Miel', quantity: 10, unit: 'g' },
        { name: 'Chocolat noir 85%', quantity: 1, unit: 'carré' }
      ]
    },
    {
      name: 'Club gourmand',
      description: 'Sandwich club poulet emmental',
      meal_type: 'lunch',
      servings: 1,
      prep_time_minutes: 10,
      cook_time_minutes: 0,
      difficulty_level: 'easy',
      tags: ['sandwich', 'quick'],
      ingredients: [
        { name: 'Pain de mie', quantity: 120, unit: 'g' }, // ~4 slices
        { name: 'Émincé de poulet', quantity: 150, unit: 'g' },
        { name: 'Emmental', quantity: 50, unit: 'g' }, // ~2 slices
        { name: 'Mayonnaise', quantity: 15, unit: 'g' },
        { name: 'Tomate', quantity: 1, unit: 'piece' },
        { name: 'Banane', quantity: 1, unit: 'piece' },
        { name: 'Chocolat noir 85%', quantity: 1, unit: 'carré' }
      ]
    },
    {
      name: 'Pancakes gourmands',
      description: 'Pancakes protéinés avec fruits et chocolat',
      meal_type: 'breakfast',
      servings: 1,
      prep_time_minutes: 10,
      cook_time_minutes: 15,
      difficulty_level: 'medium',
      tags: ['breakfast', 'high-protein'],
      ingredients: [
        { name: 'Oeufs', quantity: 4, unit: 'piece' },
        { name: 'Banane', quantity: 2, unit: 'piece' },
        { name: 'Whey Native Isolate 94%', quantity: 30, unit: 'g' },
        { name: 'Lait demi-écrémé', quantity: 250, unit: 'ml' },
        { name: 'Fruits rouges', quantity: 100, unit: 'g' },
        { name: 'Miel', quantity: 20, unit: 'g' },
        { name: 'Chocolat noir 85%', quantity: 2, unit: 'carré' }
      ]
    },
    {
      name: 'Basmati gourmand',
      description: 'Riz basmati avec bifteak et sauce tomate',
      meal_type: 'dinner',
      servings: 1,
      prep_time_minutes: 10,
      cook_time_minutes: 25,
      difficulty_level: 'easy',
      tags: ['high-protein'],
      ingredients: [
        { name: 'Riz basmati cuit', quantity: 300, unit: 'g' },
        { name: 'Bifteak', quantity: 200, unit: 'g', prep: 'cuit' },
        { name: 'Huile d\'olive', quantity: 10, unit: 'ml' },
        { name: 'Purée de tomate', quantity: 50, unit: 'g' }
      ]
    },
    {
      name: 'Omelette gourmande',
      description: 'Omelette avec pommes de terre et viande',
      meal_type: 'dinner',
      servings: 1,
      prep_time_minutes: 10,
      cook_time_minutes: 30,
      difficulty_level: 'medium',
      tags: ['high-protein'],
      ingredients: [
        { name: 'Pommes de terre grenailles', quantity: 500, unit: 'g', prep: 'cuites' },
        { name: 'Oeufs', quantity: 3, unit: 'piece' },
        { name: 'Bifteak', quantity: 100, unit: 'g', prep: 'haché cuit' }
      ]
    }
  ]
  
  const createdTemplates: any[] = []
  
  for (const template of templates) {
    try {
      // 1. Check if template already exists
      const { data: existingTemplate } = await supabase
        .from('meal_templates_v2')
        .select('id, name')
        .eq('name', template.name)
        .eq('is_public', true)
        .single()
      
      if (existingTemplate) {
        console.log(`⏭️  Skipped (exists): ${template.name}`)
        createdTemplates.push(existingTemplate)
        continue
      }
      
      // 2. Create the template
      const { data: templateData, error: templateError } = await supabase
        .from('meal_templates_v2')
        .insert({
          name: template.name,
          description: template.description,
          meal_type: template.meal_type,
          servings: template.servings,
          prep_time_minutes: template.prep_time_minutes,
          cook_time_minutes: template.cook_time_minutes,
          difficulty_level: template.difficulty_level,
          tags: template.tags,
          is_public: true,
          is_verified: true
        })
        .select()
        .single()
      
      if (templateError) {
        console.error(`❌ Error creating template ${template.name}:`, templateError)
        continue
      }
      
      // 2. Add ingredients to the template
      const templateIngredients = template.ingredients.map((ing, index) => {
        const ingredient = getIngredient(ing.name)
        if (!ingredient) return null
        
        return {
          template_id: templateData.id,
          ingredient_id: ingredient.id,
          quantity: ing.quantity,
          unit: ing.unit,
          preparation_note: ing.prep || null,
          is_optional: false,
          display_order: index
        }
      }).filter(Boolean)
      
      if (templateIngredients.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('meal_template_ingredients')
          .insert(templateIngredients)
        
        if (ingredientsError) {
          console.error(`❌ Error adding ingredients to ${template.name}:`, ingredientsError)
        }
      }
      
      createdTemplates.push(templateData)
      console.log(`✅ Created: ${template.name}`)
      
    } catch (err) {
      console.error(`❌ Error processing template ${template.name}:`, err)
    }
  }
  
  console.log(`✅ Imported ${createdTemplates.length} meal templates`)
  return createdTemplates
}

// ============================================================================
// MAIN IMPORT
// ============================================================================

async function main() {
  console.log('🚀 Starting improved nutrition plan import...')
  console.log('='.repeat(60))
  
  try {
    // 1. Import ingredients
    const ingredients = await importIngredients()
    if (ingredients.length === 0) {
      throw new Error('Failed to import ingredients')
    }
    
    // 2. Import meal templates with ingredients
    const templates = await importMealTemplates(ingredients)
    
    // 3. Load or create protocol and phases (from previous script)
    console.log('\n📋 Setting up Protocol and Phases...')
    
    let protocol = await supabase
      .from('nutrition_protocols')
      .select('*')
      .eq('name', 'Protocole 2: Recomposition corporelle')
      .single()
    
    if (!protocol.data) {
      const { data: newProtocol } = await supabase
        .from('nutrition_protocols')
        .insert({
          name: 'Protocole 2: Recomposition corporelle',
          description: 'Programme adapté pour la recomposition corporelle'
        })
        .select()
        .single()
      protocol.data = newProtocol
    }
    
    console.log('✅ Protocol ready')
    
    // Get or create phases
    const { data: phases } = await supabase
      .from('protocol_phases')
      .select('*')
      .eq('protocol_id', protocol.data.id)
      .order('phase_order')
    
    if (!phases || phases.length === 0) {
      await supabase
        .from('protocol_phases')
        .insert([
          {
            protocol_id: protocol.data.id,
            phase_name: 'Maintenance',
            daily_calories: 2867,
            target_protein: 133,
            target_carbs: 398,
            target_fat: 83,
            phase_order: 1
          },
          {
            protocol_id: protocol.data.id,
            phase_name: 'Déficit -300kcal',
            daily_calories: 2567,
            target_protein: 133,
            target_carbs: 323,
            target_fat: 83,
            phase_order: 2
          }
        ])
      console.log('✅ Created phases')
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ Import completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - ${ingredients.length} ingredients imported`)
    console.log(`   - ${templates.length} meal templates created`)
    console.log(`   - Macros auto-calculated via database triggers`)
    console.log('\n🎯 Next steps:')
    console.log('   1. Check templates in /nutrition-plan')
    console.log('   2. Macros are automatically calculated')
    console.log('   3. Add custom ingredients as needed')
    console.log('   4. Create daily meal plans using these templates')
    
  } catch (error) {
    console.error('❌ Fatal error during import:', error)
    process.exit(1)
  }
}

main()
