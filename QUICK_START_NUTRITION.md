# 🚀 Quick Start - Nutrition Plan Integration

## Get Your Nutrition Plan Working in 5 Minutes!

### Step 1: Apply Database Migration (2 minutes)

Open Supabase Dashboard SQL Editor and run this:

```sql
-- Copy the contents of supabase/migrations/005_create_nutrition_plans.sql
-- Or use CLI: supabase db push
```

### Step 2: Add Service Role Key (1 minute)

Edit `.env.local` and add:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get it from: Supabase Dashboard → Settings → API → service_role

### Step 3: Import Your Data (1 minute)

```bash
npm run import:nutrition-plan
```

You should see:
```
✅ Protocol created
✅ Created 2 phases
✅ Imported 10 meal templates
✅ Imported 5 daily meal plans
✅ Import completed successfully!
```

### Step 4: Start Your Dev Server (30 seconds)

```bash
npm run dev
```

### Step 5: Use the Features! (immediately)

1. **Visit Dashboard**: http://localhost:3000/dashboard
   - See "My Nutrition Plan" button
   - View Daily Macro Tracker

2. **Set Up Your Plan**: http://localhost:3000/nutrition-plan
   - Click "Start This Plan" on Maintenance phase
   - Browse meal templates
   - View daily meal plans

3. **Log a Meal**: http://localhost:3000/meals
   - Click "Quick Add from Plan"
   - Select "Bowl gourmand" or any template
   - Watch your macro tracker update!

---

## 🎯 What You'll See

### Dashboard
```
┌─────────────────────────────────────────┐
│ Dashboard                               │
│ [My Nutrition Plan] [View Meals] [...]  │
├─────────────────────────────────────────┤
│ Today's Macros               [85% of target] │
│ Calories ████████░░ 2400 / 2867 kcal   │
│ Protein  ███████░░░ 95 / 133g          │
│ Carbs    ████████░░ 320 / 398g         │
│ Fat      ███████░░░ 68 / 83g           │
└─────────────────────────────────────────┘
```

### Nutrition Plan Page
```
┌─────────────────────────────────────────┐
│ Protocole 2: Recomposition corporelle  │
├─────────────────────────────────────────┤
│ Current Phase: Maintenance    [Active]  │
│ 2,867 kcal | 398G | 133P | 83L         │
│                                         │
│ [Meal Templates] [Daily Plans]         │
│ • Spaghettis gourmands (1000 kcal)     │
│ • Bowl gourmand (994 kcal)             │
│ • Club gourmand (970 kcal)             │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## ✅ Success Checklist

After following these steps, you should have:

- [x] 6 new database tables created
- [x] Protocole 2 with 2 phases imported
- [x] 10 meal templates available
- [x] 5 daily meal plans created
- [x] Dashboard showing macro tracker
- [x] Nutrition plan page accessible
- [x] Quick add button on meals page

---

## 🐛 Common Issues

**"Missing service role key"**
→ Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`

**"Table already exists"**
→ Migration already applied! Skip to Step 3

**"Protocol already exists"**
→ Data already imported! Go to `/nutrition-plan`

**Macro tracker shows "No plan active"**
→ Visit `/nutrition-plan` and click "Start This Plan"

---

## 📖 Full Documentation

For detailed information, see:
- `NUTRITION_PLAN_INTEGRATION_SUMMARY.md` - Complete guide
- `NUTRITION_PLAN_IMPORT.md` - Import details

---

## 🎉 You're Ready!

Your nutrition plan is integrated and ready to use. Start logging meals and tracking your macros!

**Pro Tip**: Use "Quick Add from Plan" for fastest meal logging with your pre-defined templates.
