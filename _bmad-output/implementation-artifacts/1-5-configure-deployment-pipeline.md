# Story 1.5: Configure Deployment Pipeline

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to set up Vercel deployment for the application,
So that the application can be deployed and accessed online.

## Acceptance Criteria

1. **Given** Next.js project is initialized and code is in a Git repository
   **When** I configure Vercel deployment
   **Then** Vercel project is created and linked to the Git repository
   **And** Environment variables are configured in Vercel dashboard (Supabase URL, API keys)
   **And** Deployment settings are configured (Node.js version, build command, output directory)
   **And** Application deploys successfully to Vercel
   **And** Application is accessible via Vercel-provided URL
   **And** Environment variables are properly loaded in production

## Tasks / Subtasks

- [ ] Initialize Git repository (if not already done) (AC: 1)
  - [ ] Check if Git repository exists
  - [ ] Initialize Git repository if needed
  - [ ] Create `.gitignore` file with appropriate exclusions
  - [ ] Make initial commit with project files
- [ ] Create Vercel project (AC: 1)
  - [ ] Sign up/login to Vercel account
  - [ ] Create new Vercel project
  - [ ] Link Vercel project to Git repository
  - [ ] Verify project connection
- [ ] Configure environment variables in Vercel (AC: 1)
  - [ ] Add `NEXT_PUBLIC_SUPABASE_URL` environment variable
  - [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable
  - [ ] Add `OPENAI_API_KEY` environment variable (if needed)
  - [ ] Verify environment variables are set for production
  - [ ] Verify environment variables are set for preview deployments
- [ ] Configure deployment settings (AC: 1)
  - [ ] Set Node.js version (verify compatibility with Next.js 15)
  - [ ] Verify build command (should default to `next build`)
  - [ ] Verify output directory (should default to `.next`)
  - [ ] Configure framework preset (Next.js)
  - [ ] Set root directory if needed
- [ ] Test deployment (AC: 1)
  - [ ] Trigger initial deployment
  - [ ] Verify build completes successfully
  - [ ] Verify application is accessible via Vercel URL
  - [ ] Test that environment variables are loaded correctly
  - [ ] Verify Supabase connection works in production
- [ ] Update project documentation (AC: 1)
  - [ ] Update README.md with deployment information
  - [ ] Document Vercel deployment process
  - [ ] Document environment variable setup
  - [ ] Add deployment URL to documentation

## Dev Notes

### Epic Context

**Epic 1: Project Setup & Infrastructure**
- **Goal:** Users can access a functional application foundation ready for development and deployment
- **FRs covered:** Infrastructure requirements (starter template, deployment, database setup)
- **Implementation Notes:** Next.js initialization, Supabase setup, environment configuration, basic project structure, Chakra UI integration, database migrations, deployment pipeline

### Architecture Requirements

**Deployment Platform: Vercel**
- **Source:** [Architecture.md - Deployment Strategy](_bmad-output/planning-artifacts/architecture.md#deployment-strategy)
- **Choice:** Vercel for Next.js deployment
- **Rationale:**
  - Native Next.js support with zero configuration
  - Automatic deployments from Git
  - Built-in environment variable management
  - Preview deployments for pull requests
  - Global CDN and edge network
- **Affects:** Deployment process, environment configuration, CI/CD

**Environment Variables:**
- **Source:** [Architecture.md - Environment Configuration](_bmad-output/planning-artifacts/architecture.md#environment-configuration)
- **Required Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
  - `OPENAI_API_KEY` - OpenAI API key (optional, for future LLM features)
- **Security:** Never commit environment variables to Git
- **Management:** Use Vercel dashboard for production, `.env.local` for local development

**Build Configuration:**
- **Source:** Next.js 15 App Router requirements
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)
- **Node.js Version:** Compatible with Next.js 15 (18.x or 20.x recommended)
- **Framework Preset:** Next.js (auto-detected)

### Previous Story Intelligence

**Story 1.4: Integrate Chakra UI Design System**
- Chakra UI v2.10.9 is installed and configured
- Theme is configured in `lib/theme/index.ts` with 'use client' directive
- ChakraProvider is configured in `app/layout.tsx`
- Build process works correctly with Chakra UI
- No build errors or runtime issues

**Story 1.3: Set Up Database Schema Foundation**
- Supabase is configured and linked
- Database migrations are in `supabase/migrations/`
- Environment variables are configured locally in `.env.local`
- Supabase connection works in development

**Story 1.2: Configure Supabase Project**
- Supabase project is created and configured
- Supabase CLI is set up and linked
- Database connection is tested and working

### Project Structure Notes

- **Git Repository:** May need to be initialized if not already done
- **`.gitignore`:** Should exclude `node_modules/`, `.next/`, `.env.local`, `.env*.local`
- **Vercel Configuration:** No `vercel.json` needed for basic Next.js deployment (auto-detected)
- **Environment Files:** `.env.local` for local development, Vercel dashboard for production

### Testing Requirements

- **Deployment Test:** Verify application builds and deploys successfully
- **Environment Variable Test:** Verify all environment variables are accessible in production
- **Supabase Connection Test:** Verify Supabase connection works in production environment
- **URL Accessibility Test:** Verify application is accessible via Vercel-provided URL

### References

- [Vercel Documentation - Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Documentation - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Documentation - Deployment](https://nextjs.org/docs/deployment)
- [Source: Architecture.md - Deployment Strategy](_bmad-output/planning-artifacts/architecture.md#deployment-strategy)
- [Source: Architecture.md - Environment Configuration](_bmad-output/planning-artifacts/architecture.md#environment-configuration)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
