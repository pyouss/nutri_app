# nutri_app

Learning-first nutrition tracking webapp built with Next.js, TypeScript, and Supabase.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js App Router (routes and features)
- `components/` - Shared React components
- `lib/` - Utilities and business logic
  - `lib/theme/` - Chakra UI theme configuration
- `public/` - Static assets

## UI Framework

This project uses **Chakra UI** as the design system.

### Theme Customization

The custom theme is configured in `lib/theme/index.ts` and includes:
- **Colors:** Custom color palette (primary teal, secondary coral, semantic colors)
- **Typography:** System UI font stack with responsive type scale
- **Spacing:** 8px base unit for consistent spacing
- **Components:** Customized button, heading, and text styles

### Component Usage

Chakra UI components can be imported and used throughout the application:

```tsx
import { Button, Box, Text } from '@chakra-ui/react'

export default function MyComponent() {
  return (
    <Box p={4}>
      <Text>Hello World</Text>
      <Button colorScheme="primary">Click me</Button>
    </Box>
  )
}
```

### Theme Colors

- **Primary:** Teal (#00B4A6) - Main brand color
- **Secondary:** Coral (#FF6B6B) - Accent color
- **Semantic:** Success (green), Warning (amber), Error (red), Info (blue)
- **Neutral:** Gray scale for text and backgrounds

See `lib/theme/index.ts` for complete theme configuration.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `OPENAI_API_KEY` - OpenAI API key for LLM integration

## Deployment

This project is configured for deployment on **Vercel**.

### Prerequisites

- Git repository (initialized and committed)
- Vercel account ([sign up](https://vercel.com/signup))

### Deployment Steps

1. **Push to Git Repository**
   ```bash
   # If using GitHub/GitLab/Bitbucket, push your code:
   git remote add origin <your-repo-url>
   git push -u origin master
   ```

2. **Create Vercel Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel project settings, add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `OPENAI_API_KEY` - (Optional) OpenAI API key for future LLM features

4. **Deploy**
   - Vercel will automatically deploy on every push to your main branch
   - Preview deployments are created for pull requests
   - Your app will be available at `https://your-project.vercel.app`

### Deployment Settings

- **Framework Preset:** Next.js (auto-detected)
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)
- **Node.js Version:** 18.x or 20.x (compatible with Next.js 15)

### Environment Variables in Production

All environment variables must be configured in the Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add variables for Production, Preview, and Development environments
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` files to Git

For more information, see [Vercel Documentation](https://vercel.com/docs).
