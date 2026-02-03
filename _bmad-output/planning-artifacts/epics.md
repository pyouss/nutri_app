---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md', '_bmad-output/planning-artifacts/ux-design-specification.md']
epicsApproved: true
storiesGenerated: true
validationComplete: true
totalEpics: 11
totalStories: 58
workflowStatus: 'complete'
---

# nutri_app - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for nutri_app, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can log meals by entering meal name, ingredients, and macro values

FR2: Users can enter macro values at the ingredient level (macros per ingredient)

FR3: Users can enter macro values at the meal level (total macros for the meal)

FR4: Users can specify portion sizes and quantities for ingredients

FR5: Users can edit previously logged meals

FR6: Users can delete previously logged meals

FR7: Users can duplicate a previously logged meal for quick re-entry

FR8: Users can log meals for specific dates (past, present, or future dates)

FR9: Users can view a list of all logged meals

FR10: Users can search or filter logged meals

FR11: The system remembers meals that users have logged previously

FR12: The system remembers ingredients that users have entered previously

FR13: The system learns meal patterns based on frequency of logging

FR14: The system learns portion preferences for ingredients based on user entries

FR15: The system learns ingredient combinations that appear together in meals

FR16: The system suggests previously logged meals when user starts typing meal name

FR17: The system suggests previously used ingredients when user starts typing ingredient name

FR18: The system prioritizes suggestions based on frequency of use (most frequently used items appear first)

FR19: The system detects when user is logging a meal they've logged before and suggests the complete meal

FR20: The system learns from user corrections when user modifies suggested meals or ingredients

FR21: The system builds a personalized database of ingredients and meals progressively as user tracks

FR22: The system converges to a stable database state over time as patterns become consistent

FR23: Users receive autocomplete suggestions for meal names as they type

FR24: Users receive autocomplete suggestions for ingredient names as they type

FR25: Autocomplete suggestions are frequency-weighted (most used items appear first)

FR26: Users can select from autocomplete suggestions to quickly fill in meal or ingredient names

FR27: The system suggests complete meals (with ingredients and macros) when user starts logging a frequently eaten meal

FR28: Users can accept suggested meals with one action (one-tap logging for learned habits)

FR29: The system suggests ingredients and macros based on learned patterns when user logs a similar meal

FR30: Users can describe meals using natural language when they don't know exact macro values

FR31: The system can estimate macro values from natural language meal descriptions

FR32: The system calculates confidence levels for macro estimates based on detail provided in the description

FR33: The system provides higher confidence estimates when users provide more specific details (e.g., potato type, cooking method)

FR34: The system provides lower confidence estimates when users provide less specific details

FR35: Users can refine macro estimates when more information becomes available

FR36: The system learns from user corrections to LLM-generated estimates

FR37: The system handles uncertain ingredients gracefully without blocking meal logging

FR38: Users can view their daily macro progress (protein, carbs, fats, calories)

FR39: Users can view visual progress indicators showing progress toward macro goals

FR40: Users can view summaries of their tracking data

FR41: Users can view logged meals for a specific day

FR42: Users can view macro totals for a specific day

FR43: Users can view macro totals for a specific week

FR44: Users can view their personalized ingredient database

FR45: Users can view their personalized meal templates

FR46: Users can see which meals and ingredients are most frequently used

FR47: Users can track meals at the daily level (detailed daily meal logging)

FR48: Users can view daily macro summaries

FR49: Users can view weekly macro summaries

FR50: Users can track batch-cooked meals (meals prepared in batches)

FR51: Users can associate batch-cooked meals with multiple daily entries

FR52: Users can adjust batch cooking proportions and see impact on daily macros

FR53: Users can create an account

FR54: Users can log in to their account

FR55: Users can log out of their account

FR56: Users can access their data from any device with internet connection

FR57: User data is stored persistently and available across sessions

FR58: Users can view their account information

FR59: Users can set macro goals (target protein, carbs, fats, calories)

FR60: Users can view progress toward their macro goals

FR61: Users can adjust their macro goals

FR62: The system displays progress indicators relative to user's goals

FR63: Users can access the application through a web browser on mobile devices

FR64: Users can access the application through a web browser on desktop devices

FR65: The application interface adapts to different screen sizes (responsive design)

FR66: Users can use the application while connected to the internet (online-only operation)

FR67: Users can correct macro values in previously logged meals

FR68: The system learns from user corrections to improve future suggestions

FR69: Users can refine ingredient macro values in their personal database

FR70: Users can refine meal templates in their personal database

FR71: The system identifies inconsistencies in user's database (e.g., same ingredient with different macro values)

FR72: Users can resolve database inconsistencies by choosing which values to keep

### NonFunctional Requirements

NFR1: Meal logging for learned meals completes within 5-10 seconds from start to finish

NFR2: Meal logging for frequently eaten meals (habits) completes within 1 second (one-tap confirmation)

NFR3: Autocomplete suggestions appear within 200ms of user typing

NFR4: Page load time is under 2 seconds on typical mobile network connection

NFR5: User interface interactions are responsive with no noticeable lag (sub-100ms response to user actions)

NFR6: Visual progress indicators update in real-time as user logs meals

NFR7: Database queries and data retrieval complete within 500ms for typical operations

NFR8: User authentication credentials are encrypted in transit

NFR9: User data is encrypted at rest in the database

NFR10: User sessions are secured with appropriate session management

