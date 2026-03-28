<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Venture Template — Agent Instructions

## Import Rules (CRITICAL — builds fail if violated)

### Component imports
- File paths are ALWAYS lowercase: `@/components/ui/card` (NOT `@/components/ui/Card`)
- Component names are PascalCase: `import { Card } from "@/components/ui/card"`
- ONLY import from files that exist in `src/components/ui/`

### Available UI components (complete list)

```tsx
// Cards
import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "@/components/ui/card";

// Buttons
import { Button, buttonVariants } from "@/components/ui/button";

// Form inputs
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";

// Tables
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";

// Dialogs & overlays
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";

// Display
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge } from "@/components/ui/avatar";

// Tabs
import { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "@/components/ui/tabs";
```

### Icons (lucide-react)
```tsx
// Common icons — always PascalCase
import { Search, Plus, Pencil, Trash2, Check, X, Loader2, Filter, Download, Upload,
  Settings, User, Users, Mail, Send, Eye, EyeOff, Star, Heart, Calendar, Clock,
  AlertCircle, CheckCircle, Info, BarChart3, FileText, Copy, ExternalLink,
  MoreHorizontal, MoreVertical, ChevronDown, ChevronRight, ChevronUp, ChevronLeft,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, TrendingUp, TrendingDown, Activity,
  LayoutDashboard, Bell, Lock, Shield, RefreshCw, Zap, Sparkles, MapPin, Phone,
  FolderOpen, DollarSign, ArrowUpRight, ArrowDownRight, MessageSquare, CreditCard, Key
} from "lucide-react";
```

### Other imports
```tsx
// Supabase CRUD helpers
import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db";

// Supabase client (browser-side)
import { createClient } from "@/lib/supabase/client";

// Config (reads venture.config.json)
import config from "@/lib/config";

// Logo
import { Logo, LogoWithName } from "@/components/logo";
```

## DO NOT rules

- DO NOT use uppercase in import file paths (wrong: `@/components/ui/Card`)
- DO NOT import components not listed above. These are NOT installed:
  Accordion, Popover, Tooltip, Switch, Checkbox, RadioGroup, Progress, Slider,
  ScrollArea, NavigationMenu, Menubar, HoverCard, Collapsible, Command, ContextMenu,
  AlertDialog, AspectRatio, Calendar, Carousel, Drawer, Form, Pagination, Resizable,
  Sonner, Toast, Toggle, ToggleGroup
- DO NOT use `@radix-ui` imports directly — components use `@base-ui/react` primitives under the hood, but always import from `@/components/ui/`
- DO NOT use `onChange` on Select — this is a Base UI Select, use the `value` prop on `Select` and handle changes via `onValueChange` on the root `Select` component
- DO NOT use password or OAuth login — this template uses OTP email verification only
- DO NOT import `CardAction` unless you need a top-right action slot in the card header
- DO NOT use `TableFooter` or `TableCaption` unless you actually need them — most tables only use `Table`, `TableHeader`, `TableBody`, `TableHead`, `TableRow`, `TableCell`

## Page conventions

- Every dashboard page must start with `"use client";` directive
- Use `useState` for local state, `useEffect` for data fetching
- Wrap Supabase calls in try/catch with fallback to sample data
- Use the brand CSS variables: `var(--brand-primary)`, `var(--brand-accent)`
- Background: `bg-brand-surface` (dark) or `bg-brand-surface-light` (cards)
- Text: `text-white` (primary), `text-white/60` (secondary), `text-white/40` (muted), `text-white/50` (descriptions)
- Page wrapper: `<div className="px-4 py-8 lg:px-8">`
- Page title: `<h1 className="text-2xl font-bold tracking-tight text-white">`

## Styling conventions

- All backgrounds are dark (#0A0A0F base, #111118 cards)
- Use `border-white/[0.06]` for subtle borders
- Gradient buttons: `style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}`
- Card pattern: `<Card className="border-white/[0.06] bg-brand-surface-light text-white">`
- Input pattern: `className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20"`
- Ghost button: `className="text-white/50 hover:text-white hover:bg-white/10"`
- Table row: `className="border-white/[0.06] hover:bg-white/[0.03]"`
- Table head: `className="text-white/40"`
- Status badges: emerald for success (`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`), amber for pending (`bg-amber-500/10 text-amber-400 border-amber-500/20`), red for error (`bg-red-500/10 text-red-400 border-red-500/20`)

## Button variants

| Variant | Usage |
|---------|-------|
| `default` | Primary actions (solid bg) |
| `outline` | Secondary actions (bordered) |
| `secondary` | Tertiary actions |
| `ghost` | Subtle actions, icon buttons |
| `destructive` | Delete/danger actions |
| `link` | Inline links |

## Button sizes

| Size | Usage |
|------|-------|
| `default` | Standard (h-8) |
| `xs` | Tiny (h-6) |
| `sm` | Small (h-7) |
| `lg` | Large (h-9) |
| `icon` | Square icon button (size-8) |
| `icon-xs` | Tiny icon button (size-6) |
| `icon-sm` | Small icon button (size-7) |
| `icon-lg` | Large icon button (size-9) |

## Badge variants

| Variant | Usage |
|---------|-------|
| `default` | Primary badge (solid) |
| `secondary` | Muted badge |
| `destructive` | Error/danger badge |
| `outline` | Bordered badge |
| `ghost` | Subtle hover badge |
| `link` | Link-style badge |

## TabsList variants

| Variant | Usage |
|---------|-------|
| `default` | Pill-style tabs with muted background |
| `line` | Underline-style tabs (used in settings) |

## Testing

```bash
npm run build          # Must pass before deploy
npx tsc --noEmit       # Type check
npm run lint           # ESLint
npx playwright test    # E2E tests
```

## Reference docs

- `docs/guide.md` — How to add pages, routes, hooks, tables, components (READ THIS FIRST)
- `docs/components.md` — Full component API with usage examples
- `docs/patterns.md` — Complete page patterns (CRUD, dashboard, settings)
