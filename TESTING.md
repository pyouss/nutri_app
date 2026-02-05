# Testing Guide: User Registration

## Quick Start

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:3000/signup
   ```

## Test Scenarios

### ✅ Test 1: Successful Signup

**Steps:**
1. Navigate to `http://localhost:3000/signup`
2. Enter a valid email (e.g., `test@example.com`)
3. Enter a password (at least 6 characters, e.g., `password123`)
4. Confirm the password (must match)
5. Click "Sign Up"

**Expected Results:**
- ✅ Form submits without errors
- ✅ Loading state shows "Creating account..."
- ✅ You are automatically logged in
- ✅ You are redirected to the home page (`/`)
- ✅ User record is created in Supabase Auth
- ✅ User record is created in `public.users` table (via database trigger)

### ❌ Test 2: Invalid Email Format

**Steps:**
1. Enter an invalid email (e.g., `notanemail`)
2. Click outside the email field or try to submit

**Expected Results:**
- ✅ Error message appears: "Please enter a valid email address"
- ✅ Form does not submit

### ❌ Test 3: Weak Password

**Steps:**
1. Enter a valid email
2. Enter a password less than 6 characters (e.g., `12345`)
3. Click outside the password field or try to submit

**Expected Results:**
- ✅ Error message appears: "Password must be at least 6 characters"
- ✅ Form does not submit

### ❌ Test 4: Password Mismatch

**Steps:**
1. Enter a valid email
2. Enter a password (e.g., `password123`)
3. Enter a different password in confirmation field (e.g., `password456`)
4. Click outside the confirmation field or try to submit

**Expected Results:**
- ✅ Error message appears: "Passwords do not match"
- ✅ Form does not submit

### ❌ Test 5: Duplicate Email

**Steps:**
1. Sign up with an email that was already used (from Test 1)
2. Enter the same email, password, and confirmation
3. Click "Sign Up"

**Expected Results:**
- ✅ Error alert appears: "This email is already registered. Please log in instead."
- ✅ Form does not submit
- ✅ User is not created

### ✅ Test 6: Email Confirmation Flow (if enabled in Supabase)

**Note:** This test depends on your Supabase Auth settings. If email confirmation is required:

**Steps:**
1. Sign up with a new email
2. Complete the form

**Expected Results:**
- ✅ Alert appears: "Please check your email to confirm your account before logging in."
- ✅ You are redirected to `/login` page
- ✅ User is created but not logged in until email is confirmed

## Verify Database Record Creation

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Users**
3. Verify the new user appears in the list
4. Navigate to **Table Editor** → **users** table
5. Verify a corresponding row exists in `public.users` with:
   - `id` matching the auth user ID
   - `email` matching the signup email
   - `created_at` and `updated_at` timestamps

### Option 2: Using Supabase SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query to check auth users:
   ```sql
   SELECT id, email, created_at 
   FROM auth.users 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

3. Run this query to check public.users:
   ```sql
   SELECT id, email, created_at, updated_at 
   FROM public.users 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

4. Verify:
   - ✅ Both queries return the same user
   - ✅ The `id` values match
   - ✅ The `email` values match
   - ✅ Timestamps are recent

### Option 3: Using Browser DevTools

1. Open browser DevTools (F12)
2. Go to **Application** tab → **Local Storage** → `http://localhost:3000`
3. Look for Supabase session keys (they start with `sb-`)
4. Verify session exists after successful signup

## Verify Automatic Login

After successful signup:

1. **Check browser console** (F12 → Console):
   - No errors should appear
   - Session should be stored

2. **Check redirect**:
   - You should be on the home page (`/`)
   - URL should be `http://localhost:3000/`

3. **Check session** (if you have a way to display user info):
   - User should be authenticated
   - Session should persist after page refresh

## Verify Error Handling

### Test Network Error

1. **Disconnect from internet** (or block Supabase domain)
2. Try to sign up
3. **Expected:** Error message appears: "An unexpected error occurred. Please try again."

### Test Form Validation

1. **Leave fields empty** and try to submit
2. **Expected:** Validation errors appear for each empty field

## Testing Checklist

- [ ] Successful signup with valid data
- [ ] Invalid email format shows error
- [ ] Weak password shows error
- [ ] Password mismatch shows error
- [ ] Duplicate email shows error
- [ ] User record created in `auth.users`
- [ ] User record created in `public.users` (via trigger)
- [ ] Automatic login after signup
- [ ] Redirect to home page after signup
- [ ] Session persists after page refresh
- [ ] Loading state shows during submission
- [ ] Error messages are user-friendly
- [ ] Form validation works on blur and submit

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
- Check that `.env.local` exists
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart the dev server after adding environment variables

### Issue: User not created in `public.users`

**Solution:**
- Check that migration 002 is applied: `npx supabase db push`
- Verify the trigger exists in Supabase Dashboard → Database → Triggers
- Check Supabase logs for trigger errors

### Issue: "Already registered" but user doesn't exist

**Solution:**
- Check Supabase Auth settings (may require email confirmation)
- Verify the user in Supabase Dashboard → Authentication → Users
- Check if user is soft-deleted

### Issue: "Email rate limit exceeded"

**What it means:**
- Supabase has rate limiting to prevent abuse
- Too many signup attempts in a short period trigger this error
- Common during testing when trying the same email multiple times

**Solutions:**
- **Wait 5-10 minutes** before trying again (rate limit resets)
- **Use different email addresses** for testing (e.g., `test1@example.com`, `test2@example.com`)
- **Delete test users** from Supabase Dashboard → Authentication → Users to free up rate limit
- **Check Supabase Dashboard** → Settings → Rate Limits to see current limits

**Prevention:**
- Use unique emails for each test
- Delete test users after testing
- Wait between multiple signup attempts

### Issue: No redirect after signup

**Solution:**
- Check browser console for errors
- Verify `useRouter` is imported correctly
- Check if email confirmation is required (redirects to login instead)

## Next Steps After Testing

Once signup is verified:
- ✅ Story 2.2: Implement User Login
- ✅ Story 2.3: Implement User Logout
- ✅ Story 2.4: Implement Session Management
- ✅ Story 2.5: Implement Account Information Display
