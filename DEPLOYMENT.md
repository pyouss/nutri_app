# Deployment Guide

This document provides step-by-step instructions for deploying the nutri_app to Vercel.

## Prerequisites

- ✅ Git repository initialized and code committed
- ✅ Vercel account ([sign up](https://vercel.com/signup) if needed)
- ✅ Supabase project configured (from Story 1.2)
- ✅ Environment variables ready (from `.env.local`)

## Step 1: Push to Git Repository

If you haven't already, push your code to a Git hosting service (GitHub, GitLab, or Bitbucket):

```bash
# Add remote repository (replace with your repo URL)
git remote add origin <your-repo-url>

# Push to remote
git push -u origin master
```

## Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** or **"Import Project"**
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Choose your repository (`nutri_app`)
5. Vercel will auto-detect Next.js framework

## Step 3: Configure Project Settings

Vercel should auto-detect:
- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Root Directory:** `./` (if project is at repo root)

Verify these settings in the project configuration.

## Step 4: Configure Environment Variables

Before deploying, add your environment variables in Vercel:

1. In the project import screen, or after project creation, go to **Settings → Environment Variables**
2. Add the following variables:

   **Required:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
     - Value: Get from Supabase Dashboard → Settings → API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
     - Value: Get from Supabase Dashboard → Settings → API

   **Optional:**
   - `OPENAI_API_KEY` - OpenAI API key (for future LLM features)

3. Set environment scope:
   - **Production:** For production deployments (required)
   - **Preview:** For preview deployments (pull requests) (recommended)
   - **Development:** For local development (optional)

4. Click **"Save"** for each variable

5. **IMPORTANT:** After adding/updating environment variables, you MUST redeploy:
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Select **"Redeploy"**
   - Or push a new commit to trigger a new deployment
   - Environment variables are only loaded during build/deployment, not at runtime

## Step 5: Deploy

1. Click **"Deploy"** in the Vercel project setup
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build the application (`next build`)
   - Deploy to production

3. Wait for deployment to complete (usually 1-2 minutes)

## Step 6: Verify Deployment

1. Once deployment completes, you'll see a success message with your deployment URL
2. Click the URL to visit your deployed application
3. Verify:
   - ✅ Application loads correctly
   - ✅ Chakra UI theme is applied
   - ✅ No console errors
   - ✅ Supabase connection works (if you have test endpoints)

## Step 7: Test Environment Variables

To verify environment variables are loaded correctly:

1. Check Vercel deployment logs for any environment variable errors
2. Test Supabase connection in production (if you have a test endpoint)
3. Verify `NEXT_PUBLIC_*` variables are accessible in the browser

## Automatic Deployments

After initial setup, Vercel will automatically:
- **Deploy on push** to your main branch (production)
- **Create preview deployments** for pull requests
- **Redeploy** when you update environment variables

## Troubleshooting

### Build Fails

- Check Vercel build logs for errors
- Verify Node.js version compatibility (Next.js 15 requires Node 18+)
- Ensure all dependencies are in `package.json`

### Environment Variables Not Working

- **CRITICAL:** Environment variables are only loaded during build. You MUST redeploy after adding/updating them
- Verify variables are set in Vercel dashboard (Settings → Environment Variables)
- Check variable names match exactly (case-sensitive): `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure `NEXT_PUBLIC_*` prefix for client-side variables
- Verify variables are set for **Production** environment (not just Preview/Development)
- Check the `/api/test-connection` endpoint - it now includes debug info showing if env vars are present
- Common issues:
  - Variables added but deployment not redeployed
  - Variables set for wrong environment (Preview instead of Production)
  - Typos in variable names
  - Missing `NEXT_PUBLIC_` prefix

### Supabase Connection Issues

- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify RLS policies allow public access (if needed)
- Check CORS settings in Supabase

### Application Not Loading

- Check Vercel deployment logs
- Verify build completed successfully
- Check browser console for errors
- Verify all environment variables are set

## Next Steps

After successful deployment:
- ✅ Update README.md with deployment URL
- ✅ Set up custom domain (optional)
- ✅ Configure preview deployments for pull requests
- ✅ Set up monitoring and analytics (optional)

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
