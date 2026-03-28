# Component Catalog

All components live in `src/components/ui/`. Import paths are **always lowercase**.

---

## Avatar

```ts
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge } from "@/components/ui/avatar";
```

**Exports:** `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarBadge`

**Props:**
- `Avatar` — `size?: "default" | "sm" | "lg"`
- `AvatarImage` — standard `<img>` props (`src`, `alt`, etc.)
- `AvatarFallback` — renders when image fails to load

**Usage:**
```tsx
<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Badge

```ts
import { Badge, badgeVariants } from "@/components/ui/badge";
```

**Exports:** `Badge`, `badgeVariants`

**Variants:** `"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"`

**Usage:**
```tsx
<Badge variant="secondary">Active</Badge>
<Badge variant="destructive">Overdue</Badge>
```

---

## Button

```ts
import { Button, buttonVariants } from "@/components/ui/button";
```

**Exports:** `Button`, `buttonVariants`

**Variants:** `"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"`

**Sizes:** `"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"`

**Usage:**
```tsx
<Button variant="outline" size="sm">Cancel</Button>
<Button style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
  Save
</Button>
```

---

## Card

```ts
import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "@/components/ui/card";
```

**Exports:** `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`

**Props:**
- `Card` — `size?: "default" | "sm"`

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
    <CardDescription>Monthly recurring</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">$12,400</p>
  </CardContent>
</Card>
```

---

## Dialog

```ts
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
```

**Exports:** `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`

**Props:**
- `DialogContent` — `showCloseButton?: boolean` (default `true`)
- `DialogFooter` — `showCloseButton?: boolean` (default `false`)

**Usage:**
```tsx
<Dialog>
  <DialogTrigger render={<Button />}>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Item</DialogTitle>
      <DialogDescription>Fill in the details below.</DialogDescription>
    </DialogHeader>
    <form>{/* fields */}</form>
    <DialogFooter>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## DropdownMenu

```ts
import { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
```

**Exports:** `DropdownMenu`, `DropdownMenuPortal`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`

**Props:**
- `DropdownMenuItem` — `inset?: boolean`, `variant?: "default" | "destructive"`
- `DropdownMenuContent` — `align`, `alignOffset`, `side`, `sideOffset`

**Usage:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
    <MoreHorizontal className="h-4 w-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Input

```ts
import { Input } from "@/components/ui/input";
```

**Exports:** `Input`

**Props:** Standard HTML `<input>` props (`type`, `placeholder`, `value`, `onChange`, `disabled`, etc.)

**Usage:**
```tsx
<Input type="email" placeholder="you@company.com" className="bg-white/5 border-white/10" />
```

---

## Label

```ts
import { Label } from "@/components/ui/label";
```

**Exports:** `Label`

**Props:** Standard HTML `<label>` props (`htmlFor`, etc.)

**Usage:**
```tsx
<Label htmlFor="name">Full Name</Label>
<Input id="name" placeholder="Jane Smith" />
```

---

## Select

```ts
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
```

**Exports:** `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`

**Props:**
- `SelectTrigger` — `size?: "sm" | "default"`
- `SelectContent` — `side`, `sideOffset`, `align`, `alignOffset`, `alignItemWithTrigger`

**Usage:**
```tsx
<Select defaultValue="monthly">
  <SelectTrigger>
    <SelectValue placeholder="Select plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="monthly">Monthly</SelectItem>
    <SelectItem value="annual">Annual</SelectItem>
  </SelectContent>
</Select>
```

---

## Separator

```ts
import { Separator } from "@/components/ui/separator";
```

**Exports:** `Separator`

**Props:** `orientation?: "horizontal" | "vertical"`

**Usage:**
```tsx
<Separator className="my-4" />
<Separator orientation="vertical" className="mx-2 h-6" />
```

---

## Sheet

```ts
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet";
```

**Exports:** `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`

**Props:**
- `SheetContent` — `side?: "top" | "right" | "bottom" | "left"`, `showCloseButton?: boolean`

**Usage:**
```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Details</SheetTitle>
      <SheetDescription>View item details</SheetDescription>
    </SheetHeader>
    <div className="p-4">{/* content */}</div>
  </SheetContent>
</Sheet>
```

---

## Table

```ts
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
```

**Exports:** `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`

**Props:** Standard HTML table element props.

**Usage:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Acme Corp</TableCell>
      <TableCell><Badge>Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Tabs

```ts
import { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "@/components/ui/tabs";
```

**Exports:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants`

**Props:**
- `Tabs` — `orientation?: "horizontal" | "vertical"`, `defaultValue`
- `TabsList` — `variant?: "default" | "line"`
- `TabsTrigger` — `value` (required)
- `TabsContent` — `value` (required)

**Usage:**
```tsx
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="general">General settings...</TabsContent>
  <TabsContent value="billing">Billing settings...</TabsContent>
</Tabs>
```

---

## Textarea

```ts
import { Textarea } from "@/components/ui/textarea";
```

**Exports:** `Textarea`

**Props:** Standard HTML `<textarea>` props (`placeholder`, `value`, `onChange`, `rows`, `disabled`, etc.)

**Usage:**
```tsx
<Textarea placeholder="Describe the issue..." className="min-h-[120px]" />
```
