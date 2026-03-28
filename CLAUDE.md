@AGENTS.md

# Venture Template — Development Guide

## What This Is

This is a SaaS product built from the Venture OS template system. It includes a landing page, dashboard, auth, Stripe billing, and marketing materials — all configured via `venture.config.json`.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Payments**: Stripe (Checkout, Billing Portal, Webhooks)
- **Email**: Resend
- **Hosting**: Vercel
- **Auth**: Supabase Auth (OTP email verification — 6-digit code)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page (reads from venture.config.json)
│   ├── layout.tsx                  # Root layout with Inter font + metadata
│   ├── middleware.ts               # Auth middleware — protects /dashboard/*
│   ├── (auth)/
│   │   ├── login/login-form.tsx     # Login (OTP email verification)
│   │   ├── signup/page.tsx         # Redirects to /login
│   │   └── layout.tsx              # Centered auth layout
│   ├── auth/callback/route.ts      # OAuth callback handler
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar layout (desktop fixed, mobile Sheet)
│   │   ├── page.tsx                # Dashboard home (stat cards, activity table)
│   │   └── settings/page.tsx       # Settings (General, Billing, Team, API Keys tabs)
│   └── api/
│       ├── waitlist/route.ts       # POST: Supabase insert + Resend email
│       ├── checkout/route.ts       # POST: Stripe Checkout session
│       ├── billing/portal/route.ts # POST: Stripe Billing Portal
│       ├── webhooks/stripe/route.ts# POST: Stripe webhook handler
│       └── auth/signout/route.ts   # POST: Sign out
├── components/
│   ├── logo.tsx                    # Auto-generated logo from brand colors
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── config.ts                   # Imports venture.config.json
│   ├── stripe.ts                   # Stripe client
│   ├── brand-palettes.ts           # 8 color palettes
│   └── supabase/
│       ├── client.ts               # Browser client
│       ├── server.ts               # Server client (cookies)
│       └── middleware.ts           # Auth session management
├── venture.config.json             # ALL product-specific content
├── supabase/schema.sql             # Database schema
└── docs/                           # Marketing materials (generated)
    ├── marketing/copy.md
    ├── seo/strategy.md
    ├── outreach/plan.md
    └── LAUNCH-PLAYBOOK.md
```

## Configuration

All product-specific content lives in `venture.config.json`. Edit this file to customize:
- Product name, tagline, description
- Brand colors (primary, accent, gradients)
- Landing page copy (headline, pain stats, features, pricing)
- Dashboard navigation items
- Feature flags (`waitlistMode`: true = waitlist, false = pricing + signup)

## Environment Variables

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (required for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (required for emails)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Auth Flow

1. User visits `/login` → enters email
2. Supabase sends a 6-digit OTP code via email
3. User enters the code → `verifyOtp` → redirected to `/dashboard`
4. New users are auto-created (`shouldCreateUser: true` in OTP options)
5. Middleware checks session on every `/dashboard/*` request → redirects to `/login` if not authenticated
6. Sign out: POST `/api/auth/signout`

## Supabase Setup

1. Create project at supabase.com
2. Copy URL and anon key to `.env.local`
3. Run schema: paste `supabase/schema.sql` in SQL Editor
4. Set redirect URL: `https://your-domain.com/auth/callback`
5. (Optional) Configure Resend as custom SMTP in Auth → Email Templates

## Stripe Setup

1. Create products/prices in Stripe Dashboard
2. Set price IDs in env vars
3. Create webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Feature Flags

```json
{
  "flags": {
    "waitlistMode": true  // true = waitlist form, false = pricing + signup CTAs
  }
}
```

Toggle `waitlistMode` to switch between pre-launch (waitlist collection) and live (pricing + auth).

## Running Tests

```bash
# Unit tests
npm test

# E2E tests (requires Playwright)
npx playwright install
npx playwright test

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Building Product Features

When adding product-specific features to the dashboard:

1. Create new pages in `src/app/dashboard/[feature]/page.tsx`
2. Add nav items to `venture.config.json` → `dashboard.navItems`
3. Use shadcn/ui components from `src/components/ui/`
4. Use Supabase for data: `import { createClient } from "@/lib/supabase/client"`
5. Add new tables to `supabase/schema.sql`
6. Protected by auth middleware automatically (all `/dashboard/*` routes)

## Common Patterns

### Fetching data from Supabase (client component)
```tsx
"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function MyPage() {
  const [data, setData] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("my_table").select("*").then(({ data }) => setData(data || []));
  }, []);
}
```

### Server-side data fetching
```tsx
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("my_table").select("*");
  return <div>{JSON.stringify(data)}</div>;
}
```

### Adding a new API route
```tsx
// src/app/api/my-route/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  // ... handle request
  return NextResponse.json({ success: true });
}
```

## Deployment

```bash
# Deploy to Vercel
npx vercel --prod

# Or push to GitHub (auto-deploys if connected)
git push
```
