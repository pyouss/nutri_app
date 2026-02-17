# Manual Testing Guide: Story 3.2 - Save Meal to Database

**Test Date:** 2026-02-05
**Dev Server:** http://localhost:3000
**Story:** 3-2-save-meal-to-database

---

## Pre-Testing Checklist

- [x] Dev server running on port 3000
- [ ] Logged into the application
- [ ] Supabase is connected and running
- [ ] Browser DevTools open (F12) for checking Network/Console

---

## Test Suite 1: Ingredient-Level Meal Entry

### Test 1.1: Create Meal with Multiple Ingredients ✅

**Steps:**
1. Navigate to: http://localhost:3000/meals/new
2. Enter meal name: "Grilled Chicken Salad"
3. Leave meal date as today
4. Ensure "Ingredient-Level Macros" is selected
5. Fill in first ingredient:
   - Name: "Chicken Breast"
   - Portion Size: 150 (grams)
   - Calories: 165
   - Protein: 31
   - Carbs: 0
   - Fat: 3.6
6. Click "Add Ingredient"
7. Fill in second ingredient:
   - Name: "Mixed Greens"
   - Portion Size: 85 (grams)
   - Calories: 15
   - Protein: 1.5
   - Carbs: 2.5
   - Fat: 0.2
8. Click "Log Meal"

**Expected Results:**
- ✅ Success message appears: "Your meal has been saved to your account"
- ✅ Success message auto-dismisses after 5 seconds (NEW FIX!)
- ✅ Form resets to default state
- ✅ Check Network tab: POST to `/api/meals` returns 201 status
- ✅ Response includes all fields including `updated_at` (NEW FIX!)

**Verify in Database:**
- Meal saved with correct user_id
- Total macros calculated: calories=180, protein=32.5, carbs=2.5, fat=3.8
- Ingredients stored as JSONB array

---

### Test 1.2: Validation - Portion Size Must Be Positive ✅

**Steps:**
1. Enter meal name: "Test Meal"
2. Select "Ingredient-Level Macros"
3. Try to enter portion size: 0 (zero)

