# Development Tips & Troubleshooting

## Rate Limiting Issues

### Problem: "Email rate limit exceeded" or "Too many signup attempts"

**Why it happens:**
- Supabase has rate limiting to prevent abuse
- Too many signup/login attempts in a short period trigger this error
- Common during development/testing

### Solutions

#### Option 1: Delete Test Users in Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Users**
3. Select test users you want to delete
4. Click **Delete** (or use bulk delete)
5. This will:
   - Free up rate limit quota
   - Allow you to test signup again
   - Clean up your test data

**Note:** Deleting users from `auth.users` will also delete corresponding rows in `public.users` (if you have cascade delete set up, or you can delete manually).

#### Option 2: Wait for Rate Limit to Reset

- Rate limits typically reset after **5-10 minutes**
- Check Supabase Dashboard → Settings → Rate Limits for current limits

#### Option 3: Use Different Email Addresses

- Use unique emails for each test: `test1@example.com`, `test2@example.com`, etc.
- This avoids hitting duplicate email rate limits

#### Option 4: Disable Email Confirmation (Development Only)

⚠️ **Warning:** Only do this in development, never in production!

**This is highly recommended for development/testing:**

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Scroll down to **Email Auth** section
3. Find **"Enable email confirmations"** toggle
4. **Turn it OFF** (disable email confirmations)
5. Click **Save**

**Benefits:**
- Users can sign up and immediately log in (no email confirmation needed)
- Faster testing workflow
- Reduces rate limiting issues (no need to wait for emails)
- Easier development experience

**Remember:** Re-enable email confirmations before production for security!

#### Option 5: Adjust Rate Limiting (Development Only)

⚠️ **Warning:** Only do this in development, never in production!

1. Go to Supabase Dashboard → Settings → Auth
2. Look for rate limiting settings
3. Temporarily increase or disable limits for testing
4. **Remember to re-enable before production!**

## Password Reset

### Using the Forgot Password Feature

1. Go to the login page: `http://localhost:3000/login`
2. Click **"Forgot password?"** link
3. Enter your email address
4. Check your email for the reset link
5. Click the link to reset your password

### Manual Password Reset in Supabase

If you need to reset a password manually:

1. Go to Supabase Dashboard → Authentication → Users
2. Find the user you want to reset
3. Click on the user
4. Click **"Send password reset email"** or **"Reset password"**
5. Or manually update the password hash (advanced, not recommended)

### Delete and Recreate User

If you just want to start fresh:

1. Delete the user from Supabase Dashboard → Authentication → Users
2. Sign up again with the same email
3. This creates a fresh account with a new password

## Clearing Test Data

### Delete All Test Users

**Using Supabase Dashboard:**
1. Go to Authentication → Users
2. Select all test users
3. Click Delete

**Using SQL (if you have access):**
```sql
-- Delete from public.users first (if needed)
DELETE FROM public.users WHERE email LIKE 'test%@example.com';

-- Delete from auth.users
DELETE FROM auth.users WHERE email LIKE 'test%@example.com';
```

**Note:** Be careful with SQL - always backup first!

## Development Best Practices

### 1. Use Test Email Pattern

Use a consistent pattern for test emails:
- `test1@example.com`
- `test2@example.com`
- `dev-test@example.com`

This makes it easy to identify and clean up test data.

### 2. Clean Up After Testing

Regularly delete test users to:
- Avoid rate limiting
- Keep your database clean
- Avoid confusion

### 3. Use Environment-Specific Accounts

- Development: Use test emails
- Production: Use real emails
- Never mix test data with production

### 4. Document Test Accounts

Keep a list of test accounts and their passwords (in a secure place):
- `test1@example.com` / `password123`
- `test2@example.com` / `password123`

## Common Issues

### Issue: Can't sign up with same email after deleting user

**Solution:**
- Wait a few minutes (Supabase may cache user data)
- Or use a different email address

### Issue: Password reset email not received

**Solutions:**
- Check spam folder
- Verify email address is correct
- Check Supabase Dashboard → Logs for email delivery status
- Verify email service is configured in Supabase

### Issue: Rate limit still active after deleting users

**Solution:**
- Wait 5-10 minutes for rate limit to reset
- Rate limits are based on IP address and time window, not just user count

## Quick Commands

### Check Supabase Connection
```bash
# Test connection
curl http://localhost:3000/api/test-connection
```

### View Supabase Logs
1. Go to Supabase Dashboard → Logs
2. Filter by "Auth" to see authentication events
3. Check for rate limiting or error messages

## Database Errors

### Issue: "Database error saving new user" during signup

**What it means:**
- The trigger function that creates `public.users` row is being blocked by RLS (Row Level Security)
- This happens when the RLS policy doesn't allow the trigger to insert

**Solution:**
- Migration 003 fixes this by creating separate RLS policies for SELECT, UPDATE, and INSERT
- The INSERT policy allows inserts when `id` matches `auth.uid()` (which happens during signup)
- Run: `npx supabase db push` to apply the migration

**If the error persists:**
1. Check Supabase Dashboard → Database → Policies to verify policies are correct
2. Check Supabase Dashboard → Logs for detailed error messages
3. Verify migration 003 was applied successfully

## Need Help?

- Check Supabase Documentation: https://supabase.com/docs
- Check Supabase Dashboard → Logs for detailed error messages
- Review browser console (F12) for client-side errors
