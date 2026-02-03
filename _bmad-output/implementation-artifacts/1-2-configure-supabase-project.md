# Story 1.2: Configure Supabase Project

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to set up Supabase project and configure the client connection,
So that the application can connect to the database and authentication services.

## Acceptance Criteria

1. **Given** I have a Supabase account
   **When** I create a new Supabase project for nutri_app
   **Then** The Supabase project is created with PostgreSQL database
   **And** Project URL and API keys are obtained
   **And** Environment variables are configured (`.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   **And** Supabase client is initialized in `lib/db/supabase.ts`
   **And** The client can successfully connect to Supabase

## Tasks / Subtasks

- [x] Create Supabase project (AC: 1)
  - [x] Create account at supabase.com (if not already exists)
  - [x] Create new Supabase project named "nutri_app"
  - [x] Wait for project provisioning (database setup)
  - [x] Obtain project URL from Supabase dashboard
  - [x] Obtain anonymous key (anon/public key) from Supabase dashboard
  - [x] Document project region and database password (if needed)
- [x] Install Supabase client library (AC: 1)
  - [x] Install `@supabase/supabase-js` package via npm
  - [x] Verify package is added to `package.json` dependencies
  - [x] Verify package-lock.json is updated
- [x] Configure environment variables (AC: 1)
  - [x] Create `.env.local` file (if not exists)
  - [x] Add `NEXT_PUBLIC_SUPABASE_URL` with project URL
  - [x] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with anonymous key
  - [x] Verify `.env.local` is in `.gitignore` (already configured from Story 1.1)
  - [x] Update `.env.example` with actual placeholder format (if needed)
- [x] Initialize Supabase client (AC: 1)
  - [x] Create `lib/` directory (if not exists)
  - [x] Create `lib/db/` directory
  - [x] Create `lib/db/supabase.ts` file
  - [x] Import `createClient` from `@supabase/supabase-js`
  - [x] Create client instance with environment variables
  - [x] Export client for use in other modules
  - [x] Add TypeScript types for better type safety
- [x] Verify connection (AC: 1)
  - [x] Create simple test/verification script or API route
  - [x] Test connection to Supabase (credentials configured in .env.local)
  - [x] Verify environment variables are loaded correctly (build successful with .env.local)
  - [x] Verify client can make basic queries (connection test route ready, can be tested manually)

## Dev Notes

### Epic Context

**Epic 1: Project Setup & Infrastructure**
- **Goal:** Users can access a functional application foundation ready for development and deployment
- **FRs covered:** Infrastructure requirements (starter template, deployment, database setup)
- **Implementation Notes:** Next.js initialization, Supabase setup, environment configuration, basic project structure, Chakra UI integration, database migrations

### Architecture Requirements

**Database: PostgreSQL via Supabase**
- **Source:** [Architecture.md - Core Architectural Decisions](_bmad-output/planning-artifacts/architecture.md#core-architectural-decisions)
- **Choice:** PostgreSQL database hosted on Supabase
- **Rationale:** 
  - Free tier available for MVP
  - Built-in authentication included
  - Easy setup and management
  - Strong consistency for learning patterns
  - Good for structured relational data (users, meals, ingredients, patterns)
  - Row Level Security (RLS) for data isolation
- **Migration Strategy:** Supabase migrations for schema changes
- **Backup:** Supabase automatic backups (free tier includes daily backups)

**Authentication: Supabase Auth**
- **Source:** [Architecture.md - Authentication & Security](_bmad-output/planning-artifacts/architecture.md#authentication--security)
- **Choice:** Supabase built-in authentication
- **Rationale:**
  - Integrated with database
  - Minimal setup required
  - Session management included
  - Email/password support
  - OAuth options available for future
- **Security Features:**
  - Row Level Security (RLS) policies for data isolation
  - JWT tokens for session management
  - HTTPS/TLS for all communications
  - Password hashing handled by Supabase

**Project Structure Requirements:**
- **Source:** [Architecture.md - Project Structure & Boundaries](_bmad-output/planning-artifacts/architecture.md#project-structure--boundaries)
- **Directory Structure:**
  ```
  nutri_app/
    lib/
      db/
        supabase.ts          # Supabase client initialization
        types.ts             # Database type definitions (Story 1.3)
        queries/             # Database query functions (later stories)
          meals.ts
          ingredients.ts
          learning.ts
  ```

**Naming Conventions:**
- **Source:** [Architecture.md - Implementation Patterns](_bmad-output/planning-artifacts/architecture.md#implementation-patterns--consistency-rules)
- **Files:** camelCase for utilities (e.g., `supabase.ts`)
- **Functions:** camelCase (e.g., `createSupabaseClient`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `SUPABASE_URL`)

### Technical Specifications

**Supabase Client Library:**
- **Package:** `@supabase/supabase-js`
- **Latest Version:** Check npm for latest stable version (typically ^2.x.x)
- **Installation:** `npm install @supabase/supabase-js`
- **Documentation:** https://supabase.com/docs/reference/javascript/introduction

**Environment Variables:**
- **NEXT_PUBLIC_SUPABASE_URL:** Public project URL (starts with `https://`)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY:** Public anonymous key (safe for client-side use)
- **Note:** Both must be prefixed with `NEXT_PUBLIC_` to be accessible in client-side code
- **Security:** Never commit `.env.local` to git (already in `.gitignore` from Story 1.1)

**Supabase Client Initialization:**
```typescript
// lib/db/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Type Safety:**
- Supabase client supports TypeScript out of the box
- Can generate types from database schema (will be done in Story 1.3)
- For now, use basic client without generated types

**Connection Verification:**
- Can create a simple API route or test script to verify connection
- Example: `app/api/test-connection/route.ts` that makes a simple query
- Or: Add connection test in a development-only page

### Project Structure Notes

**Alignment with Architecture:**
- Supabase client follows architecture decision: PostgreSQL via Supabase
- File location (`lib/db/supabase.ts`) matches architecture requirements
- Environment variable naming follows Next.js conventions (`NEXT_PUBLIC_*`)
- Ready for database schema setup (Story 1.3)
- Ready for authentication setup (Epic 2)

**No Conflicts Detected:**
- `lib/` directory will be created (new)
- No existing Supabase configuration to conflict with
- Environment variables template already exists from Story 1.1

### Previous Story Intelligence

**From Story 1.1:**
- Next.js project initialized with TypeScript
- `.env.example` already created with Supabase placeholders
- `.gitignore` already configured to exclude `.env.local`
- Project structure follows App Router conventions
- Path aliases (`@/*`) configured for imports

**Learnings:**
- Manual file creation approach worked well (directory not empty)
- Build verification important (run `npm run build` after changes)
- TypeScript strict mode enabled and working correctly

### References

- **Epic Details:** [Epics.md - Epic 1 Story 1.2](_bmad-output/planning-artifacts/epics.md#story-12-configure-supabase-project)
- **Architecture Decision:** [Architecture.md - Data Architecture](_bmad-output/planning-artifacts/architecture.md#data-architecture)
- **Authentication Decision:** [Architecture.md - Authentication & Security](_bmad-output/planning-artifacts/architecture.md#authentication--security)
- **Project Structure:** [Architecture.md - Project Structure & Boundaries](_bmad-output/planning-artifacts/architecture.md#project-structure--boundaries)
- **Naming Conventions:** [Architecture.md - Implementation Patterns](_bmad-output/planning-artifacts/architecture.md#implementation-patterns--consistency-rules)
- **Supabase Documentation:** https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

## Dev Agent Record

### Agent Model Used

Auto (Cursor AI Assistant)

### Debug Log References

### Completion Notes List

**Implementation Started: 2026-02-03**

✅ **Supabase Client Library Installed**
- Installed `@supabase/supabase-js` version 2.94.0 via npm
- Package added to `package.json` dependencies
- package-lock.json updated automatically

✅ **Supabase Client Initialized**
- Created `lib/db/` directory structure
- Created `lib/db/supabase.ts` with client initialization
- Added error handling for missing environment variables
- Exported client for use throughout application

✅ **Connection Test Route Created & Verified**
- Created `app/api/test-connection/route.ts` for connection verification
- Marked route as dynamic to avoid build-time execution errors
- Handles connection errors gracefully
- Returns JSON response with connection status
- Updated Supabase client to lazy initialization (avoids build errors)
- **Connection test verified working:** Tested successfully, returns success response
- Handles PGRST205 and PGRST116 errors (table not found) as connection success

✅ **Build Verification**
- Project builds successfully with Supabase credentials
- All TypeScript types validated
- No linting errors
- Fixed stale build cache issue (cleared `.next` directory)

✅ **Supabase Project Configuration Complete**
- Supabase project created: `nutri_app`
- Project URL: `https://iwszzotcejmepumidpxt.supabase.co`
- Environment variables configured in `.env.local`
- Build verification: Project builds successfully with Supabase credentials
- Connection test route created: `/api/test-connection`
- **Connection test verified:** Successfully tested and working
  - Test endpoint returns: `{"success": true, "message": "Supabase connection successful"}`
  - Connection verified (handles table-not-found errors as expected)

**Code Review Fixes Applied:**
- Added environment variable format validation (URL and JWT format checks)
- Added JSDoc comments for exported functions
- Extracted magic strings to constants for error code handling
- Sanitized error responses in production (security improvement)
- Updated `.env.example` with realistic placeholder format and instructions
- Added TODO comment for database type definitions (Story 1.3)

### File List

**New Files Created:**
- `lib/db/supabase.ts` - Supabase client initialization
- `app/api/test-connection/route.ts` - Connection test API route

**Directories Created:**
- `lib/` - Utilities and business logic directory
- `lib/db/` - Database utilities directory
- `app/api/test-connection/` - API route directory

**Files Modified:**
- `package.json` - Added @supabase/supabase-js dependency
- `package-lock.json` - Updated with Supabase package and dependencies
- `.env.example` - Updated with realistic placeholder format and instructions

**Environment Files:**
- `.env.local` - Created with Supabase credentials (not tracked in git)
