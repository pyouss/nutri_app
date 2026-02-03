# Story 1.4: Integrate Chakra UI Design System

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to install and configure Chakra UI with the project theme,
So that I can use consistent UI components throughout the application.

## Acceptance Criteria

1. **Given** Next.js project is initialized
   **When** I install Chakra UI and its dependencies
   **Then** Chakra UI packages are installed (@chakra-ui/react, @emotion/react, @emotion/styled, framer-motion)
   **And** Chakra UI provider is configured in `app/layout.tsx`
   **And** Custom theme is created based on UX design specification (colors, typography, spacing)
   **And** Theme is applied to the Chakra UI provider
   **And** Basic Chakra UI components can be imported and used in the application
   **And** Tailwind CSS is removed (if it was included in Next.js initialization)

## Tasks / Subtasks

- [x] Install Chakra UI packages (AC: 1)
  - [x] Install `@chakra-ui/react` package
  - [x] Install `@emotion/react` package (peer dependency)
  - [x] Install `@emotion/styled` package (peer dependency)
  - [x] Install `framer-motion` package (peer dependency)
  - [x] Verify all packages are added to `package.json` dependencies
  - [x] Verify `package-lock.json` is updated
- [x] Create custom theme configuration (AC: 1)
  - [x] Create `lib/theme/` directory structure
  - [x] Create `lib/theme/index.ts` file for theme export
  - [x] Define color palette based on UX design specification
  - [x] Define typography settings (fonts, sizes, weights)
  - [x] Define spacing scale for consistent spacing
  - [x] Define breakpoints for responsive design
  - [x] Extend Chakra UI default theme with custom values
- [x] Configure Chakra UI provider in layout (AC: 1)
  - [x] Update `app/layout.tsx` to import ChakraProvider
  - [x] Import custom theme from `lib/theme`
  - [x] Wrap application with ChakraProvider and apply theme
  - [x] Ensure provider is configured for Next.js App Router
  - [x] Verify provider doesn't break existing layout structure
- [x] Remove Tailwind CSS (if present) (AC: 1)
  - [x] Check if Tailwind CSS is installed in `package.json`
  - [x] Remove Tailwind CSS packages if present
  - [x] Remove Tailwind configuration files (`tailwind.config.js`, `postcss.config.js`)
  - [x] Remove Tailwind directives from `app/globals.css`
  - [x] Verify no Tailwind classes are used in existing components
- [x] Create example component to verify setup (AC: 1)
  - [x] Create simple test component using Chakra UI components (Button, Box, Text)
  - [x] Verify components render correctly with theme
  - [x] Verify theme colors and spacing are applied
  - [x] Test component in development environment
- [x] Update project documentation (AC: 1)
  - [x] Update README.md with Chakra UI setup information
  - [x] Document theme customization approach
  - [x] Document component usage patterns

## Dev Notes

### Epic Context

**Epic 1: Project Setup & Infrastructure**
- **Goal:** Users can access a functional application foundation ready for development and deployment
- **FRs covered:** Infrastructure requirements (starter template, deployment, database setup)
- **Implementation Notes:** Next.js initialization, Supabase setup, environment configuration, basic project structure, Chakra UI integration, database migrations

### Architecture Requirements