NFR11: User data is isolated per user account (users cannot access other users' data)

NFR12: All data transmission uses secure protocols (HTTPS/TLS)

NFR13: User data is persisted reliably with no data loss

NFR14: User data is available across sessions (data persists after logout/login)

NFR15: System handles errors gracefully without losing user data

NFR16: User can recover from failed operations (e.g., network interruption during meal logging)

NFR17: System maintains data consistency (no corruption or partial saves)

NFR18: LLM agent integration is available when user requests macro estimation (if freely available LLM service is used)

NFR19: System handles LLM agent unavailability gracefully (user can still log meals manually if LLM is unavailable)

NFR20: LLM agent responses complete within 5 seconds for typical meal descriptions

NFR21: LLM agent integration maintains user privacy (meal descriptions are not stored by LLM service beyond processing)

### Additional Requirements

**Starter Template (Architecture):**
- Project initialization using: `npx create-next-app@latest nutri_app --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
- This is Epic 1 Story 1 - Project Setup

**Infrastructure and Deployment (Architecture):**
- Deploy to Vercel platform
- Configure environment variables (Supabase URL, API keys, OpenAI API key)
- Set up Supabase project with PostgreSQL database
- Configure Supabase Auth for authentication
- Set up database migrations in `supabase/migrations/` directory

**Integration Requirements (Architecture):**
- Integrate Supabase client for database and authentication
- Integrate OpenAI API for LLM macro estimation
- Implement API routes using Next.js App Router structure
- Configure Chakra UI design system with custom theme

**Data Migration/Setup (Architecture):**
- Create initial database schema with tables: users, meals, ingredients, learning_patterns, goals, frequency_tracking
- Set up Row Level Security (RLS) policies for user data isolation
- Create database indexes for performance (autocomplete, frequency queries)

**Security Implementation (Architecture):**
- Implement Row Level Security (RLS) policies in Supabase
- Configure API route middleware for authentication checks
- Ensure HTTPS/TLS for all communications (handled by Vercel/Supabase)

**API Design (Architecture):**
- RESTful API design with Next.js API routes
- Standardized error response format: `{error: {message, code}}`
- Direct API responses with appropriate HTTP status codes
- API endpoints follow RESTful plural naming: `/api/meals`, `/api/ingredients`, etc.

**Responsive Design (UX):**
- Mobile-first responsive design approach
- Support for Chakra UI breakpoints: sm (480px), md (768px), lg (992px), xl (1280px)
- Responsive grid system for desktop (up to 12 columns)
- Interface adapts to different screen sizes without losing functionality

**Accessibility (UX):**
- WCAG AA compliance for color contrast requirements
- Minimum 16px font size for body text (accessibility standard)
- Keyboard navigation support
- Screen reader compatibility

**Browser/Device Compatibility (UX):**
- Support for iOS Safari 14+
- Support for Android Chrome 90+
- Cross-platform compatibility (mobile and desktop browsers)

**User Interaction Patterns (UX):**
- Conversation-style interface for LLM meal description
- Timeline view for meal history
- Dashboard with progress indicators
- Quick action cards for one-tap logging
- Confidence indicators for data quality

**Error Handling UX (UX):**
- User-friendly error messages
- Graceful degradation for LLM unavailability
- Loading states for async operations
- Optimistic updates with rollback on error

### FR Coverage Map

FR1: Epic 3 - Basic Meal Logging - Log meals with meal name, ingredients, and macro values
FR2: Epic 3 - Basic Meal Logging - Enter macro values at ingredient level
FR3: Epic 3 - Basic Meal Logging - Enter macro values at meal level
FR4: Epic 3 - Basic Meal Logging - Specify portion sizes and quantities for ingredients
FR5: Epic 3 - Basic Meal Logging - Edit previously logged meals
FR6: Epic 3 - Basic Meal Logging - Delete previously logged meals
FR7: Epic 3 - Basic Meal Logging - Duplicate previously logged meals
FR8: Epic 3 - Basic Meal Logging - Log meals for specific dates
FR9: Epic 3 - Basic Meal Logging - View list of all logged meals
FR10: Epic 3 - Basic Meal Logging - Search or filter logged meals
FR11: Epic 4 - Learning & Memory System - System remembers previously logged meals
FR12: Epic 4 - Learning & Memory System - System remembers previously entered ingredients
FR13: Epic 4 - Learning & Memory System - System learns meal patterns based on frequency
FR14: Epic 4 - Learning & Memory System - System learns portion preferences for ingredients
FR15: Epic 4 - Learning & Memory System - System learns ingredient combinations
FR16: Epic 5 - Smart Suggestions & Autocomplete - System suggests previously logged meals when typing
FR17: Epic 5 - Smart Suggestions & Autocomplete - System suggests previously used ingredients when typing
FR18: Epic 5 - Smart Suggestions & Autocomplete - System prioritizes suggestions by frequency
FR19: Epic 5 - Smart Suggestions & Autocomplete - System detects and suggests complete meals
FR20: Epic 4 - Learning & Memory System - System learns from user corrections
FR21: Epic 4 - Learning & Memory System - System builds personalized database progressively
FR22: Epic 4 - Learning & Memory System - System converges to stable database state
FR23: Epic 5 - Smart Suggestions & Autocomplete - Users receive autocomplete for meal names
FR24: Epic 5 - Smart Suggestions & Autocomplete - Users receive autocomplete for ingredient names
FR25: Epic 5 - Smart Suggestions & Autocomplete - Autocomplete suggestions are frequency-weighted
FR26: Epic 5 - Smart Suggestions & Autocomplete - Users can select from autocomplete suggestions
FR27: Epic 5 - Smart Suggestions & Autocomplete - System suggests complete meals for frequently eaten meals
FR28: Epic 5 - Smart Suggestions & Autocomplete - Users can accept suggested meals with one action
FR29: Epic 5 - Smart Suggestions & Autocomplete - System suggests ingredients and macros based on learned patterns
FR30: Epic 6 - LLM Agent Integration - Users can describe meals using natural language
FR31: Epic 6 - LLM Agent Integration - System can estimate macro values from natural language descriptions
FR32: Epic 6 - LLM Agent Integration - System calculates confidence levels for macro estimates
FR33: Epic 6 - LLM Agent Integration - System provides higher confidence estimates with specific details
FR34: Epic 6 - LLM Agent Integration - System provides lower confidence estimates with less specific details
FR35: Epic 6 - LLM Agent Integration - Users can refine macro estimates when more information is available
FR36: Epic 4 - Learning & Memory System - System learns from user corrections to LLM-generated estimates
FR37: Epic 6 - LLM Agent Integration - System handles uncertain ingredients gracefully
FR38: Epic 7 - Progress Visualization & Dashboard - Users can view daily macro progress
FR39: Epic 7 - Progress Visualization & Dashboard - Users can view visual progress indicators
FR40: Epic 7 - Progress Visualization & Dashboard - Users can view summaries of tracking data
FR41: Epic 7 - Progress Visualization & Dashboard - Users can view logged meals for a specific day
FR42: Epic 7 - Progress Visualization & Dashboard - Users can view macro totals for a specific day
FR43: Epic 7 - Progress Visualization & Dashboard - Users can view macro totals for a specific week
FR44: Epic 7 - Progress Visualization & Dashboard - Users can view personalized ingredient database
FR45: Epic 7 - Progress Visualization & Dashboard - Users can view personalized meal templates
FR46: Epic 7 - Progress Visualization & Dashboard - Users can see most frequently used meals and ingredients
FR47: Epic 9 - Multi-Level Tracking - Users can track meals at daily level
FR48: Epic 7 - Progress Visualization & Dashboard - Users can view daily macro summaries
FR49: Epic 7 - Progress Visualization & Dashboard - Users can view weekly macro summaries
FR50: Epic 9 - Multi-Level Tracking - Users can track batch-cooked meals
FR51: Epic 9 - Multi-Level Tracking - Users can associate batch-cooked meals with multiple daily entries
FR52: Epic 9 - Multi-Level Tracking - Users can adjust batch cooking proportions and see impact
FR53: Epic 2 - User Authentication & Account Management - Users can create an account
FR54: Epic 2 - User Authentication & Account Management - Users can log in to their account
FR55: Epic 2 - User Authentication & Account Management - Users can log out of their account
FR56: Epic 2 - User Authentication & Account Management - Users can access data from any device
FR57: Epic 2 - User Authentication & Account Management - User data is stored persistently
FR58: Epic 2 - User Authentication & Account Management - Users can view their account information
FR59: Epic 8 - Goal Management - Users can set macro goals
FR60: Epic 8 - Goal Management - Users can view progress toward macro goals
FR61: Epic 8 - Goal Management - Users can adjust their macro goals
FR62: Epic 7 - Progress Visualization & Dashboard - System displays progress indicators relative to goals
FR63: Epic 11 - Responsive Design & Platform Access - Users can access application on mobile devices
FR64: Epic 11 - Responsive Design & Platform Access - Users can access application on desktop devices
FR65: Epic 11 - Responsive Design & Platform Access - Application interface adapts to different screen sizes
FR66: Epic 11 - Responsive Design & Platform Access - Users can use application while connected to internet
FR67: Epic 10 - Data Quality & Refinement - Users can correct macro values in previously logged meals
FR68: Epic 4 - Learning & Memory System - System learns from user corrections to improve suggestions
FR69: Epic 10 - Data Quality & Refinement - Users can refine ingredient macro values in personal database
FR70: Epic 10 - Data Quality & Refinement - Users can refine meal templates in personal database
FR71: Epic 10 - Data Quality & Refinement - System identifies inconsistencies in user's database
FR72: Epic 10 - Data Quality & Refinement - Users can resolve database inconsistencies

## Epic List

### Epic 1: Project Setup & Infrastructure
Users can access a functional application foundation ready for development and deployment. The application is initialized with the correct technology stack, database is configured, and deployment pipeline is ready.

**FRs covered:** Infrastructure requirements (starter template, deployment, database setup)

**Implementation Notes:** Next.js initialization, Supabase setup, environment configuration, basic project structure, Chakra UI integration, database migrations

### Epic 2: User Authentication & Account Management
Users can create accounts, log in securely, and access their data from any device with internet connection. User data is stored persistently and available across sessions.

**FRs covered:** FR53, FR54, FR55, FR56, FR57, FR58

**Implementation Notes:** Supabase Auth integration, session management, account information display, Row Level Security (RLS) policies, cross-device data access

### Epic 3: Basic Meal Logging
Users can log meals with ingredients and macro values, edit, delete, and view their meal history. Users can enter macros at ingredient level or meal level, specify portion sizes, and log meals for specific dates.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10

**Implementation Notes:** Core CRUD operations, meal entry forms, meal list view, search/filter functionality, date handling, flexible macro entry (ingredient-level or meal-level)

### Epic 4: Learning & Memory System
System remembers user's meals and ingredients, learns patterns based on frequency, and builds a personalized database progressively. System learns from user corrections and converges to a stable database state over time.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR20, FR21, FR22, FR36, FR68

**Implementation Notes:** Pattern recognition, frequency tracking, database convergence logic, learning from corrections, progressive database building, ingredient combination learning, portion preference learning

### Epic 5: Smart Suggestions & Autocomplete
System suggests meals and ingredients as users type, prioritizing frequently used items. System detects when users are logging familiar meals and suggests complete meals with one-tap logging for habits.

**FRs covered:** FR16, FR17, FR18, FR19, FR23, FR24, FR25, FR26, FR27, FR28, FR29

**Implementation Notes:** Autocomplete UI components, frequency-weighted ranking, one-tap logging for habits, complete meal suggestions, suggestion prioritization, 200ms response time requirement

### Epic 6: LLM Agent Integration
Users can describe uncertain meals in natural language and get macro estimates with confidence levels. System handles uncertainty gracefully without blocking meal logging, and users can refine estimates when more information becomes available.

**FRs covered:** FR30, FR31, FR32, FR33, FR34, FR35, FR37

**Implementation Notes:** OpenAI API integration, conversation interface, confidence calculation, graceful degradation, natural language processing, estimate refinement, 5-second response time requirement

### Epic 7: Progress Visualization & Dashboard
Users can view their daily and weekly macro progress, see visual indicators, and access their personalized database. Users can see which meals and ingredients are most frequently used.

**FRs covered:** FR38, FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR48, FR49, FR62

**Implementation Notes:** Progress rings, summary views, timeline, database views, frequency displays, real-time progress updates, visual progress indicators relative to goals

### Epic 8: Goal Management
Users can set macro goals (target protein, carbs, fats, calories) and track progress toward those goals. Users can adjust their goals as needed.

**FRs covered:** FR59, FR60, FR61

**Implementation Notes:** Goal setting interface, progress tracking relative to goals, goal adjustment, integration with progress visualization

### Epic 9: Multi-Level Tracking
Users can track meals at daily/weekly levels and handle batch cooking with proportion adjustments. Users can associate batch-cooked meals with multiple daily entries and see the impact of proportion changes.

**FRs covered:** FR47, FR50, FR51, FR52

**Implementation Notes:** Daily/weekly summaries, batch cooking relationships, proportion calculations, multi-level data relationships

### Epic 10: Data Quality & Refinement
Users can correct and refine their data, and system identifies and helps resolve inconsistencies. System learns from corrections to improve future suggestions.

**FRs covered:** FR67, FR69, FR70, FR71, FR72

**Implementation Notes:** Refinement workflows, inconsistency detection, resolution dialogs, learning from corrections, database quality improvement

### Epic 11: Responsive Design & Platform Access
Application works seamlessly on mobile and desktop devices with responsive design. Users can access the application through web browsers on any device while connected to the internet.

**FRs covered:** FR63, FR64, FR65, FR66

**Implementation Notes:** Mobile-first design, Chakra UI breakpoints, cross-browser compatibility, PWA capabilities, responsive grid system, WCAG AA accessibility compliance

## Epic 1: Project Setup & Infrastructure

Users can access a functional application foundation ready for development and deployment. The application is initialized with the correct technology stack, database is configured, and deployment pipeline is ready.

**FRs covered:** Infrastructure requirements (starter template, deployment, database setup)

### Story 1.1: Initialize Next.js Project

As a developer,
I want to initialize a Next.js project with TypeScript and proper project structure,
So that I have a solid foundation for building the nutri_app application.

**Acceptance Criteria:**

**Given** I have Node.js and npm installed on my development machine
**When** I run the Next.js initialization command
**Then** A new Next.js project is created with TypeScript support
**And** The project structure follows Next.js App Router conventions (`app/` directory)
**And** TypeScript configuration is set up with path aliases (`@/*`)
**And** Basic configuration files are created (package.json, tsconfig.json, next.config.js)
**And** Environment variable template file (`.env.example`) is created
**And** Git ignore file (`.gitignore`) is configured appropriately

### Story 1.2: Configure Supabase Project

As a developer,
I want to set up Supabase project and configure the client connection,
So that the application can connect to the database and authentication services.

**Acceptance Criteria:**

**Given** I have a Supabase account
**When** I create a new Supabase project for nutri_app
**Then** The Supabase project is created with PostgreSQL database
**And** Project URL and API keys are obtained
**And** Environment variables are configured (`.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
**And** Supabase client is initialized in `lib/db/supabase.ts`
**And** The client can successfully connect to Supabase

### Story 1.3: Set Up Database Schema Foundation

As a developer,
I want to create the initial database schema with core tables,
So that the application has the necessary data structure for users, meals, and ingredients.

**Acceptance Criteria:**

**Given** Supabase project is configured and connected
**When** I create the initial database migration
**Then** Migration file is created in `supabase/migrations/001_initial_schema.sql`
**And** `users` table is created with columns: id (UUID, primary key), email, created_at, updated_at
**And** `meals` table is created with columns: id (UUID, primary key), user_id (foreign key to users), meal_name, total_calories, total_protein, total_carbs, total_fat, meal_date, created_at, updated_at
**And** `ingredients` table is created with columns: id (UUID, primary key), user_id (foreign key to users), ingredient_name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, created_at, updated_at
**And** Row Level Security (RLS) policies are enabled on all tables
**And** Basic RLS policies are created to ensure users can only access their own data
**And** Database indexes are created for performance (user_id on meals and ingredients tables)
**And** Migration runs successfully without errors

### Story 1.4: Integrate Chakra UI Design System

As a developer,
I want to install and configure Chakra UI with the project theme,
So that I can use consistent UI components throughout the application.

**Acceptance Criteria:**

**Given** Next.js project is initialized
**When** I install Chakra UI and its dependencies
**Then** Chakra UI packages are installed (@chakra-ui/react, @emotion/react, @emotion/styled, framer-motion)
**And** Chakra UI provider is configured in `app/layout.tsx`
**And** Custom theme is created based on UX design specification (colors, typography, spacing)
**And** Theme is applied to the Chakra UI provider
**And** Basic Chakra UI components can be imported and used in the application
**And** Tailwind CSS is removed (if it was included in Next.js initialization)

### Story 1.5: Configure Deployment Pipeline

As a developer,
I want to set up Vercel deployment for the application,
So that the application can be deployed and accessed online.

**Acceptance Criteria:**

**Given** Next.js project is initialized and code is in a Git repository
**When** I configure Vercel deployment
**Then** Vercel project is created and linked to the Git repository
**And** Environment variables are configured in Vercel dashboard (Supabase URL, API keys)
**And** Deployment settings are configured (Node.js version, build command, output directory)
**And** Application deploys successfully to Vercel
**And** Application is accessible via Vercel-provided URL
**And** Environment variables are properly loaded in production

## Epic 2: User Authentication & Account Management

Users can create accounts, log in securely, and access their data from any device with internet connection. User data is stored persistently and available across sessions.

**FRs covered:** FR53, FR54, FR55, FR56, FR57, FR58

### Story 2.1: User Registration

As a new user,
I want to create an account with my email and password,
So that I can securely access the application and my personal data.

**Acceptance Criteria:**

**Given** I am on the signup page
**When** I enter a valid email address and password (meeting security requirements)
**Then** My account is created in Supabase Auth
**And** I am automatically logged in after successful registration
**And** A user record is created in the database
**And** I am redirected to the dashboard or home page
**And** Error messages are displayed if email is already registered or password doesn't meet requirements

### Story 2.2: User Login

As a registered user,
I want to log in with my email and password,
So that I can access my account and personal data.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I enter my registered email and correct password
**Then** I am authenticated via Supabase Auth
**And** A session is created and stored securely
**And** I am redirected to the dashboard or home page
**And** Error messages are displayed if email/password is incorrect
**And** My session persists across page refreshes

### Story 2.3: User Logout

As a logged-in user,
I want to log out of my account,
So that I can securely end my session and protect my account.

**Acceptance Criteria:**

**Given** I am logged into the application
**When** I click the logout button
**Then** My session is terminated
**And** I am redirected to the login page
**And** I cannot access protected pages without logging in again
**And** My session data is cleared from the client

### Story 2.4: Session Management and Protected Routes

As a logged-in user,
I want my session to be maintained across page refreshes and browser sessions,
So that I don't have to log in repeatedly.

**Acceptance Criteria:**

**Given** I am logged into the application
**When** I refresh the page or close and reopen the browser
**Then** My session is maintained and I remain logged in
**And** Protected routes (dashboard, meals, etc.) remain accessible
**And** Session expires appropriately after inactivity (if configured)
**And** User data is available across sessions (FR57)

### Story 2.5: Account Information Display

As a logged-in user,
I want to view my account information,
So that I can see my account details and manage my profile.

**Acceptance Criteria:**

**Given** I am logged into the application
**When** I navigate to my account/profile page
**Then** I can see my email address
**And** I can see my account creation date
**And** Account information is displayed in a user-friendly format
**And** I can access account settings (for future stories)

## Epic 3: Basic Meal Logging

Users can log meals with ingredients and macro values, edit, delete, and view their meal history. Users can enter macros at ingredient level or meal level, specify portion sizes, and log meals for specific dates.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10

### Story 3.1: Create Meal Entry Form

As a user,
I want to enter meal information including name, ingredients, and macro values,
So that I can log my meals for tracking.

**Acceptance Criteria:**

**Given** I am logged in and on the meal entry page
**When** I fill out the meal entry form
**Then** I can enter a meal name (FR1)
**And** I can add ingredients to the meal
**And** I can enter macro values at the ingredient level (calories, protein, carbs, fat per ingredient) (FR2)
**And** I can enter macro values at the meal level (total calories, protein, carbs, fat for the entire meal) (FR3)
**And** I can specify portion sizes and quantities for ingredients (FR4)
**And** Form validation prevents submission with invalid data
**And** I can submit the form to save the meal

### Story 3.2: Save Meal to Database

As a user,
I want my logged meals to be saved to the database,
So that my meal data is persisted and available later.

**Acceptance Criteria:**

**Given** I have filled out the meal entry form
**When** I submit the form
**Then** The meal is saved to the database via API route
**And** Meal data includes: meal name, ingredients (if ingredient-level), macro values, portion sizes, meal date
**And** Meal is associated with my user account
**And** Success message is displayed after saving
**And** I am redirected to meal list or can continue logging
**And** Error handling displays user-friendly messages if save fails

### Story 3.3: View Meal List

As a user,
I want to view a list of all my logged meals,
So that I can see my meal history.

**Acceptance Criteria:**

**Given** I am logged in and have logged meals
**When** I navigate to the meals page
**Then** I can see a list of all my logged meals (FR9)
**And** Each meal displays: meal name, date, and macro summary
**And** Meals are displayed in chronological order (most recent first)
**And** I can see meals from different dates
**And** Empty state is shown if I have no meals logged yet

### Story 3.4: Search and Filter Meals

As a user,
I want to search and filter my logged meals,
So that I can quickly find specific meals in my history.

**Acceptance Criteria:**

**Given** I have logged multiple meals
**When** I use the search or filter functionality
**Then** I can search meals by meal name (FR10)
**And** I can filter meals by date range
**And** Search results update in real-time as I type
**And** Filtered results are displayed correctly
**And** I can clear search/filters to see all meals again

### Story 3.5: Edit Meal

As a user,
I want to edit previously logged meals,
So that I can correct mistakes or update meal information.

**Acceptance Criteria:**

**Given** I have logged a meal
**When** I click edit on a meal
**Then** I can modify the meal name (FR5)
**And** I can modify ingredient information and macro values
**And** I can change portion sizes
**And** I can update the meal date
**And** Changes are saved to the database when I submit
**And** Success message confirms the update

### Story 3.6: Delete Meal

As a user,
I want to delete meals I no longer need,
So that I can remove incorrect or unwanted entries.

**Acceptance Criteria:**

**Given** I have logged a meal
**When** I click delete on a meal
**Then** A confirmation dialog asks me to confirm deletion (FR6)
**And** The meal is removed from the database when I confirm
**And** The meal disappears from the meal list
**And** Success message confirms the deletion
**And** Error handling displays message if deletion fails

### Story 3.7: Duplicate Meal

As a user,
I want to duplicate a previously logged meal,
So that I can quickly log the same meal again without re-entering all information.

**Acceptance Criteria:**

**Given** I have logged a meal
**When** I click duplicate on a meal
**Then** A new meal entry form is pre-filled with the meal's information (FR7)
**And** I can modify any fields before saving
**And** I can save the duplicated meal as a new entry
**And** The original meal remains unchanged

### Story 3.8: Log Meals for Specific Dates

As a user,
I want to log meals for past, present, or future dates,
So that I can track meals for any day, not just today.

**Acceptance Criteria:**

**Given** I am logging a meal
**When** I select a date for the meal
**Then** I can select today's date (FR8)
**And** I can select a past date
**And** I can select a future date
**And** The meal is associated with the selected date
**And** Meals are grouped by date in the meal list view

## Epic 4: Learning & Memory System

System remembers user's meals and ingredients, learns patterns based on frequency, and builds a personalized database progressively. System learns from user corrections and converges to a stable database state over time.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR20, FR21, FR22, FR36, FR68

### Story 4.1: Store Meal and Ingredient History

As a user,
I want the system to remember meals and ingredients I've logged,
So that the system can learn my eating patterns.

**Acceptance Criteria:**

**Given** I have logged meals with ingredients
**When** The system processes my meal entries
**Then** Previously logged meals are stored in the learning system (FR11)
**And** Previously entered ingredients are stored in the learning system (FR12)
**And** Meal and ingredient data is associated with my user account
**And** Data is stored in the learning_patterns table

### Story 4.2: Track Meal Frequency Patterns

As a user,
I want the system to learn which meals I eat frequently,
So that it can prioritize suggestions based on my habits.

**Acceptance Criteria:**

**Given** I have logged multiple meals over time
**When** The system analyzes my meal logging patterns
**Then** The system tracks frequency of each meal I log (FR13)
**And** Frequency counts are stored and updated with each meal entry
**And** Most frequently eaten meals are identified
**And** Frequency data is used for ranking suggestions (FR18)

### Story 4.3: Learn Portion Preferences

As a user,
I want the system to learn my typical portion sizes for ingredients,
So that it can suggest accurate portions when I log similar meals.

**Acceptance Criteria:**

**Given** I have logged meals with ingredient portions
**When** The system analyzes my portion entries
**Then** The system learns my portion preferences for each ingredient (FR14)
**And** Average portion sizes are calculated and stored
**And** Portion preferences are used when suggesting meals
**And** System adapts as I log more meals with different portions

### Story 4.4: Learn Ingredient Combinations

As a user,
I want the system to learn which ingredients I typically combine,
So that it can suggest complete meals based on my patterns.

**Acceptance Criteria:**

**Given** I have logged meals with multiple ingredients
**When** The system analyzes ingredient combinations
**Then** The system learns which ingredients appear together in my meals (FR15)
**And** Common ingredient combinations are identified and stored
**And** Combination patterns are used for meal suggestions
**And** System builds a network of ingredient relationships

### Story 4.5: Build Personalized Database Progressively

As a user,
I want the system to build my personal ingredient and meal database as I track,
So that I have a comprehensive database without manual setup.

**Acceptance Criteria:**

**Given** I am logging meals regularly
**When** The system processes my meal entries
**Then** A personalized database of ingredients is built progressively (FR21)
**And** A personalized database of meals is built progressively
**And** Database entries include macro values and portion information
**And** Database grows automatically as I log more meals
**And** I can view my personalized database (FR44, FR45)

### Story 4.6: Learn from User Corrections

As a user,
I want the system to learn when I correct suggested meals or ingredients,
So that suggestions improve over time.

**Acceptance Criteria:**

**Given** I have modified a suggested meal or ingredient
**When** The system processes my correction
**Then** The system updates its learning patterns based on my correction (FR20)
**And** Future suggestions reflect my corrections
**And** System learns from corrections to LLM-generated estimates (FR36)
**And** System improves suggestion accuracy over time (FR68)

### Story 4.7: Database Convergence Logic

As a user,
I want my database to stabilize over time as patterns become consistent,
So that suggestions become more accurate and reliable.

**Acceptance Criteria:**

**Given** I have been logging meals for an extended period
**When** The system analyzes my database state
**Then** The system detects when patterns become consistent (FR22)
**And** Database converges to a stable state
**And** Macro values and portion preferences stabilize
**And** System recognizes when learning has reached sufficient accuracy

## Epic 5: Smart Suggestions & Autocomplete

System suggests meals and ingredients as users type, prioritizing frequently used items. System detects when users are logging familiar meals and suggests complete meals with one-tap logging for habits.

**FRs covered:** FR16, FR17, FR18, FR19, FR23, FR24, FR25, FR26, FR27, FR28, FR29

### Story 5.1: Meal Name Autocomplete

As a user,
I want to receive autocomplete suggestions for meal names as I type,
So that I can quickly select previously logged meals.

**Acceptance Criteria:**

**Given** I am typing a meal name in the meal entry form
**When** I type at least 2 characters
**Then** Autocomplete suggestions appear for meal names (FR23)
**And** Suggestions are based on previously logged meals (FR16)
**And** Suggestions appear within 200ms of typing (NFR3)
**And** I can select a suggestion to auto-fill the meal name (FR26)
**And** Suggestions are frequency-weighted (most used items appear first) (FR25)

### Story 5.2: Ingredient Name Autocomplete

As a user,
I want to receive autocomplete suggestions for ingredient names as I type,
So that I can quickly select previously used ingredients.

**Acceptance Criteria:**

**Given** I am typing an ingredient name in the meal entry form
**When** I type at least 2 characters
**Then** Autocomplete suggestions appear for ingredient names (FR24)
**And** Suggestions are based on previously used ingredients (FR17)
**And** Suggestions appear within 200ms of typing (NFR3)
**And** I can select a suggestion to auto-fill the ingredient name (FR26)
**And** Suggestions are frequency-weighted (most used items appear first) (FR25)

### Story 5.3: Frequency-Weighted Suggestion Ranking

As a user,
I want the most frequently used items to appear first in suggestions,
So that I can quickly access my common meals and ingredients.

**Acceptance Criteria:**

**Given** I have logged multiple meals with varying frequencies
**When** I receive autocomplete suggestions
**Then** Suggestions are ranked by frequency of use (FR18)
**And** Most frequently used items appear at the top of the list
**And** Frequency data comes from the learning system
**And** Ranking updates as I log more meals

### Story 5.4: Complete Meal Suggestion Detection

As a user,
I want the system to detect when I'm logging a meal I've logged before,
So that it can suggest the complete meal with all ingredients and macros.

**Acceptance Criteria:**

**Given** I have previously logged a meal with ingredients and macros
**When** I start typing that meal name again
**Then** The system detects it's a previously logged meal (FR19)
**And** The system suggests the complete meal with all ingredients (FR27)
**And** Suggested meal includes all macro values
**And** I can see the full meal details in the suggestion

### Story 5.5: One-Tap Logging for Habits

As a user,
I want to accept suggested meals with one action for frequently eaten meals,
So that logging habits becomes extremely fast.

**Acceptance Criteria:**

**Given** I am logging a meal I eat frequently (habit)
**When** The system suggests the complete meal
**Then** I can accept the suggested meal with one tap/click (FR28)
**And** The meal is logged immediately without additional input
**And** Meal logging completes within 1 second for habits (NFR2)
**And** Success feedback confirms the meal was logged

### Story 5.6: Pattern-Based Ingredient and Macro Suggestions

As a user,
I want the system to suggest ingredients and macros based on learned patterns,
So that logging similar meals is faster and more accurate.

**Acceptance Criteria:**

**Given** I am logging a meal similar to ones I've logged before
**When** I enter the meal name
**Then** The system suggests ingredients based on learned patterns (FR29)
**And** The system suggests macro values based on learned patterns
**And** Suggestions are based on ingredient combinations I typically use
**And** I can accept, modify, or reject the suggestions

## Epic 6: LLM Agent Integration

Users can describe uncertain meals in natural language and get macro estimates with confidence levels. System handles uncertainty gracefully without blocking meal logging, and users can refine estimates when more information becomes available.

**FRs covered:** FR30, FR31, FR32, FR33, FR34, FR35, FR37

### Story 6.1: Natural Language Meal Description Interface

As a user,
I want to describe meals using natural language when I don't know exact macro values,
So that I can log meals even when I'm uncertain about the details.

**Acceptance Criteria:**

**Given** I am logging a meal and don't know exact macro values
**When** I use the natural language description interface
**Then** I can enter a meal description in natural language (FR30)
**And** I can describe ingredients, cooking methods, and portion sizes
**And** Interface provides guidance on what information to include
**And** I can submit the description for macro estimation

### Story 6.2: LLM Macro Estimation

As a user,
I want the system to estimate macro values from my natural language meal descriptions,
So that I can log meals without knowing exact nutritional information.

**Acceptance Criteria:**

**Given** I have submitted a natural language meal description
**When** The system processes my description
**Then** The system calls the LLM API to estimate macro values (FR31)
**And** Macro estimates are returned (calories, protein, carbs, fat)
**And** Response completes within 5 seconds for typical descriptions (NFR20)
**And** Estimates are displayed in a user-friendly format
**And** Error handling provides fallback if LLM is unavailable (NFR19)

### Story 6.3: Confidence Level Calculation

As a user,
I want to see confidence levels for macro estimates based on detail in my description,
So that I understand how accurate the estimates are.

**Acceptance Criteria:**

**Given** I have received macro estimates from the LLM
**When** The system calculates confidence levels
**Then** Confidence is calculated based on detail provided in description (FR32)
**And** Higher confidence is provided when I give specific details (e.g., potato type, cooking method) (FR33)
**And** Lower confidence is provided when I give less specific details (FR34)
**And** Confidence level is displayed clearly (high/medium/low or percentage)
**And** Confidence indicator helps me understand estimate reliability

### Story 6.4: Refine Macro Estimates

As a user,
I want to refine macro estimates when I have more information,
So that I can improve accuracy as I learn more about the meal.

**Acceptance Criteria:**

**Given** I have received macro estimates with a confidence level
**When** I provide additional information about the meal
**Then** I can refine the macro estimates (FR35)
**And** System recalculates estimates with new information
**And** Confidence level updates based on additional details
**And** I can accept the refined estimates or continue refining

### Story 6.5: Graceful Handling of Uncertain Ingredients

As a user,
I want the system to handle uncertain ingredients without blocking meal logging,
So that I can always log my meals even when details are incomplete.

**Acceptance Criteria:**

**Given** I am logging a meal with uncertain ingredients
**When** I describe the meal with incomplete information
**Then** The system provides estimates even with incomplete information (FR37)
**And** System handles uncertainty gracefully without blocking meal logging
**And** I can log the meal with estimated values
**And** I can mark estimates for later refinement
**And** System doesn't require perfect information to log meals

## Epic 7: Progress Visualization & Dashboard

Users can view their daily and weekly macro progress, see visual indicators, and access their personalized database. Users can see which meals and ingredients are most frequently used.

**FRs covered:** FR38, FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR48, FR49, FR62

### Story 7.1: Daily Macro Progress Display

As a user,
I want to view my daily macro progress (protein, carbs, fats, calories),
So that I can see how I'm tracking toward my goals.

**Acceptance Criteria:**

**Given** I have logged meals for today
**When** I view the dashboard
**Then** I can see my daily macro progress for protein, carbs, fats, and calories (FR38)
**And** Progress is calculated from all meals logged for today
**And** Progress updates in real-time as I log meals (NFR6)
**And** Progress is displayed clearly with numbers and visual indicators

### Story 7.2: Visual Progress Indicators

As a user,
I want to see visual progress indicators showing progress toward my macro goals,
So that I can quickly understand my progress at a glance.

**Acceptance Criteria:**

**Given** I have set macro goals and logged meals
**When** I view the dashboard
**Then** I can see visual progress indicators (progress rings or bars) for each macro (FR39)
**And** Progress indicators show progress relative to my goals (FR62)
**And** Indicators update in real-time as I log meals (NFR6)
**And** Visual indicators are color-coded for easy understanding
**And** Indicators are accessible and meet WCAG AA standards

### Story 7.3: Daily Meal List View

As a user,
I want to view logged meals for a specific day,
So that I can review what I ate on any given day.

**Acceptance Criteria:**

**Given** I have logged meals for multiple days
**When** I select a specific date
**Then** I can view all logged meals for that day (FR41)
**And** Meals are displayed in chronological order
**And** Each meal shows name, time (if available), and macro summary
**And** I can navigate between different dates
**And** Empty state is shown if no meals are logged for selected date

### Story 7.4: Daily Macro Summary

As a user,
I want to view macro totals for a specific day,
So that I can see my total consumption for that day.

**Acceptance Criteria:**

**Given** I have logged meals for a specific day
**When** I view the daily summary
**Then** I can see total macros for that day (protein, carbs, fats, calories) (FR42)
**And** Totals are calculated from all meals logged that day
**And** Summary is displayed clearly with breakdown by macro type
**And** Summary updates if I edit or delete meals for that day
**And** Daily summary is available for any date (FR48)

### Story 7.5: Weekly Macro Summary

As a user,
I want to view macro totals for a specific week,
So that I can see my weekly consumption patterns.

**Acceptance Criteria:**

**Given** I have logged meals for multiple days in a week
**When** I view the weekly summary
**Then** I can see total macros for the week (protein, carbs, fats, calories) (FR43)
**And** I can see average daily macros for the week
**And** Summary is displayed clearly with weekly totals
**And** I can navigate between different weeks
**And** Weekly summary is available for any week (FR49)

### Story 7.6: Tracking Data Summaries

As a user,
I want to view summaries of my tracking data,
So that I can understand my eating patterns over time.

**Acceptance Criteria:**

**Given** I have been tracking meals for a period of time
**When** I view data summaries
**Then** I can view summaries of my tracking data (FR40)
**And** Summaries show patterns and trends
**And** I can see statistics about my meal logging
**And** Summaries help me understand my eating habits

### Story 7.7: Personalized Ingredient Database View

As a user,
I want to view my personalized ingredient database,
So that I can see all ingredients I've used and their macro values.

**Acceptance Criteria:**

**Given** I have logged meals with ingredients
**When** I navigate to my ingredient database
**Then** I can view my personalized ingredient database (FR44)
**And** Database shows all ingredients I've used
**And** Each ingredient displays macro values (calories, protein, carbs, fat per 100g)
**And** Ingredients are searchable and filterable
**And** I can see which ingredients are most frequently used (FR46)

### Story 7.8: Personalized Meal Templates View

As a user,
I want to view my personalized meal templates,
So that I can see all meals I've created and reuse them.

**Acceptance Criteria:**

**Given** I have logged multiple meals
**When** I navigate to my meal templates
**Then** I can view my personalized meal templates (FR45)
**And** Templates show meal names, ingredients, and macro values
**And** Templates are searchable and filterable
**And** I can see which meals are most frequently used (FR46)
**And** I can use templates to quickly log meals

## Epic 8: Goal Management

Users can set macro goals (target protein, carbs, fats, calories) and track progress toward those goals. Users can adjust their goals as needed.

**FRs covered:** FR59, FR60, FR61

### Story 8.1: Set Macro Goals

As a user,
I want to set my macro goals (target protein, carbs, fats, calories),
So that I can track my progress toward my nutrition targets.

**Acceptance Criteria:**

**Given** I am logged in and on the goals page
**When** I set my macro goals
**Then** I can set target protein, carbs, fats, and calories (FR59)
**And** Goals are saved to the database
**And** Goals are associated with my user account
**And** I can see my goals displayed clearly
**And** Validation ensures goals are positive numbers

### Story 8.2: View Progress Toward Goals

As a user,
I want to view my progress toward my macro goals,
So that I can see how close I am to meeting my targets.

**Acceptance Criteria:**

**Given** I have set macro goals and logged meals
**When** I view the dashboard or goals page
**Then** I can see my progress toward each macro goal (FR60)
**And** Progress shows current consumption vs. goal
**And** Progress is displayed with visual indicators (progress rings/bars)
**And** Progress updates in real-time as I log meals
**And** I can see remaining macros needed to reach goals

### Story 8.3: Adjust Macro Goals

As a user,
I want to adjust my macro goals,
So that I can update my targets as my needs change.

**Acceptance Criteria:**

**Given** I have set macro goals
**When** I edit my goals
**Then** I can adjust any of my macro goals (protein, carbs, fats, calories) (FR61)
**And** Changes are saved to the database
**And** Progress indicators update to reflect new goals
**And** Historical progress data is preserved
**And** Success message confirms the update

## Epic 9: Multi-Level Tracking

Users can track meals at daily/weekly levels and handle batch cooking with proportion adjustments. Users can associate batch-cooked meals with multiple daily entries and see the impact of proportion changes.

**FRs covered:** FR47, FR50, FR51, FR52

### Story 9.1: Daily-Level Meal Tracking

As a user,
I want to track meals at the daily level with detailed meal logging,
So that I can see my consumption for each day.

**Acceptance Criteria:**

**Given** I am logging meals
**When** I log meals for a specific day
**Then** Meals are tracked at the daily level (FR47)
**And** Each meal is associated with a specific date
**And** Daily totals are calculated from all meals for that day
**And** I can view detailed daily meal breakdowns

### Story 9.2: Track Batch-Cooked Meals

As a user,
I want to track meals I've prepared in batches,
So that I can log batch-cooked meals efficiently.

**Acceptance Criteria:**

**Given** I have prepared a meal in a batch
**When** I log the batch-cooked meal
**Then** I can mark a meal as batch-cooked (FR50)
**And** Batch meal includes total quantity and macro values
**And** Batch meal is stored separately from daily meal entries
**And** I can see batch meals in my meal list

### Story 9.3: Associate Batch Meals with Daily Entries

As a user,
I want to associate batch-cooked meals with multiple daily entries,
So that I can track how much of a batch I consumed each day.

**Acceptance Criteria:**

**Given** I have a batch-cooked meal
**When** I log daily consumption from the batch
**Then** I can associate the batch meal with a daily entry (FR51)
**And** I can specify the portion/quantity consumed from the batch
**And** Daily macros are calculated based on the portion consumed
**And** I can associate the same batch meal with multiple days
**And** System tracks remaining batch quantity

### Story 9.4: Adjust Batch Cooking Proportions

As a user,
I want to adjust batch cooking proportions and see the impact on daily macros,
So that I can accurately track my consumption from batch meals.

**Acceptance Criteria:**

**Given** I have associated a batch meal with daily entries
**When** I adjust the proportion/quantity consumed
**Then** I can modify the portion size for a daily entry (FR52)
**And** Daily macro totals update automatically based on new proportion
**And** I can see the impact of proportion changes immediately
**And** Changes are saved to the database
**And** Historical proportions are preserved

## Epic 10: Data Quality & Refinement

Users can correct and refine their data, and system identifies and helps resolve inconsistencies. System learns from corrections to improve future suggestions.

**FRs covered:** FR67, FR69, FR70, FR71, FR72

### Story 10.1: Correct Macro Values in Logged Meals

As a user,
I want to correct macro values in previously logged meals,
So that I can fix mistakes and improve data accuracy.

**Acceptance Criteria:**

**Given** I have logged a meal
**When** I edit the meal to correct macro values
**Then** I can modify macro values (calories, protein, carbs, fat) (FR67)
**And** Corrections are saved to the database
**And** System learns from my corrections (FR68)
**And** Future suggestions reflect the corrected values
**And** Success message confirms the correction

### Story 10.2: Refine Ingredient Macro Values

As a user,
I want to refine ingredient macro values in my personal database,
So that my ingredient database becomes more accurate over time.

**Acceptance Criteria:**

**Given** I have ingredients in my personal database
**When** I refine an ingredient's macro values
**Then** I can update the macro values for an ingredient (FR69)
**And** Updated values are saved to my ingredient database
**And** All meals using that ingredient can use the refined values
**And** System learns from the refinement
**And** Refinement improves future suggestions

### Story 10.3: Refine Meal Templates

As a user,
I want to refine meal templates in my personal database,
So that my meal templates become more accurate over time.

**Acceptance Criteria:**

**Given** I have meal templates in my personal database
**When** I refine a meal template
**Then** I can update the meal template's ingredients and macros (FR70)
**And** Updated template is saved to my database
**And** Refined template is used for future suggestions
**And** System learns from the refinement
**And** Refinement improves template accuracy

### Story 10.4: Detect Database Inconsistencies

As a user,
I want the system to identify inconsistencies in my database,
So that I can find and fix data quality issues.

**Acceptance Criteria:**

**Given** I have logged meals and built a database
**When** The system analyzes my database
**Then** The system identifies inconsistencies (e.g., same ingredient with different macro values) (FR71)
**And** Inconsistencies are displayed clearly
**And** I can see which entries have conflicting values
**And** System highlights potential data quality issues
**And** I can review inconsistencies for resolution

### Story 10.5: Resolve Database Inconsistencies

As a user,
I want to resolve database inconsistencies by choosing which values to keep,
So that my database becomes consistent and accurate.

**Acceptance Criteria:**

**Given** The system has identified database inconsistencies
**When** I review and resolve inconsistencies
**Then** I can see conflicting values for the same ingredient/meal (FR72)
**And** I can choose which value to keep as the correct one
**And** Selected value becomes the standard for that ingredient/meal
**And** Conflicting entries are updated or removed
**And** Database becomes more consistent after resolution
**And** System learns from my resolution choices

## Epic 11: Responsive Design & Platform Access

Application works seamlessly on mobile and desktop devices with responsive design. Users can access the application through web browsers on any device while connected to the internet.

**FRs covered:** FR63, FR64, FR65, FR66

### Story 11.1: Mobile Device Access

As a user,
I want to access the application through a web browser on my mobile device,
So that I can log meals and track my nutrition on the go.

**Acceptance Criteria:**

**Given** I have a mobile device with a web browser
**When** I access the application URL
**Then** I can access the application on my mobile device (FR63)
**And** Application loads and functions correctly on mobile browsers
**And** Interface is optimized for mobile screen sizes
**And** Touch interactions work properly
**And** Application is compatible with iOS Safari 14+ and Android Chrome 90+

### Story 11.2: Desktop Device Access

As a user,
I want to access the application through a web browser on my desktop computer,
So that I can track my nutrition on my computer.

**Acceptance Criteria:**

**Given** I have a desktop computer with a web browser
**When** I access the application URL
**Then** I can access the application on my desktop device (FR64)
**And** Application loads and functions correctly on desktop browsers
**And** Interface is optimized for desktop screen sizes
**And** Mouse and keyboard interactions work properly
**And** Application works on major desktop browsers

### Story 11.3: Responsive Design Implementation

As a user,
I want the application interface to adapt to different screen sizes,
So that I have a good experience on any device.

**Acceptance Criteria:**

**Given** I access the application on different devices
**When** I view the application on various screen sizes
**Then** The application interface adapts to different screen sizes (FR65)
**And** Layout uses responsive design principles (mobile-first)
**And** Chakra UI breakpoints are implemented (sm: 480px, md: 768px, lg: 992px, xl: 1280px)
**And** Content remains accessible and functional at all screen sizes
**And** Navigation adapts appropriately (mobile drawer, desktop sidebar)
**And** Forms and inputs are appropriately sized for each device

### Story 11.4: Online-Only Operation

As a user,
I want to use the application while connected to the internet,
So that my data is synced and available across devices.

**Acceptance Criteria:**

**Given** I have an internet connection
**When** I use the application
**Then** I can use the application while connected to the internet (FR66)
**And** All data operations require internet connection
**And** Data is synced to the cloud database
**And** Changes are saved immediately when online
**And** Application indicates when offline (for future enhancement)
