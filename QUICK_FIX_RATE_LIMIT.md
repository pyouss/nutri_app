# Quick Fix: Rate Limit Issue

## Problem
You're getting "too many signup failed" or "email rate limit exceeded" errors.

## Immediate Solution: Delete Test Users

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project

### Step 2: Delete Test Users
1. Navigate to **Authentication** → **Users**
2. You'll see a list of all users
3. **Select all test users** (or the ones you created during testing)
4. Click **Delete** button (or use the trash icon)
5. Confirm deletion

### Step 3: Also Delete from public.users (Optional)
If you want to clean up completely:
1. Go to **Table Editor** → **users** table
2. Select test user rows
3. Delete them

### Step 4: Try Signing Up Again
1. Wait 1-2 minutes (rate limit may take a moment to reset)
2. Go to `http://localhost:3000/signup`
3. Try signing up with a new email

## Alternative: Use Different Email Addresses

If you can't delete users or want to continue testing immediately:

1. Use a different email pattern:
   - `test1@example.com`
   - `test2@example.com`
   - `test3@example.com`
   - etc.

2. Or use a temporary email service:
   - https://temp-mail.org/
   - https://10minutemail.com/

## Why This Happens

- Supabase rate limits signup attempts to prevent abuse
- Rate limits are based on:
  - Number of attempts per time window
  - IP address
  - Email address patterns

## Prevention

1. **Delete test users regularly** after testing
2. **Use unique emails** for each test
3. **Wait between attempts** (don't spam signup)
4. **Clean up test data** before production

## Still Having Issues?

If deleting users doesn't help:

1. **Wait 10-15 minutes** for rate limit to fully reset
2. **Check Supabase Dashboard** → Settings → Rate Limits
3. **Try from a different network** (if possible)
4. **Contact Supabase support** if rate limits seem too restrictive
