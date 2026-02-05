# Story 2.5: Account Information Display

Status: done

## Story

As a logged-in user,
I want to view my account information,
So that I can see my account details and manage my profile.

## Acceptance Criteria

1. **Given** I am logged into the application
   **When** I navigate to my account/profile page
   **Then** I can see my email address
   **And** I can see my account creation date
   **And** Account information is displayed in a user-friendly format
   **And** I can access account settings (for future stories)

## Tasks / Subtasks

- [x] Create account page component (AC: 1)
  - [x] Create `app/account/page.tsx` route
  - [x] Make route protected (require authentication via middleware and client-side check)
  - [x] Fetch user data from Supabase Auth
  - [x] Fetch account creation date from `public.users` table
  - [x] Style page using Chakra UI components
- [x] Display user email (AC: 1)
  - [x] Get email from Supabase Auth user object
  - [x] Display email in a user-friendly format
  - [x] Add label and proper styling
  - [x] Add "Verified" badge
- [x] Display account creation date (AC: 1)
  - [x] Query `public.users` table for `created_at` timestamp
  - [x] Format date in a readable format (e.g., "January 1, 2024")
  - [x] Display creation date with label
  - [x] Fallback to auth user created_at if database query fails
- [x] Create user-friendly layout (AC: 1)
  - [x] Use Chakra UI components for layout
  - [x] Add proper spacing and typography
  - [x] Make page responsive
  - [x] Add loading states
  - [x] Add error handling
  - [x] Display user ID in monospace font
- [x] Add navigation to account page (AC: 1)
  - [x] Add link to account page from home page
  - [x] Add link to account page from dashboard
  - [x] Make link visible when user is logged in
- [x] Prepare for account settings (AC: 1)
  - [x] Add placeholder section for future account settings
  - [x] Document where settings will be added

## Dev Notes

### Epic Context

**Epic 2: User Authentication & Account Management**
- **Goal:** Users can create accounts, log in securely, and access their data from any device with internet connection. User data is stored persistently and available across sessions.
- **FRs covered:** FR53 (User Registration), FR54 (User Login), FR55 (User Logout), FR56 (Session Management), FR57 (Data Persistence), FR58 (Cross-Device Access)
- **Implementation Notes:** Supabase Auth integration, session management, protected routes, user profile management

### Architecture Requirements

**Data Fetching:**
- **Source:** [Architecture.md - Data Architecture](_bmad-output/planning-artifacts/architecture.md#data-architecture)
- **Method:** Fetch user email from Supabase Auth, creation date from `public.users` table
- **Pattern:** Use Supabase client to query database

**Route Protection:**
- **Source:** [Story 2.4 - Session Management](_bmad-output/implementation-artifacts/2-4-session-management-and-protected-routes.md)
- **Method:** Use middleware and client-side auth checks
- **Pattern:** Protected route pattern established

### Previous Story Intelligence

**Story 2.4: Session Management and Protected Routes**
- Middleware created for route protection
- Auth utility functions created (`lib/auth/utils.ts`)
- Protected route pattern established (dashboard example)
- Session management works automatically

**Story 2.3: User Logout**
- Logout functionality implemented
- Auth state management patterns established

**Story 2.2: User Login**
- Login functionality implemented
- User session management works

**Story 2.1: User Registration**
- User records created in `public.users` table
- Database trigger automatically creates user records

### Technical Specifications

**Fetching User Data:**
```typescript
// Get email from auth
const { data: { user } } = await supabase().auth.getUser()

// Get creation date from public.users
const { data: userData } = await supabase()
  .from('users')
  .select('created_at')
  .eq('id', user.id)
  .single()
```

**Date Formatting:**
- Use JavaScript `Date` object or date formatting library
- Format: "January 1, 2024" or "Jan 1, 2024"
- Consider timezone handling

**Route Protection:**
- Add `/account` to protected routes in middleware
- Use client-side auth check as backup
- Redirect to login if not authenticated

### Project Structure Notes

- **Account Page:** `app/account/page.tsx`
- **Protected Route:** Add to middleware protected routes list
- **Navigation:** Add link from home/dashboard pages

### Testing Requirements

- **Unit Tests:** Test data fetching logic
- **Integration Tests:** Test account page access
- **Error Cases:** Test with missing user data, network errors
- **Success Case:** Test displaying email and creation date

### References

- [Supabase Database Queries](https://supabase.com/docs/reference/javascript/select)
- [Next.js App Router Protected Routes](https://nextjs.org/docs/app/building-your-application/authentication)
- [Source: Story 2.4 - Protected Routes](_bmad-output/implementation-artifacts/2-4-session-management-and-protected-routes.md)
- [Source: Architecture.md - Data Architecture](_bmad-output/planning-artifacts/architecture.md#data-architecture)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

**Implementation Summary (2026-02-03):**
- ✅ Created account page at `app/account/page.tsx`
- ✅ Route is protected via middleware and client-side auth check
- ✅ Fetches user email from Supabase Auth
- ✅ Fetches account creation date from `public.users` table
- ✅ Displays email with "Verified" badge
- ✅ Formats creation date in readable format (e.g., "January 1, 2024")
- ✅ Displays user ID in monospace font
- ✅ User-friendly layout with Chakra UI components
- ✅ Loading states and error handling
- ✅ Added navigation links from home and dashboard pages
- ✅ Added placeholder section for future account settings
- ✅ Updated middleware to protect `/account` route

**Technical Decisions:**
- Used client-side component for real-time auth state updates
- Fetches creation date from `public.users` table (more accurate than auth.created_at)
- Falls back to auth user data if database query fails
- Date formatting uses JavaScript's `toLocaleDateString()` for localization
- Protected route pattern consistent with dashboard
- Navigation links added to both home and dashboard for easy access

**User Experience:**
- Clean, organized layout with clear sections
- Profile details in a card with proper spacing
- Account settings placeholder for future features
- Responsive design
- Loading and error states handled gracefully

**Data Display:**
- Email address with "Verified" badge
- Account creation date in readable format
- User ID displayed for reference (monospace font)
- All information clearly labeled

**Next Steps:**
- Epic 2 is complete! All authentication and account management features are implemented.
- Epic 3: Basic Meal Logging (next epic to implement)
- Future: Account settings (password change, email update, etc.)

### File List

- `app/account/page.tsx` (new - account information page)
- `app/page.tsx` (modified - added account link)
- `app/dashboard/page.tsx` (modified - added account link)
- `middleware.ts` (modified - added `/account` to protected routes)
- `_bmad-output/implementation-artifacts/2-5-account-information-display.md` (modified - updated task status and completion notes)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified - updated story and epic status)

## Change Log

- **2026-02-03:** Account information display implemented. Created account page with email, creation date, and user ID display. Added navigation links from home and dashboard. Protected route via middleware. Added placeholder for future account settings.
