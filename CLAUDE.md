@AGENTS.md

# Venture Template — Development Guide

## What This Is
SaaS product built from Venture OS template. Landing page, dashboard, OTP auth, Stripe billing — all configured via `venture.config.json`.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Payments**: Stripe
- **Auth**: Supabase OTP (6-digit email code)

## Project Structure
```
src/app/                    # Routes
  page.tsx                  # Landing (config-driven)
  (auth)/login/             # OTP login
  dashboard/                # Protected pages (auto-auth via middleware)
    layout.tsx              # Sidebar
    page.tsx                # Dashboard home
    settings/page.tsx       # Settings
    [feature]/page.tsx      # Add features here
  api/                      # Server routes
src/components/ui/          # shadcn (DO NOT edit manually)
src/lib/supabase/           # client.ts, server.ts, db.ts (CRUD helpers)
venture.config.json         # All product content
supabase/schema.sql         # Database schema
```

## Configuration
Edit `venture.config.json` for: product name, tagline, brand colors, landing copy, pricing tiers, dashboard nav items. Toggle `flags.waitlistMode` for pre-launch vs live.

## Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=       # Required — no fallback, will throw if missing
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Required — no fallback
STRIPE_SECRET_KEY=              # For payments
RESEND_API_KEY=                 # For emails
NEXT_PUBLIC_APP_URL=            # Your domain
```

## Auth Flow
1. User visits `/login` → enters email
2. Supabase sends 6-digit OTP code
3. User enters code → verified → redirected to `/dashboard`
4. New users auto-created (`shouldCreateUser: true`)
5. Middleware protects all `/dashboard/*` routes
6. Sign out: POST `/api/auth/signout`

## Supabase Setup
1. Create project at supabase.com
2. Copy URL + anon key to `.env.local`
3. Run `supabase/schema.sql` in SQL Editor

## Adding Features
1. Create `src/app/dashboard/[feature]/page.tsx`
2. Add nav item to `venture.config.json` → `dashboard.navItems`
3. Add table to `supabase/schema.sql` with RLS
4. See `docs/guide.md` for step-by-step recipes