**Expected Results:**
- ✅ NumberInput minimum is 0.1 (can't enter 0) - **FIXED!**
- ✅ If you manually type 0 and submit, backend validation rejects it
- ✅ Error message: "Portion size must be positive"

---

### Test 1.3: Add/Remove Multiple Ingredients

**Steps:**
1. Start with 1 ingredient
2. Click "Add Ingredient" 3 times (should have 4 total)
3. Fill in all 4 ingredients with valid data
4. Click delete (trash icon) on ingredient 2
5. Submit form

**Expected Results:**
- ✅ Can add unlimited ingredients
- ✅ Can remove ingredients (minimum 1 remains)
- ✅ Meal saves with 3 ingredients (after deletion)

---

## Test Suite 2: Meal-Level Entry

### Test 2.1: Create Meal with Total Macros Only

**Steps:**
1. Navigate to: http://localhost:3000/meals/new
2. Enter meal name: "Quick Lunch"
3. Select "Meal-Level Macros"
4. Enter:
   - Total Calories: 450
   - Protein: 35
   - Carbs: 40
   - Fat: 15
5. Click "Log Meal"

**Expected Results:**
- ✅ Success message appears
- ✅ Form resets
- ✅ Check Network: POST returns 201
- ✅ Response has `ingredients: null` (not included for meal-level)

---

### Test 2.2: Validation - At Least One Macro Required

**Steps:**
1. Enter meal name: "Empty Macros Test"
2. Select "Meal-Level Macros"
3. Leave ALL macro fields empty
4. Click "Log Meal"

**Expected Results:**
- ✅ Frontend validation error: "At least one macro value is required"
- ✅ Cannot submit until at least one macro is filled

---

## Test Suite 3: Code Review Fixes Verification

### Test 3.1: Success Message Accuracy (HIGH FIX)

**Steps:**
1. Log any meal successfully
2. Read the success message carefully

**Expected Results:**
- ✅ Message says: "Your meal has been saved to your account"
- ✅ Does NOT say "will be saved" - **FIXED!**
- ✅ Message auto-dismisses after 5 seconds - **NEW!**

---

### Test 3.2: Cancel Button Safety (HIGH FIX)

**Steps:**
1. Open new tab directly to: http://localhost:3000/meals/new
2. Click "Cancel" button

**Expected Results:**
- ✅ Navigates to `/dashboard` (not router.back()) - **FIXED!**
- ✅ Does NOT navigate to blank page or external site

---

### Test 3.3: Portion Size Min Value (HIGH FIX)

**Steps:**
1. Click on Portion Size field
2. Try using down arrow or manually typing "0"

**Expected Results:**
- ✅ Cannot go below 0.1 - **FIXED!**
- ✅ Backend validation also requires positive value (>0)

---

### Test 3.4: API Response Completeness (MEDIUM FIX)

**Steps:**
1. Log any meal
2. Open DevTools Network tab
3. Check the POST `/api/meals` response

**Expected Results:**
- ✅ Response includes `updated_at` field - **FIXED!**
- ✅ Response structure matches:
```json
{
  "id": "uuid",
  "meal_name": "...",
  "meal_date": "2026-02-05",
  "total_calories": 180,
  "total_protein": 32.5,
  "total_carbs": 2.5,
  "total_fat": 3.8,
  "ingredients": [...],
  "created_at": "...",
  "updated_at": "..."  ← NEW!
}
```

---

## Test Suite 4: Error Handling

### Test 4.1: Invalid JSON (MEDIUM FIX)

**Using browser console:**
```javascript
fetch('/api/meals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: 'invalid json{{'
}).then(r => r.json()).then(console.log)
```

**Expected Results:**
- ✅ Returns 400 status
- ✅ Error message: "Invalid JSON in request body" - **NEW FIX!**

---

### Test 4.2: Zod Validation Errors

**Steps:**
1. Try to submit with empty meal name
2. Check error response in Network tab

**Expected Results:**
- ✅ Returns 400 status
- ✅ Error structure includes `error.issues` (Zod format)
- ✅ User-friendly error message displayed in UI

---

### Test 4.3: Authentication Check

**Steps:**
1. Log out (if logged in)
2. Navigate directly to: http://localhost:3000/meals/new
3. Try to submit a meal

**Expected Results:**
- ✅ Either redirected to login (middleware)
- ✅ OR API returns 401 Unauthorized if form is visible

---

## Test Suite 5: Date Handling

### Test 5.1: Past Date

**Steps:**
1. Enter meal name: "Yesterday's Meal"
2. Change date to yesterday
3. Submit

**Expected Results:**
- ✅ Meal saved with correct past date
- ✅ No validation errors

---

### Test 5.2: Future Date

**Steps:**
1. Enter meal name: "Tomorrow's Meal"
2. Change date to tomorrow
3. Submit

**Expected Results:**
- ✅ Meal saved with correct future date
- ✅ No validation errors

---

## Acceptance Criteria Verification

Review all ACs from Story 3.2:

- [ ] **AC1:** Meal is saved to database via API route ✅
- [ ] **AC2:** Meal data includes: meal name, ingredients, macro values, portion sizes, meal date ✅
- [ ] **AC3:** Meal is associated with my user account ✅
- [ ] **AC4:** Success message is displayed after saving ✅ (FIXED)
- [ ] **AC5:** I am redirected to meal list OR can continue logging ✅ (Form reset = continue logging)
- [ ] **AC6:** Error handling displays user-friendly messages if save fails ✅

---

## Supabase Database Verification

**Check meals table:**
```sql
SELECT 
  id, 
  user_id, 
  meal_name, 
  total_calories, 
  total_protein, 
  total_carbs, 
  total_fat,
  ingredients,
  meal_date,
  created_at,
  updated_at
FROM meals
ORDER BY created_at DESC
LIMIT 5;
```

**Verify:**
- [ ] All test meals are present
- [ ] user_id matches your authenticated user
- [ ] ingredients column has JSONB data for ingredient-level meals
- [ ] ingredients column is NULL for meal-level meals
- [ ] Total macros calculated correctly for ingredient-level

---

## Known Issues (LOW Priority - Documented)

These are documented for future enhancement but don't block testing:

1. **Console.error logs full error details** - Acceptable for development
2. **Zod error details exposed to client** - Useful for debugging, will sanitize in production

---

## Testing Complete! ✅

When all tests pass, Story 3.2 is verified as **DONE**.

**Next Steps:**
- Move to Story 3.3: View Meal List
- Create comprehensive meal viewing functionality
