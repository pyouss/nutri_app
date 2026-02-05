# Story 2.3: User Logout

Status: done

## Story

As a logged-in user,
I want to log out of my account,
So that I can securely end my session and protect my account.

## Acceptance Criteria

1. **Given** I am logged into the application
   **When** I click the logout button
   **Then** My session is terminated
   **And** I am redirected to the login page
   **And** I cannot access protected pages without logging in again
   **And** My session data is cleared from the client

## Tasks / Subtasks

- [x] Create logout functionality (AC: 1)
  - [x] Create logout function using `supabase.auth.signOut()`
  - [x] Clear session from Supabase client (automatic via Supabase)
  - [x] Handle logout errors gracefully
- [x] Add logout button to UI (AC: 1)
  - [x] Add logout button to home page (when user is logged in)
  - [x] Show user email when logged in
  - [x] Style logout button using Chakra UI
  - [x] Show "Log Out" text on button
- [x] Implement redirect after logout (AC: 1)
  - [x] Redirect to login page after successful logout
  - [x] Use Next.js `useRouter` for client-side navigation
  - [x] Handle redirect errors gracefully
  - [x] Refresh router to clear any cached state
- [x] Verify session is cleared (AC: 1)
  - [x] Session is automatically cleared by Supabase on signOut
  - [x] Auth state listener updates UI when session changes
  - [x] User must log in again to access the app

## Dev Notes

### Epic Context

**Epic 2: User Authentication & Account Management**
- **Goal:** Users can create accounts, log in securely, and access their data from any device with internet connection. User data is stored persistently and available across sessions.
- **FRs covered:** FR53 (User Registration), FR54 (User Login), FR55 (User Logout), FR56 (Session Management), FR57 (Data Persistence), FR58 (Cross-Device Access)
- **Implementation Notes:** Supabase Auth integration, session management, protected routes, user profile management

### Architecture Requirements

**Authentication: Supabase Auth**
- **Source:** [Architecture.md - Authentication & Security](_bmad-output/planning-artifacts/architecture.md#authentication--security)
- **Method:** `supabase.auth.signOut()` to terminate session
- **Session Management:** Automatic via Supabase client (clears cookies automatically)

**API Patterns:**
- **Source:** [Architecture.md - API & Communication Patterns](_bmad-output/planning-artifacts/architecture.md#api--communication-patterns)
- **Pattern:** Use client-side Supabase Auth methods
- **Error Handling:** Consistent error response format, user-friendly messages

### Previous Story Intelligence

**Story 2.2: User Login**
- Login page created at `app/(auth)/login/page.tsx`
- Session management via Supabase client works automatically
- Redirect patterns established using `useRouter`

**Story 2.1: User Registration**
- Signup page created at `app/(auth)/signup/page.tsx`
- Error handling patterns established
- Chakra UI components and styling patterns established

**Story 1.4: Integrate Chakra UI Design System**
- Chakra UI v2.10.9 is installed and configured
- Button components available for logout button

### UX Design Requirements

**User Experience:**
- **Source:** [UX Design Specification - Effortless Experience](_bmad-output/planning-artifacts/ux-design-specification.md)
- **Goal:** Make logout feel natural and secure
- **Approach:** Clear logout button, immediate session termination, smooth redirect

### Technical Specifications

**Supabase Auth Logout:**
```typescript
import { supabase } from '@/lib/db/supabase'

const { error } = await supabase().auth.signOut()
```

**Session Management:**
- Supabase automatically clears session cookies on signOut
- Session data is removed from client
- User is no longer authenticated

**Next.js App Router:**
- Use `'use client'` directive for client components
- Use `useRouter` from `next/navigation` for client-side navigation
- Check session status using `supabase().auth.getSession()`

### Project Structure Notes

- **Components:** Add logout button to home page or create a header/navigation component
- **Utilities:** Logout function can be in a utility file or component
- **Pattern:** Consistent with login/signup patterns

### Testing Requirements

- **Unit Tests:** Test logout function
- **Integration Tests:** Test logout flow end-to-end
- **Error Cases:** Test network errors during logout
- **Success Case:** Test successful logout, redirect, session clearing

### References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Auth Sign Out](https://supabase.com/docs/reference/javascript/auth-signout)
- [Next.js App Router Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Source: Architecture.md - Authentication & Security](_bmad-output/planning-artifacts/architecture.md#authentication--security)
- [Source: Story 2.2 - User Login](_bmad-output/implementation-artifacts/2-2-user-login.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

**Implementation Summary (2026-02-03):**
- ✅ Created logout functionality using `supabase.auth.signOut()`
- ✅ Added logout button to home page (shown when user is logged in)
- ✅ Display user email when authenticated
- ✅ Implemented redirect to login page after logout
- ✅ Added auth state listener to update UI when session changes
- ✅ Session is automatically cleared by Supabase on signOut
- ✅ Router refresh to clear any cached state
- ✅ Conditional UI rendering based on authentication status

**Technical Decisions:**
- Used `useEffect` to check session on component mount
- Added `onAuthStateChange` listener to update UI when auth state changes
- Logout function handles errors gracefully and still redirects
- Home page shows different UI based on authentication status:
  - Logged in: Shows user email and logout button
  - Not logged in: Shows sign up and log in buttons
- Session clearing is automatic via Supabase (no manual cleanup needed)

**User Experience:**
- Clear logout button with user email displayed
- Immediate session termination
- Smooth redirect to login page
- UI updates automatically when auth state changes

**Next Steps:**
- Story 2.4: Session Management and Protected Routes (to be implemented next)
- Story 2.5: Account Information Display

### File List

- `app/page.tsx` (modified - added logout functionality and conditional UI)
- `_bmad-output/implementation-artifacts/2-3-user-logout.md` (modified - updated task status and completion notes)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified - updated story status)

## Change Log

- **2026-02-03:** User logout implemented. Added logout button to home page with conditional UI rendering based on authentication status. Implemented session termination and redirect to login page. Added auth state listener for real-time UI updates.
