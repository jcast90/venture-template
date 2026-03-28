# Component Catalog

Complete reference for all 14 UI components in `src/components/ui/`. Every import path is lowercase. Every component name is PascalCase.

---

## 1. Button

```tsx
import { Button, buttonVariants } from "@/components/ui/button";
```

**Exports:** `Button`, `buttonVariants`

**Variants:** `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`

**Sizes:** `default` (h-8), `xs` (h-6), `sm` (h-7), `lg` (h-9), `icon` (size-8), `icon-xs` (size-6), `icon-sm` (size-7), `icon-lg` (size-9)

```tsx
<Button>Default</Button>
<Button variant="outline" size="sm">Small Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon">
  <Settings className="size-4" />
</Button>

{/* Gradient brand button */}
<Button
  className="text-white"
  style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
>
  Save Changes
</Button>
```

---

## 2. Card

```tsx
import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "@/components/ui/card";
```

**Exports:** `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`

**Card props:** `size` — `"default"` | `"sm"`

```tsx
<Card className="border-white/[0.06] bg-brand-surface-light text-white">
  <CardHeader>
    <CardTitle className="text-base font-semibold text-white">Title</CardTitle>
    <CardDescription className="text-sm text-white/40">Description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card body content here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**CardAction** places a top-right element in the header:
```tsx
<CardHeader>
  <CardTitle>Title</CardTitle>
  <CardAction>
    <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
  </CardAction>
</CardHeader>
```

---

## 3. Input

```tsx
import { Input } from "@/components/ui/input";
```

**Exports:** `Input`

Standard HTML input props (`type`, `placeholder`, `defaultValue`, `disabled`, etc.).

```tsx
<Input
  type="email"
  placeholder="you@example.com"
  className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20"
/>
```

---

## 4. Label

```tsx
import { Label } from "@/components/ui/label";
```

**Exports:** `Label`

Standard HTML label element with styled defaults.

```tsx
<div className="space-y-2">
  <Label className="text-white/70">Email Address</Label>
  <Input type="email" placeholder="you@example.com" />
</div>
```

---

## 5. Textarea

```tsx
import { Textarea } from "@/components/ui/textarea";
```

**Exports:** `Textarea`

Standard HTML textarea props. Uses `field-sizing-content` for auto-resize.

```tsx
<Textarea
  placeholder="Enter your message..."
  className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20"
/>
```

---

## 6. Select

```tsx
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
```

**Exports:** `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`

**SelectTrigger props:** `size` — `"default"` | `"sm"`

**Important:** This is a Base UI Select, NOT Radix. Do NOT use `onChange` — use `value` and `onValueChange` on the `Select` root.

```tsx
<Select defaultValue="active">
  <SelectTrigger className="w-[180px] border-white/[0.08] bg-white/[0.03] text-white">
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Status</SelectLabel>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="inactive">Inactive</SelectItem>
      <SelectItem value="archived">Archived</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

---

## 7. Table

```tsx
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
```

**Exports:** `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`

```tsx
<Table>
  <TableHeader>
    <TableRow className="border-white/[0.06] hover:bg-transparent">
      <TableHead className="text-white/40">Name</TableHead>
      <TableHead className="text-white/40">Status</TableHead>
      <TableHead className="text-right text-white/40">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-white/[0.06] hover:bg-white/[0.03]">
      <TableCell className="font-medium text-white/80">Item Name</TableCell>
      <TableCell>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon-sm"><Pencil className="size-4" /></Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## 8. Dialog

```tsx
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
```

**Exports:** `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`

**DialogContent props:** `showCloseButton` — `boolean` (default `true`)

**DialogFooter props:** `showCloseButton` — `boolean` (default `false`)

```tsx
<Dialog>
  <DialogTrigger render={<Button>Open Dialog</Button>} />
  <DialogContent className="bg-brand-surface-light border-white/[0.06] text-white">
    <DialogHeader>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogDescription className="text-white/40">
        Make changes to your item below.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <Input placeholder="Item name" />
    </div>
    <DialogFooter>
      <DialogClose render={<Button variant="outline">Cancel</Button>} />
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 9. Sheet

```tsx
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet";
```

**Exports:** `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`

**SheetContent props:** `side` — `"top"` | `"right"` | `"bottom"` | `"left"` (default `"right"`), `showCloseButton` — `boolean` (default `true`)

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline">Open Panel</Button>} />
  <SheetContent className="bg-brand-surface border-white/[0.06] text-white">
    <SheetHeader>
      <SheetTitle>Details</SheetTitle>
      <SheetDescription className="text-white/40">
        View and edit details.
      </SheetDescription>
    </SheetHeader>
    <div className="p-4">
      <p>Sheet body content.</p>
    </div>
    <SheetFooter>
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

## 10. DropdownMenu

```tsx
import { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
```

**Exports:** `DropdownMenu`, `DropdownMenuPortal`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`

**DropdownMenuItem props:** `variant` — `"default"` | `"destructive"`, `inset` — `boolean`

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>} />
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Pencil className="size-4" /> Edit
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Copy className="size-4" /> Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <Trash2 className="size-4" /> Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 11. Badge

```tsx
import { Badge, badgeVariants } from "@/components/ui/badge";
```

**Exports:** `Badge`, `badgeVariants`

**Variants:** `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>

{/* Status badges with custom colors */}
<Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>
<Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Pending</Badge>
<Badge className="bg-red-500/10 text-red-400 border-red-500/20">Failed</Badge>
```

---

## 12. Separator

```tsx
import { Separator } from "@/components/ui/separator";
```

**Exports:** `Separator`

**Props:** `orientation` — `"horizontal"` | `"vertical"` (default `"horizontal"`)

```tsx
<Separator className="bg-white/[0.06]" />
<Separator orientation="vertical" className="bg-white/[0.06]" />
```

---

## 13. Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge } from "@/components/ui/avatar";
```

**Exports:** `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarBadge`

**Avatar props:** `size` — `"default"` (size-8) | `"sm"` (size-6) | `"lg"` (size-10)

```tsx
{/* Single avatar with fallback */}
<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

{/* Avatar group */}
<AvatarGroup>
  <Avatar>
    <AvatarFallback>SC</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarFallback>MJ</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>

{/* Avatar with online badge */}
<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge className="bg-emerald-500" />
</Avatar>
```

---

## 14. Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "@/components/ui/tabs";
```

**Exports:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants`

**Tabs props:** `orientation` — `"horizontal"` | `"vertical"` (default `"horizontal"`)

**TabsList props:** `variant` — `"default"` (pill-style) | `"line"` (underline-style)

```tsx
{/* Pill-style tabs (default) */}
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
</Tabs>

{/* Line-style tabs (settings pattern) */}
<Tabs defaultValue="general">
  <TabsList
    variant="line"
    className="mb-8 w-full justify-start border-b border-white/[0.06] bg-transparent pb-0"
  >
    <TabsTrigger
      value="general"
      className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary"
    >
      <Shield className="size-4" />
      General
    </TabsTrigger>
    <TabsTrigger
      value="billing"
      className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary"
    >
      <CreditCard className="size-4" />
      Billing
    </TabsTrigger>
  </TabsList>
  <TabsContent value="general">General settings</TabsContent>
  <TabsContent value="billing">Billing settings</TabsContent>
</Tabs>
```

---

## Non-UI Components

### Logo

```tsx
import { Logo, LogoWithName } from "@/components/logo";
```

**Logo props:** `size` — `number` (default `32`). Renders a gradient square with product initials.

**LogoWithName** renders the logo next to the product name from config.

```tsx
<Logo size={40} />
<LogoWithName size={32} />
```
