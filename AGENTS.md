<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes. Read `node_modules/next/dist/docs/` before writing any code.
<!-- END:nextjs-agent-rules -->

# Venture Template — Agent Instructions

## Import Rules (CRITICAL — builds fail if violated)

- File paths are ALWAYS lowercase: `@/components/ui/card` (NOT `@/components/ui/Card`)
- Component names are PascalCase: `import { Card } from "@/components/ui/card"`
- Icons are PascalCase from lucide-react: `import { Search, Plus } from "lucide-react"`
- ONLY import from files listed below — nothing else is installed

### Available components

```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

### Other imports
```tsx
import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/client";
import config from "@/lib/config";
import { Logo } from "@/components/logo";
```

## DO NOT

- Use uppercase import paths (`@/components/ui/Card` → wrong)
- Import components not listed above (Accordion, Popover, Tooltip, Switch, Checkbox, RadioGroup, Progress, Slider, ScrollArea, Calendar, Form, Toast — NOT installed)
- Use `@radix-ui` directly — always import from `@/components/ui/`
- Use `onChange` on Select — use `onValueChange`
- Use password or OAuth login — OTP email only
- Create files in `src/components/ui/` — that's shadcn-managed
- Create `src/utils/`, `src/helpers/`, `src/services/` — use `src/lib/`

## Page conventions

- Start every dashboard page with `"use client";`
- Use `useState` + `useEffect` for data, wrap Supabase in try/catch, fallback to sample data
- Loading state: `<Loader2 className="size-6 animate-spin text-white/40" />`
- Page wrapper: `<div className="px-4 py-8 lg:px-8">`
- Page title: `<h1 className="text-2xl font-bold tracking-tight text-white">`
- Create/edit via Dialog (not separate pages), delete via confirmation Dialog

## Styling rules

- Dark theme: `bg-brand-surface` (background), `bg-brand-surface-light` (cards)
- Text: `text-white` / `text-white/60` / `text-white/40`
- Borders: `border-white/[0.06]`
- Cards: `<Card className="border-white/[0.06] bg-brand-surface-light text-white">`
- Gradient buttons: `style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}`
- Table rows: `hover:bg-white/[0.03]`, headers: `text-white/40`
- Status badges: emerald (success), amber (pending), red (error)

## File placement

| What | Where |
|------|-------|
| Dashboard pages | `src/app/dashboard/[feature]/page.tsx` |
| API routes | `src/app/api/[name]/route.ts` |
| Custom hooks | `src/hooks/use-[name].ts` |
| Utilities | `src/lib/[name].ts` |
| Custom components | `src/components/[name].tsx` |
| DB schema | `supabase/schema.sql` |

## Testing
```bash
npm run build       # Must pass before deploy
npx tsc --noEmit    # Type check
```

## Reference (read on demand, not loaded at startup)
- `docs/guide.md` — How to add pages, routes, tables, hooks + package doc links
- `docs/patterns.md` — Copy-pasteable CRUD page pattern
- `docs/components.md` — Component props and variants
