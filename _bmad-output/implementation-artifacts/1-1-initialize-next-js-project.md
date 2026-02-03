# Story 1.1: Initialize Next.js Project

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to initialize a Next.js project with TypeScript and proper project structure,
So that I have a solid foundation for building the nutri_app application.

## Acceptance Criteria

1. **Given** I have Node.js and npm installed on my development machine
   **When** I run the Next.js initialization command
   **Then** A new Next.js project is created with TypeScript support
   **And** The project structure follows Next.js App Router conventions (`app/` directory)
   **And** TypeScript configuration is set up with path aliases (`@/*`)
   **And** Basic configuration files are created (package.json, tsconfig.json, next.config.js)
   **And** Environment variable template file (`.env.example`) is created
   **And** Git ignore file (`.gitignore`) is configured appropriately

## Tasks / Subtasks

- [x] Initialize Next.js project with TypeScript (AC: 1)
  - [x] Initialize Next.js project (manually created due to non-empty directory - matches create-next-app structure)
  - [x] Verify project structure follows App Router conventions (`app/` directory exists)
  - [x] Verify TypeScript is configured (tsconfig.json exists and is properly configured)
  - [x] Verify path aliases are set up (`@/*` configured in tsconfig.json)
- [x] Create environment variable template (AC: 1)
  - [x] Create `.env.example` file with placeholder values for:
    - `NEXT_PUBLIC_SUPABASE_URL` (will be configured in Story 1.2)
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (will be configured in Story 1.2)
    - `OPENAI_API_KEY` (will be configured later for LLM integration)
- [x] Verify Git configuration (AC: 1)
  - [x] Verify `.gitignore` file exists and includes:
    - `node_modules/`
    - `.next/`
    - `.env.local`
    - `.env*.local`
    - Other Next.js standard ignores
- [x] Verify project structure (AC: 1)
  - [x] Verify `app/` directory exists (App Router structure)
  - [x] Verify `app/layout.tsx` exists (root layout)
  - [x] Verify `app/page.tsx` exists (home page)
  - [x] Verify `package.json` exists with Next.js and TypeScript dependencies
  - [x] Verify `tsconfig.json` exists with proper TypeScript configuration
  - [x] Verify `next.config.js` exists (or `next.config.mjs`)

## Review Follow-ups (AI)

### Code Review Action Items

- [ ] [AI-Review][LOW] Enhance README.md with more comprehensive project documentation (project overview, architecture decisions, development workflow) [README.md:1-34]
- [ ] [AI-Review][LOW] Consider adding `.gitattributes` file for consistent line endings across platforms (optional but recommended for team collaboration)
- [ ] [AI-Review][LOW] Consider adding `.editorconfig` file for consistent code formatting across IDEs (optional but recommended)
- [ ] [AI-Review][LOW] Resolve @next/swc version mismatch warning (15.5.7 vs 15.5.11) - update package-lock.json or wait for dependency resolution [package-lock.json:version-mismatch]

## Dev Notes

### Epic Context

**Epic 1: Project Setup & Infrastructure**
- **Goal:** Users can access a functional application foundation ready for development and deployment
- **FRs covered:** Infrastructure requirements (starter template, deployment, database setup)
- **Implementation Notes:** Next.js initialization, Supabase setup, environment configuration, basic project structure, Chakra UI integration, database migrations

### Architecture Requirements