**UI Framework: Chakra UI**
- **Source:** [Architecture.md - Technology Stack](_bmad-output/planning-artifacts/architecture.md#technology-stack)
- **Choice:** Chakra UI as the design system
- **Rationale:** 
  - Works seamlessly with Next.js App Router
  - Compatible with React Server Components
  - Provides accessible, themeable components
  - Supports responsive design out of the box
- **Affects:** All UI components, theming, responsive design

**Component Structure:**
- **Source:** [Architecture.md - Component Organization](_bmad-output/planning-artifacts/architecture.md#component-organization)
- **Location:** `components/ui/` for Chakra UI customizations
- **Pattern:** Custom components extend Chakra UI base components
- **Naming:** PascalCase for component files (e.g., `Button.tsx`, `Card.tsx`)

**Theme Configuration:**
- **Source:** [Architecture.md - Implementation Patterns](_bmad-output/planning-artifacts/architecture.md#implementation-patterns--consistency-rules)
- **Location:** `lib/theme/` directory
- **Pattern:** Centralized theme configuration exported from `lib/theme/index.ts`
- **Extension:** Extend Chakra UI default theme rather than replacing it

### UX Design Requirements

**Theme Customization:**
- **Source:** [UX Design Specification - Theme Customization](_bmad-output/planning-artifacts/ux-design-specification.md#theme-customization)
- **Colors:** Custom color palette for fresh, uncluttered brand
  - Primary: Natural, fresh color (to be defined)
  - Secondary: Soft complementary color
  - Semantic: Success, warning, error colors
  - Neutral: Grays for text and backgrounds
- **Typography:** Clean, readable fonts that support effortless experience
  - Font family: System fonts or web fonts (to be defined)
  - Font sizes: Responsive scale
  - Font weights: Regular, medium, semibold, bold
- **Spacing:** Generous spacing for uncluttered feel
  - Base spacing unit: 4px or 8px
  - Consistent spacing scale throughout

**Color System:**
- **Source:** [UX Design Specification - Color System](_bmad-output/planning-artifacts/ux-design-specification.md#color-system)
- **Strategy:** Fresh, uncluttered, natural
- **Emotional Goals:** Accomplishment and confidence
- **Avoid:** Clinical or overwhelming palettes

**Responsive Design:**
- **Source:** [UX Design Specification - Responsive Strategy](_bmad-output/planning-artifacts/ux-design-specification.md)
- **Approach:** Mobile-first responsive design
- **Breakpoints:** Define breakpoints for mobile, tablet, desktop
- **Touch Interactions:** Ensure touch-friendly interactions on mobile

### Technical Specifications

**Chakra UI Installation:**
- **Packages Required:**
  - `@chakra-ui/react` - Core Chakra UI library
  - `@emotion/react` - CSS-in-JS library (peer dependency)
  - `@emotion/styled` - Styled components (peer dependency)
  - `framer-motion` - Animation library (peer dependency)
- **Installation Command:** `npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion`

**Chakra UI Provider Setup:**
- **Location:** `app/layout.tsx`
- **Pattern:** Wrap root layout with ChakraProvider
- **Theme:** Pass custom theme to ChakraProvider
- **Next.js Compatibility:** Works with App Router and Server Components

**Theme Configuration:**
- **Location:** `lib/theme/index.ts`
- **Pattern:** Use `extendTheme()` from Chakra UI
- **Structure:**
  ```typescript
  import { extendTheme } from '@chakra-ui/react'
  
  const theme = extendTheme({
    colors: { ... },
    fonts: { ... },
    space: { ... },
    breakpoints: { ... }
  })
  
  export default theme
  ```

**Tailwind CSS Removal:**
- **Check:** Verify if Tailwind was included in Next.js initialization
- **Remove:** If present, remove Tailwind packages and configuration
- **Clean:** Remove Tailwind directives from CSS files

### Project Structure Notes

**Alignment with Architecture:**
- Theme configuration in `lib/theme/` follows architecture patterns
- Chakra UI provider in `app/layout.tsx` matches Next.js App Router structure
- Component customizations will go in `components/ui/` (future stories)
- No conflicts with existing structure

**File Structure:**
```
lib/
  theme/
    index.ts          # Theme configuration
app/
  layout.tsx          # Root layout with ChakraProvider
  globals.css         # Global styles (Tailwind removed if present)
```

### Previous Story Intelligence

**From Story 1.1:**
- Next.js project initialized with TypeScript
- Project structure established
- `app/layout.tsx` exists and is basic (no Chakra UI yet)
- `app/globals.css` exists (may contain Tailwind if included)

**From Story 1.2:**
- Supabase client configured
- Environment variables set up
- No UI components yet, so no conflicts

**From Story 1.3:**
- Database schema foundation complete
- No UI dependencies, so no conflicts

**Learnings:**
- Follow established project structure patterns
- Use TypeScript for type safety
- Environment variables are in `.env.local`
- Keep configuration centralized

### References

- **Epic Details:** [Epics.md - Epic 1 Story 1.4](_bmad-output/planning-artifacts/epics.md#story-14-integrate-chakra-ui-design-system)
- **Architecture Decision:** [Architecture.md - Technology Stack](_bmad-output/planning-artifacts/architecture.md#technology-stack)
- **UX Design:** [UX Design Specification - Theme Customization](_bmad-output/planning-artifacts/ux-design-specification.md#theme-customization)
- **Chakra UI Docs:** https://chakra-ui.com/getting-started/nextjs-guide
- **Chakra UI Theme:** https://chakra-ui.com/docs/styled-system/theme

## Dev Agent Record

### Agent Model Used

Auto (Cursor AI Assistant)

### Debug Log References

### Completion Notes List

**Implementation Summary (2026-02-03):**
- ✅ Installed Chakra UI packages: @chakra-ui/react, @emotion/react, @emotion/styled, framer-motion
- ✅ Created custom theme configuration in `lib/theme/index.ts` with:
  - Color palette: Primary (teal #00B4A6), Secondary (coral #FF6B6B), Semantic colors (success, warning, error, info), Neutral grays
  - Typography: System UI font stack, responsive type scale (H1-H4, body sizes), font weights (regular, semibold, bold)
  - Spacing: 8px base unit scale (4px to 64px)
  - Breakpoints: Mobile-first responsive breakpoints (sm, md, lg, xl, 2xl)
  - Component styles: Customized Button, Heading, and Text components
- ✅ Configured ChakraProvider in `app/layout.tsx` with custom theme
- ✅ Verified Tailwind CSS is not present (no removal needed)
- ✅ Created example verification page in `app/page.tsx` demonstrating:
  - Theme colors (primary, secondary, semantic, neutral)
  - Typography scale (headings and body text)
  - Component usage (Button, Box, Text, Stack, Flex)
  - Spacing and layout
- ✅ Updated README.md with Chakra UI documentation including:
  - Theme customization overview
  - Component usage examples
  - Color palette reference
- ✅ All acceptance criteria satisfied - Chakra UI is fully integrated and ready for use

**Technical Decisions:**
- Downgraded from Chakra UI v3.31.0 to v2.10.9 due to compatibility issues with Next.js 15 (v3 had `fieldAnatomy.extendWith` runtime errors)
- Used `extendTheme()` to extend Chakra UI default theme rather than replacing it
- Implemented 8px base unit spacing system as specified in UX design
- Used system UI font stack for instant loading and native feel
- Configured theme with all colors, typography, and spacing from UX design specification
- Used 'use client' directive in theme file (required for `extendTheme` in Next.js App Router)
- Added gray color scale and default component styles (Heading: gray.800, Text: gray.700) to fix white-on-white heading visibility issue

**Theme Highlights:**
- Primary color: Teal (#00B4A6) for fresh, health-associated brand identity
- Typography: System fonts with generous line heights for readability
- Spacing: 8px base unit creating airy, uncluttered aesthetic
- Components: Pre-configured with semantic colors and consistent styling

**Next Steps:**
- Chakra UI is ready for use in all future components
- Custom components can extend Chakra UI base components in `components/ui/` directory
- Theme can be extended further as needed for specific component requirements

### File List

- `lib/theme/index.ts` (new - theme configuration)
- `app/layout.tsx` (modified - added ChakraProvider)
- `app/page.tsx` (modified - example verification page)
- `README.md` (modified - added Chakra UI documentation)
- `package.json` (modified - added Chakra UI dependencies)
- `package-lock.json` (modified - dependency updates)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified - updated story status)

## Change Log

- **2026-02-03:** Chakra UI design system integrated with custom theme. Theme includes colors, typography, spacing, and component styles based on UX design specification. ChakraProvider configured in root layout. Example verification page created. Documentation updated.
- **2026-02-03 (fix):** Fixed runtime error by downgrading from Chakra UI v3 to v2.10.9. Fixed white-on-white heading visibility by adding gray color scale and default component styles to theme.
