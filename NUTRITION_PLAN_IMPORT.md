# Nutrition Plan Integration Guide

## Overview
This guide explains how to integrate your personalized nutrition plan into the app.

## Step 1: Run Database Migration

First, you need to apply the database schema for nutrition plans:

```bash
# Using Supabase CLI (if you have it installed locally)
supabase db push

# OR manually apply the migration in your Supabase dashboard
# Go to SQL Editor and run the contents of:
# supabase/migrations/005_create_nutrition_plans.sql
```

## Step 2: Set Up Service Role Key

The import script needs admin privileges to populate the database. Add this to your `.env.local`:

```env
# Add to .env.local (DO NOT commit this file!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

You can find your service role key in:
- Supabase Dashboard → Settings → API → service_role key (secret)

⚠️ **Important**: Never commit the service role key to version control!

## Step 3: Run the Import Script

```bash
npm run import:nutrition-plan
```

This will:
- Create the "Protocole 2: Recomposition corporelle" protocol
- Add maintenance and deficit phases with macro targets
- Import 10+ meal templates (Spaghettis gourmands, Bowl gourmand, etc.)
- Create sample daily meal plans for each phase

## Step 4: Assign Plan to Your User

After importing, you can assign the plan to your user account:

1. Go to `/nutrition-plan` (UI to be created)
2. Select "Protocole 2: Recomposition corporelle"  
3. Enter your personal information:
   - Age: 30
   - Height: 1.85m
   - Weight: 86kg
   - Body fat: 20%
4. Start with the "Maintenance" phase

## What Gets Imported

### Nutrition Protocol
- **Name**: Protocole 2: Recomposition corporelle
- **Phases**:
  - Maintenance: 2867 kcal (398G, 133P, 83L)
  - Déficit -300kcal: 2567 kcal (323G, 133P, 83L)

### Meal Templates (10 recipes)
1. Spaghettis gourmands (1000 kcal)
2. Baguette gourmande (1050 kcal)
3. Bowl gourmand (994 kcal)
4. Club gourmand (970 kcal)
5. Pancakes gourmands (900 kcal)
6. Pokebowl (850 kcal)
7. Basmati gourmand (823 kcal)
8. Poulet Crudités (770 kcal)
9. Omelette gourmande (700 kcal)
10. Subway Sub 30 (670 kcal)

### Daily Meal Plans
- 3 menus for maintenance phase (P+, L+, G+ variations)
- 2 menus for deficit phase
- Each menu combines multiple meal templates to hit daily targets

## Using the Nutrition Plan

Once imported, you can:
- View your daily macro targets
- Browse meal templates and save favorites
- See suggested daily meal plans
- Quick-add meals from templates to your daily tracking
- Track compliance with your macro goals

## Data Structure

The CSV files in `/ressources` contain:
- `Copie Tableau protocole nutriti.csv`: Your personal protocol and macro targets
- `Programme nutrition.csv`: Meal templates and daily menus
- `Programme sportif.csv`: Workout program (not yet integrated)

## Troubleshooting

### Import fails with "Missing environment variables"
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in `.env.local`

### No meal templates showing up
- Check that the migration was applied successfully
- Verify data was imported by checking the Supabase dashboard

### Can't find service role key
- Go to Supabase Dashboard → Settings → API
- Look for "service_role" key (not the anon key!)
- This key should start with "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

## Next Steps

After successful import:
1. Create a user nutrition plan page (`/nutrition-plan`)
2. Build meal template browser (`/meal-templates`)
3. Integrate with existing meal tracking
4. Add macro target tracking to dashboard
5. Create weekly progress views