**Starter Template: Next.js with TypeScript**
- **Source:** [Architecture.md - Starter Template Evaluation](_bmad-output/planning-artifacts/architecture.md#starter-template-evaluation)
- **Initialization Command:**
  ```bash
  npx create-next-app@latest nutri_app --typescript --tailwind --app --no-src-dir --import-alias "@/*"
  ```
- **Note:** We'll use Chakra UI instead of Tailwind, but the `--tailwind` flag sets up the project structure. We can remove Tailwind and add Chakra UI in Story 1.4.

**Architectural Decisions:**
- **Language:** TypeScript (configured and ready)
- **Runtime:** Node.js
- **Build Tool:** Next.js built-in bundler (Turbopack for fast builds)
- **Code Organization:** App Router structure (`app/` directory)
- **Path Aliases:** `@/*` configured for imports
- **Styling:** CSS modules support (Chakra UI will be added in Story 1.4)

**Project Structure Requirements:**
- **Source:** [Architecture.md - Project Structure & Boundaries](_bmad-output/planning-artifacts/architecture.md#project-structure--boundaries)
- **Directory Structure:**
  ```
  nutri_app/
    app/                    # Next.js App Router (routes and features)
      layout.tsx            # Root layout
      page.tsx              # Home page
      api/                  # API routes (will be added in later stories)
    components/             # Shared React components (will be added later)
    lib/                    # Utilities, business logic (will be added later)
    public/                 # Static assets
    .env.example            # Environment variable template
    .gitignore              # Git ignore file
    next.config.js          # Next.js configuration
    package.json            # Dependencies
    tsconfig.json           # TypeScript configuration
  ```

**Naming Conventions:**
- **Source:** [Architecture.md - Implementation Patterns](_bmad-output/planning-artifacts/architecture.md#implementation-patterns--consistency-rules)
- **React Components:** PascalCase (e.g., `UserCard.tsx`)
- **Functions/Variables:** camelCase (e.g., `getUserData`, `userId`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_MEALS`)
- **Types/Interfaces:** PascalCase (e.g., `Meal`, `User`)

### Technical Specifications

**TypeScript Configuration:**
- TypeScript should be configured with strict mode enabled
- Path aliases configured: `@/*` should resolve to project root
- ES modules support
- Next.js TypeScript plugin enabled

**Next.js Configuration:**
- App Router enabled (default in Next.js 13+)
- Fast refresh enabled for development
- Production optimizations (code splitting, minification) enabled by default

**Environment Variables:**
- Create `.env.example` with placeholders for:
  - `NEXT_PUBLIC_SUPABASE_URL` (will be configured in Story 1.2)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (will be configured in Story 1.2)
  - `OPENAI_API_KEY` (will be configured later for LLM integration)
- Note: `.env.local` should be in `.gitignore` (should be included by default)

**Git Configuration:**
- `.gitignore` should include:
  - `node_modules/`
  - `.next/`
  - `.env.local`
  - `.env*.local`
  - Other Next.js standard ignores

### Project Structure Notes

**Alignment with Architecture:**
- Project structure follows Next.js App Router conventions
- Path aliases (`@/*`) configured as per architecture requirements
- TypeScript configured for type safety
- Ready for Chakra UI integration (Story 1.4)
- Ready for Supabase integration (Story 1.2)

**No Conflicts Detected:**
- This is the initial project setup, so no existing structure conflicts
- All subsequent stories will build upon this foundation

### References

- **Epic Details:** [Epics.md - Epic 1 Story 1.1](_bmad-output/planning-artifacts/epics.md#story-11-initialize-nextjs-project)
- **Architecture Decision:** [Architecture.md - Starter Template Evaluation](_bmad-output/planning-artifacts/architecture.md#starter-template-evaluation)
- **Project Structure:** [Architecture.md - Project Structure & Boundaries](_bmad-output/planning-artifacts/architecture.md#project-structure--boundaries)
- **Naming Conventions:** [Architecture.md - Implementation Patterns](_bmad-output/planning-artifacts/architecture.md#implementation-patterns--consistency-rules)

## Dev Agent Record

### Agent Model Used

Auto (Cursor AI Assistant)

### Debug Log References

### Completion Notes List

**Implementation Completed: 2026-02-03**

✅ **Next.js Project Initialized Successfully**
- Created Next.js 15.5.11 project with TypeScript support
- Project structure follows App Router conventions (`app/` directory)
- TypeScript configured with strict mode enabled
- Path aliases configured: `@/*` resolves to project root
- All configuration files created: package.json, tsconfig.json, next.config.js
- Environment variable template (`.env.example`) created with Supabase and OpenAI placeholders
- Git configuration (`.gitignore`) includes all required entries
- Build verified: Project compiles successfully with no errors

**Implementation Approach:**
- Since directory was not empty (contains _bmad framework files), manually created Next.js project structure instead of using create-next-app
- All files created match Next.js App Router structure and architecture requirements
- Dependencies installed: Next.js 15.5.11, React 18.3.1, TypeScript 5.7.2
- Build test passed: Project compiles and generates static pages successfully

**Note:** Minor warning about @next/swc version mismatch (15.5.7 vs 15.5.11) - non-blocking, build succeeds

**Code Review Fixes Applied:**
- Fixed broken CSS variables in `app/globals.css` (replaced undefined variables with actual color values)
- Created `public/` directory for static assets
- Improved semantic HTML structure in `app/page.tsx` (added header and section elements)
- Updated File List to include `package-lock.json` and `next-env.d.ts`
- Updated task description to reflect manual initialization approach

### File List

**New Files Created:**
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Dependency lock file (generated by npm install)
- `tsconfig.json` - TypeScript configuration with path aliases
- `next.config.js` - Next.js configuration
- `.gitignore` - Git ignore rules
- `.env.example` - Environment variable template
- `app/layout.tsx` - Root layout component
- `app/page.tsx` - Home page component
- `app/globals.css` - Global styles
- `.eslintrc.json` - ESLint configuration
- `README.md` - Project documentation
- `next-env.d.ts` - Next.js TypeScript environment declarations (auto-generated)

**Directories Created:**
- `app/` - Next.js App Router directory
- `public/` - Static assets directory
- `node_modules/` - Dependencies (installed via npm)
