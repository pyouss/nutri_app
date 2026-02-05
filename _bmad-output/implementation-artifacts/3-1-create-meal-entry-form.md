# Story 3.1: Create Meal Entry Form

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to enter meal information including name, ingredients, and macro values,
So that I can log my meals for tracking.

## Acceptance Criteria

1. **Given** I am logged in and on the meal entry page
   **When** I fill out the meal entry form
   **Then** I can enter a meal name (FR1)
   **And** I can add ingredients to the meal
   **And** I can enter macro values at the ingredient level (calories, protein, carbs, fat per ingredient) (FR2)
   **And** I can enter macro values at the meal level (total calories, protein, carbs, fat for the entire meal) (FR3)
   **And** I can specify portion sizes and quantities for ingredients (FR4)
   **And** Form validation prevents submission with invalid data
   **And** I can submit the form to save the meal

## Tasks / Subtasks

- [x] Create meal entry page route (AC: 1)
  - [x] Create `app/meals/new/page.tsx` for the meal entry form
  - [x] Add route to navigation/menu (added "Log Meal" button to home page and dashboard)
- [x] Implement meal name input field (AC: 1)
  - [x] Add meal name input with validation (required, max length)
  - [x] Add form label and error messages
- [x] Implement ingredient list functionality (AC: 1)
  - [x] Add "Add Ingredient" button
  - [x] Create ingredient row component with remove button
  - [x] Support dynamic add/remove of ingredients
- [x] Implement ingredient-level macro fields (AC: 1)
  - [x] Add fields for ingredient name
  - [x] Add fields for portion size/quantity
  - [x] Add fields for calories, protein, carbs, fat per ingredient
  - [x] Add validation for numeric fields
- [x] Implement meal-level macro fields (AC: 1)
  - [x] Add fields for total calories, protein, carbs, fat
  - [x] Add toggle or mode selector for ingredient-level vs meal-level entry
  - [x] Add validation for numeric fields
- [x] Add form validation (AC: 1)
  - [x] Validate meal name is required
  - [x] Validate at least one macro entry method is used (ingredient-level OR meal-level)
  - [x] Validate numeric fields are positive numbers
  - [x] Display validation errors clearly
- [x] Add form submission handler (AC: 1)
  - [x] Create submit handler (will save in Story 3.2, for now just log/validate)
  - [x] Add loading state during submission
  - [x] Add success/error message display
- [x] Style form with Chakra UI (AC: 1)
  - [x] Use Chakra UI components for consistent styling
  - [x] Make form responsive
  - [x] Add proper spacing and layout

## Dev Notes

**Form Structure:**
- Meal name (required text input)
- Entry mode toggle: "Ingredient-level macros" vs "Meal-level macros"
- If ingredient-level:
  - Dynamic list of ingredients
  - Each ingredient: name, portion size (g), calories, protein, carbs, fat
  - Add/Remove ingredient buttons
- If meal-level:
  - Total calories, total protein, total carbs, total fat
- Meal date (default: today, can be changed)
- Submit button

**Validation Rules:**
- Meal name: required, max 255 characters
- At least one macro entry method must be used
- If ingredient-level: at least one ingredient required
- Numeric fields: must be positive numbers (>= 0)
- Portion sizes: must be positive numbers (> 0)

**UI/UX Considerations:**
- Clear visual distinction between ingredient-level and meal-level entry modes
- Easy to add/remove ingredients
- Real-time validation feedback
- Loading states during submission
- Success/error messages

**Technical Notes:**
- Use Chakra UI FormControl, FormLabel, FormErrorMessage components
- Use state management for form data
- Form submission will be implemented in Story 3.2 (Save Meal to Database)
- For now, form submission can just validate and show success message

## File List

- `app/meals/new/page.tsx` - Meal entry form page
- (Story 3.2 will add API route for saving meals)

## Completion Notes

**Implementation Summary:**
- Created meal entry form page at `app/meals/new/page.tsx`
- Implemented meal name input with validation (required, max 255 characters)
- Added meal date picker (defaults to today)
- Implemented macro entry mode toggle (ingredient-level vs meal-level)
- For ingredient-level mode:
  - Dynamic ingredient list with add/remove functionality
  - Each ingredient has: name, portion size (g), calories, protein, carbs, fat
  - Validation for all ingredient fields
- For meal-level mode:
  - Total calories, protein, carbs, fat fields
  - Validation for at least one macro value
- Comprehensive form validation:
  - Meal name required and max length validation
  - Numeric field validation (positive numbers, >= 0)
  - Portion size validation (must be > 0)
  - Real-time validation feedback
- Form submission handler:
  - Validates all fields before submission
  - Checks authentication
  - Logs meal data (actual saving will be in Story 3.2)
  - Shows success/error messages
  - Resets form after successful validation
- Added navigation links:
  - "Log Meal" button on home page (when logged in)
  - "Log New Meal" button on dashboard
- Styled with Chakra UI:
  - Responsive layout
  - Proper spacing and visual hierarchy
  - Loading states and error/success alerts
  - NumberInput components for numeric fields

**Technical Details:**
- Used Chakra UI FormControl, FormLabel, FormErrorMessage for form fields
- Used NumberInput components for numeric inputs with steppers
- State management for form data and validation errors
- Dynamic ingredient list with unique IDs
- Form submission currently validates and logs data (saving to database in Story 3.2)

**Next Steps:**
- Story 3.2 will implement the API route to save meals to the database
- Story 3.3 will implement the meal list view
