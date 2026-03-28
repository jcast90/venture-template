# Development Guide — How to Add Features

Step-by-step recipes for adding new functionality to this template. Follow these exactly to avoid build errors.

## Table of Contents

- [Add a Dashboard Page](#add-a-dashboard-page)
- [Add an API Route](#add-an-api-route)
- [Add a Supabase Table](#add-a-supabase-table)
- [Add a UI Component](#add-a-ui-component)
- [Add a Custom Hook](#add-a-custom-hook)
- [Add a Utility Function](#add-a-utility-function)
- [File Structure Rules](#file-structure-rules)
- [Package Documentation Links](#package-documentation-links)

---

## Add a Dashboard Page

Every feature page lives under `src/app/dashboard/`. The middleware auto-protects all `/dashboard/*` routes — no auth code needed.

### Steps

1. **Create the directory and page file:**
   ```
   src/app/dashboard/[feature-name]/page.tsx
   ```

2. **Register the nav item** in `venture.config.json`:
   ```json
   {
     "dashboard": {
       "navItems": [
         { "label": "Feature Name", "href": "/dashboard/feature-name", "icon": "Zap" }
       ]
     }
   }
   ```
   The icon name must be a valid lucide-react PascalCase export (see AGENTS.md for the list).

3. **Use this page skeleton:**
   ```tsx
   "use client";

   import { useEffect, useState } from "react";
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
   import { Button } from "@/components/ui/button";
   import { Input } from "@/components/ui/input";
   import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
   import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db";
   import { Loader2, Plus, Search } from "lucide-react";

   // Type for your data
   interface Item {
     id: string;
     name: string;
     // ... fields matching your Supabase table
   }

   // Realistic sample data (used when Supabase is not configured)
   const SAMPLE_DATA: Item[] = [
     { id: "1", name: "Example item" },
   ];

   export default function FeatureNamePage() {
     const [items, setItems] = useState<Item[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");

     useEffect(() => {
       async function load() {
         try {
           const rows = await getRows<Item>("feature_table", { orderBy: "created_at" });
           setItems(rows.length > 0 ? rows : SAMPLE_DATA);
         } catch {
           setItems(SAMPLE_DATA);
         } finally {
           setLoading(false);
         }
       }
       load();
     }, []);

     if (loading) {
       return (
         <div className="flex items-center justify-center py-20">
           <Loader2 className="size-6 animate-spin text-white/40" />
         </div>
       );
     }

     const filtered = items.filter((item) =>
       item.name.toLowerCase().includes(searchTerm.toLowerCase())
     );

     return (
       <div className="px-4 py-8 lg:px-8">
         <div className="flex items-center justify-between">
           <h1 className="text-2xl font-bold tracking-tight text-white">Feature Name</h1>
           <Button
             className="text-sm font-semibold text-white"
             style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
           >
             <Plus className="size-4 mr-2" /> Create
           </Button>
         </div>

         <div className="mt-6 relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
           <Input
             placeholder="Search..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10 bg-white/5 border-white/10"
           />
         </div>

         <Card className="mt-4 border-white/[0.06] bg-brand-surface-light text-white">
           <Table>
             <TableHeader>
               <TableRow className="border-white/[0.06]">
                 <TableHead className="text-white/40">Name</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filtered.map((item) => (
                 <TableRow key={item.id} className="border-white/[0.06] hover:bg-white/[0.03]">
                   <TableCell className="text-sm text-white/80">{item.name}</TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </Card>
       </div>
     );
   }
   ```

4. **Add a Supabase table** (see [Add a Supabase Table](#add-a-supabase-table) below).

### Rules
- ALWAYS start with `"use client";` — dashboard pages use hooks
- ALWAYS include a loading state with `Loader2`
- ALWAYS fall back to sample data if Supabase fetch fails
- NEVER use `getServerSideProps` or `getStaticProps` — this is App Router
- NEVER create separate pages for create/edit — use Dialog components

---

## Add an API Route

API routes live under `src/app/api/`. They run server-side.

### Steps

1. **Create the route file:**
   ```
   src/app/api/[route-name]/route.ts
   ```

2. **Use this skeleton:**
   ```tsx
   import { NextRequest, NextResponse } from "next/server";
   import { createClient } from "@/lib/supabase/server";

   export async function POST(request: NextRequest) {
     try {
       const supabase = await createClient();
       const body = await request.json();

       // Verify auth if needed
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
       }

       // Your logic here
       const { data, error } = await supabase
         .from("table_name")
         .insert({ ...body, user_id: user.id })
         .select()
         .single();

       if (error) {
         return NextResponse.json({ error: error.message }, { status: 400 });
       }

       return NextResponse.json(data);
     } catch (error) {
       return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
       );
     }
   }

   export async function GET(request: NextRequest) {
     const supabase = await createClient();
     const { data } = await supabase.from("table_name").select("*");
     return NextResponse.json(data || []);
   }
   ```

### Rules
- Use `createClient` from `@/lib/supabase/server` (NOT client) in API routes
- Always validate auth with `supabase.auth.getUser()` for protected endpoints
- Return proper HTTP status codes (400, 401, 404, 500)
- Use try/catch — never let unhandled errors crash the route
- Export named functions: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`

---

## Add a Supabase Table

### Steps

1. **Add to `supabase/schema.sql`:**
   ```sql
   CREATE TABLE IF NOT EXISTS feature_items (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
       name TEXT NOT NULL,
       status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
       created_at TIMESTAMPTZ DEFAULT now(),
       updated_at TIMESTAMPTZ DEFAULT now()
   );

   -- Enable RLS
   ALTER TABLE feature_items ENABLE ROW LEVEL SECURITY;

   -- Users can only see their own rows
   CREATE POLICY "Users can view own rows" ON feature_items
       FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own rows" ON feature_items
       FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own rows" ON feature_items
       FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own rows" ON feature_items
       FOR DELETE USING (auth.uid() = user_id);
   ```

2. **Use CRUD helpers in your page:**
   ```tsx
   import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db";

   // Fetch
   const items = await getRows<Item>("feature_items", {
     orderBy: "created_at",
     ascending: false,
     limit: 50,
     filter: { status: "active" }
   });

   // Insert
   const newItem = await insertRow<Item>("feature_items", { name: "New", user_id: userId });

   // Update
   const updated = await updateRow<Item>("feature_items", itemId, { name: "Updated" });

   // Delete
   const deleted = await deleteRow("feature_items", itemId);
   ```

### Rules
- ALWAYS add `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`
- ALWAYS add `created_at TIMESTAMPTZ DEFAULT now()`
- ALWAYS enable RLS and add policies
- ALWAYS include `user_id` foreign key if the data is user-specific
- Use CHECK constraints for enum-like columns instead of separate enum types

---

## Add a UI Component

Only add components from the shadcn/ui library. Do NOT create custom component files unless absolutely necessary.

### To install a new shadcn component:
```bash
npx shadcn@latest add [component-name]
```

This creates a file at `src/components/ui/[component-name].tsx`.

### Currently installed components (14):
```
avatar, badge, button, card, dialog, dropdown-menu, input,
label, select, separator, sheet, table, tabs, textarea
```

### To create a custom component:

1. Place it in `src/components/[name].tsx` (NOT in `ui/` — that's for shadcn only)
2. Use `"use client";` if it uses hooks or event handlers
3. Export as a named export: `export function MyComponent() {}`

### Rules
- NEVER modify files in `src/components/ui/` — they're shadcn-managed
- NEVER create components in `src/components/ui/` manually — use `npx shadcn add`
- Custom components go in `src/components/` (top level, not `ui/`)
- Prefer composing existing UI components over creating new ones

---

## Add a Custom Hook

### Steps

1. **Create the hook file:**
   ```
   src/hooks/use-[name].ts
   ```

2. **Use this pattern:**
   ```tsx
   "use client";

   import { useEffect, useState } from "react";
   import { createClient } from "@/lib/supabase/client";

   export function useFeatureData() {
     const [data, setData] = useState<Item[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       const supabase = createClient();

       async function fetch() {
         try {
           const { data, error } = await supabase.from("table").select("*");
           if (error) throw error;
           setData(data || []);
         } catch (e) {
           setError(e instanceof Error ? e.message : "Failed to fetch");
         } finally {
           setLoading(false);
         }
       }

       fetch();
     }, []);

     return { data, loading, error };
   }
   ```

### Rules
- Prefix with `use` (React convention)
- Place in `src/hooks/` directory
- Always return loading and error states
- Use the Supabase client from `@/lib/supabase/client` (browser-side)

---

## Add a Utility Function

### Steps

1. **Create or extend a file in `src/lib/`:**
   ```
   src/lib/[name].ts
   ```

2. **Example:**
   ```tsx
   // src/lib/format.ts
   export function formatCurrency(cents: number): string {
     return new Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
     }).format(cents / 100);
   }

   export function formatDate(date: string | Date): string {
     return new Intl.DateTimeFormat("en-US", {
       month: "short",
       day: "numeric",
       year: "numeric",
     }).format(new Date(date));
   }
   ```

### Rules
- Place in `src/lib/` — not in `src/utils/` or `src/helpers/`
- Pure functions only — no React hooks, no side effects
- Export as named exports (not default)

---

## File Structure Rules

```
src/
├── app/                          # Routes (Next.js App Router)
│   ├── page.tsx                  # Landing page (/)
│   ├── layout.tsx                # Root layout
│   ├── middleware.ts             # Auth middleware
│   ├── (auth)/                   # Auth pages (grouped route)
│   │   ├── login/page.tsx        # /login
│   │   └── signup/page.tsx       # /signup (redirects to /login)
│   ├── auth/callback/route.ts    # Auth callback
│   ├── dashboard/                # Protected pages
│   │   ├── layout.tsx            # Sidebar layout
│   │   ├── page.tsx              # /dashboard
│   │   ├── settings/page.tsx     # /dashboard/settings
│   │   └── [feature]/page.tsx    # /dashboard/[feature]
│   └── api/                      # API routes
│       └── [route]/route.ts      # /api/[route]
├── components/                   # React components
│   ├── ui/                       # shadcn/ui (DO NOT manually edit)
│   ├── logo.tsx                  # Brand logo
│   └── [custom].tsx              # Custom components
├── hooks/                        # Custom React hooks
│   └── use-[name].ts
├── lib/                          # Utilities and clients
│   ├── config.ts                 # venture.config.json import
│   ├── stripe.ts                 # Stripe client
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   ├── middleware.ts         # Session management
│   │   └── db.ts                 # CRUD helpers
│   └── [utility].ts              # Utility functions
└── inngest/                      # Background jobs
    └── [function].ts
```

### Key rules:
- **Pages** go in `src/app/` following Next.js App Router conventions
- **Components** go in `src/components/` (custom) or `src/components/ui/` (shadcn only)
- **Hooks** go in `src/hooks/`
- **Utilities** go in `src/lib/`
- **API routes** go in `src/app/api/`
- **Database schema** goes in `supabase/schema.sql`
- NEVER create `src/utils/`, `src/helpers/`, `src/services/`, `src/types/` — keep it flat

---

## Package Documentation Links

Use these authoritative docs when you need to look up APIs, patterns, or best practices.

### Core Framework
| Package | Version | Docs |
|---------|---------|------|
| Next.js (App Router) | 16.2.1 | https://nextjs.org/docs/app |
| React | 19 | https://react.dev/reference/react |
| TypeScript | 5 | https://www.typescriptlang.org/docs/ |

### Styling
| Package | Version | Docs |
|---------|---------|------|
| Tailwind CSS | 4 | https://tailwindcss.com/docs |
| shadcn/ui | 4.1 | https://ui.shadcn.com/docs/components |
| Lucide React (icons) | 1.7 | https://lucide.dev/icons/ |
| class-variance-authority | 0.7 | https://cva.style/docs |
| tailwind-merge | 3.5 | https://github.com/dcastil/tailwind-merge |

### Database & Auth
| Package | Version | Docs |
|---------|---------|------|
| Supabase JS | 2.100 | https://supabase.com/docs/reference/javascript |
| Supabase SSR | 0.9 | https://supabase.com/docs/guides/auth/server-side/nextjs |
| Supabase Auth | — | https://supabase.com/docs/guides/auth |
| Supabase RLS | — | https://supabase.com/docs/guides/database/postgres/row-level-security |

### Payments
| Package | Version | Docs |
|---------|---------|------|
| Stripe Node | 20.4 | https://docs.stripe.com/api |
| Stripe.js | 8.11 | https://docs.stripe.com/js |
| Stripe Checkout | — | https://docs.stripe.com/payments/checkout |
| Stripe Billing Portal | — | https://docs.stripe.com/customer-management/integrate-customer-portal |

### Email & Background Jobs
| Package | Version | Docs |
|---------|---------|------|
| Resend | 6.9 | https://resend.com/docs/sdks/node |
| Inngest | 4.1 | https://www.inngest.com/docs |

### Testing
| Package | Version | Docs |
|---------|---------|------|
| Playwright | 1.58 | https://playwright.dev/docs/intro |

### React Best Practices
- Hooks rules: https://react.dev/reference/rules/rules-of-hooks
- useEffect patterns: https://react.dev/learn/synchronizing-with-effects
- State management: https://react.dev/learn/managing-state
- Forms: https://react.dev/reference/react-dom/components/form

### Next.js App Router Patterns
- Route handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Server components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Client components: https://nextjs.org/docs/app/building-your-application/rendering/client-components
- Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
