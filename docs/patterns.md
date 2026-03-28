# Page Patterns

Copy-pasteable page templates for common dashboard pages. All imports are verified against the actual component files in `src/components/ui/`.

---

## 1. CRUD Page

A full data management page with stats row, search, data table, create/edit/delete dialogs, empty state, and loading state.

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Loader2,
  FileText,
} from "lucide-react";
import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db";

// --- Types ---
interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
}

// --- Sample data (fallback when Supabase is empty) ---
const sampleContacts: Contact[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@acme.com", company: "Acme Corp", status: "active", created_at: "2026-01-15" },
  { id: "2", name: "Mike Johnson", email: "mike@globex.com", company: "Globex Inc", status: "active", created_at: "2026-01-20" },
  { id: "3", name: "Emily Davis", email: "emily@initech.com", company: "Initech", status: "pending", created_at: "2026-02-01" },
  { id: "4", name: "James Wilson", email: "james@hooli.com", company: "Hooli", status: "inactive", created_at: "2026-02-10" },
  { id: "5", name: "Lisa Park", email: "lisa@piedpiper.com", company: "Pied Piper", status: "active", created_at: "2026-03-05" },
];

// --- Status badge helper ---
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    inactive: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return <Badge className={styles[status] || styles.inactive}>{status}</Badge>;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Contact | null>(null);
  const [deleteItem, setDeleteItem] = useState<Contact | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCompany, setFormCompany] = useState("");

  // --- Fetch data ---
  useEffect(() => {
    async function load() {
      try {
        const rows = await getRows<Contact>("contacts", { orderBy: "created_at" });
        setContacts(rows.length > 0 ? rows : sampleContacts);
      } catch {
        setContacts(sampleContacts);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --- Stats ---
  const stats = [
    { title: "Total Contacts", value: contacts.length, icon: Users },
    { title: "Active", value: contacts.filter((c) => c.status === "active").length, icon: CheckCircle },
    { title: "Pending", value: contacts.filter((c) => c.status === "pending").length, icon: Clock },
    { title: "Inactive", value: contacts.filter((c) => c.status === "inactive").length, icon: AlertCircle },
  ];

  // --- Filtered data ---
  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  // --- Create ---
  async function handleCreate() {
    const newContact = await insertRow<Contact>("contacts", {
      name: formName,
      email: formEmail,
      company: formCompany,
      status: "pending",
    });
    if (newContact) setContacts((prev) => [newContact, ...prev]);
    setFormName("");
    setFormEmail("");
    setFormCompany("");
    setCreateOpen(false);
  }

  // --- Edit ---
  function openEdit(contact: Contact) {
    setEditItem(contact);
    setFormName(contact.name);
    setFormEmail(contact.email);
    setFormCompany(contact.company);
  }

  async function handleEdit() {
    if (!editItem) return;
    const updated = await updateRow<Contact>("contacts", editItem.id, {
      name: formName,
      email: formEmail,
      company: formCompany,
    });
    if (updated) {
      setContacts((prev) => prev.map((c) => (c.id === editItem.id ? updated : c)));
    }
    setEditItem(null);
    setFormName("");
    setFormEmail("");
    setFormCompany("");
  }

  // --- Delete ---
  async function handleDelete() {
    if (!deleteItem) return;
    const ok = await deleteRow("contacts", deleteItem.id);
    if (ok) setContacts((prev) => prev.filter((c) => c.id !== deleteItem.id));
    setDeleteItem(null);
  }

  return (
    <div className="px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Contacts</h1>
          <p className="mt-1 text-sm text-white/50">Manage your contacts and leads.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            render={
              <Button
                className="gap-2 text-white"
                style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
              >
                <Plus className="size-4" />
                Add Contact
              </Button>
            }
          />
          <DialogContent className="bg-brand-surface-light border-white/[0.06] text-white">
            <DialogHeader>
              <DialogTitle>Add Contact</DialogTitle>
              <DialogDescription className="text-white/40">
                Create a new contact record.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/70">Name</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Full name"
                  className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Email</Label>
                <Input
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Company</Label>
                <Input
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="Company name"
                  className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" className="border-white/[0.08] text-white/60 hover:bg-white/10">Cancel</Button>} />
              <Button
                onClick={handleCreate}
                className="text-white"
                style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-white/[0.06] bg-brand-surface-light text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium text-white/50">{stat.title}</CardDescription>
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/[0.06]">
                  <Icon className="size-4 text-white/40" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search + Table */}
      <Card className="border-white/[0.06] bg-brand-surface-light text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-white">All Contacts</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-white/30" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            /* Loading state */
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-white/40" />
            </div>
          ) : filtered.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white/[0.06]">
                <FileText className="size-5 text-white/30" />
              </div>
              <p className="text-sm font-medium text-white/60">No contacts found</p>
              <p className="mt-1 text-xs text-white/40">
                {search ? "Try a different search term." : "Add your first contact to get started."}
              </p>
            </div>
          ) : (
            /* Data table */
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-white/40">Name</TableHead>
                  <TableHead className="text-white/40">Email</TableHead>
                  <TableHead className="text-white/40">Company</TableHead>
                  <TableHead className="text-white/40">Status</TableHead>
                  <TableHead className="text-right text-white/40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((contact) => (
                  <TableRow key={contact.id} className="border-white/[0.06] hover:bg-white/[0.03]">
                    <TableCell className="font-medium text-white/80">{contact.name}</TableCell>
                    <TableCell className="text-white/60">{contact.email}</TableCell>
                    <TableCell className="text-white/50">{contact.company}</TableCell>
                    <TableCell>
                      <StatusBadge status={contact.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon-sm" className="text-white/40 hover:text-white hover:bg-white/10">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => openEdit(contact)}>
                            <Pencil className="size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => setDeleteItem(contact)}>
                            <Trash2 className="size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="bg-brand-surface-light border-white/[0.06] text-white">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription className="text-white/40">Update contact details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Email</Label>
              <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Company</Label>
              <Input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-white" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="border-white/[0.08] text-white/60 hover:bg-white/10">Cancel</Button>} />
            <Button onClick={handleEdit} className="text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent className="bg-brand-surface-light border-white/[0.06] text-white">
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription className="text-white/40">
              Are you sure you want to delete {deleteItem?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="border-white/[0.08] text-white/60 hover:bg-white/10">Cancel</Button>} />
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 2. Settings Page

Tabbed settings with form sections, using line-style tabs.

```tsx
"use client";

import { useState } from "react";
import config from "@/lib/config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  CreditCard,
  Users,
  Key,
  Plus,
  Check,
  Eye,
  EyeOff,
  Copy,
  Trash2,
} from "lucide-react";

const teamMembers = [
  { name: "John Doe", email: "john@example.com", role: "Owner" },
  { name: "Sarah Chen", email: "sarah@example.com", role: "Admin" },
  { name: "Mike Johnson", email: "mike@example.com", role: "Member" },
];

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const placeholderKey = "vk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";

  const handleCopy = () => {
    navigator.clipboard.writeText(placeholderKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/50">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList
          variant="line"
          className="mb-8 w-full justify-start border-b border-white/[0.06] bg-transparent pb-0"
        >
          <TabsTrigger value="general" className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary">
            <Shield className="size-4" /> General
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary">
            <CreditCard className="size-4" /> Billing
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary">
            <Users className="size-4" /> Team
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="gap-2 text-white/50 data-active:text-white data-active:after:bg-brand-primary">
            <Key className="size-4" /> API Keys
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card className="border-white/[0.06] bg-brand-surface-light">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">General Settings</CardTitle>
              <CardDescription className="text-sm text-white/40">Update your product details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white/70">Product Name</Label>
                  <Input defaultValue={config.name} className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Email Address</Label>
                  <Input type="email" defaultValue="admin@example.com" className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20" />
                </div>
              </div>
              <Separator className="bg-white/[0.06]" />
              <div className="flex justify-end">
                <Button className="text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card className="border-white/[0.06] bg-brand-surface-light">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">Current Plan</CardTitle>
                  <CardDescription className="text-sm text-white/40">You are on the Pro plan.</CardDescription>
                </div>
                <Badge className="border-0 text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                  Pro
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">$29</span>
                <span className="text-sm text-white/40">/month</span>
              </div>
              <div className="grid gap-2 text-sm text-white/60">
                <div className="flex items-center gap-2"><Check className="size-4 text-emerald-400" />Unlimited projects</div>
                <div className="flex items-center gap-2"><Check className="size-4 text-emerald-400" />Advanced analytics</div>
                <div className="flex items-center gap-2"><Check className="size-4 text-emerald-400" />Priority support</div>
              </div>
              <Separator className="bg-white/[0.06]" />
              <div className="flex gap-3">
                <Button className="text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                  Upgrade to Enterprise
                </Button>
                <Button variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <div className="space-y-6">
            <Card className="border-white/[0.06] bg-brand-surface-light">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">Invite Members</CardTitle>
                <CardDescription className="text-sm text-white/40">Add new members by email.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input type="email" placeholder="colleague@example.com" className="flex-1 border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30" />
                  <Button className="gap-2 text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                    <Plus className="size-4" /> Invite
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/[0.06] bg-brand-surface-light">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.email} className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full" style={{ background: "linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 20%, transparent), color-mix(in srgb, var(--brand-accent) 20%, transparent))" }}>
                          <span className="text-sm font-semibold text-white/70">{member.name.split(" ").map((n) => n[0]).join("")}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/80">{member.name}</p>
                          <p className="text-xs text-white/40">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={member.role === "Owner" ? "border-brand-primary/30 text-brand-primary" : "border-white/20 text-white/50"}>
                          {member.role}
                        </Badge>
                        {member.role !== "Owner" && (
                          <Button variant="ghost" size="icon-sm" className="text-white/30 hover:text-red-400 hover:bg-red-500/10">
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys">
          <Card className="border-white/[0.06] bg-brand-surface-light">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">API Keys</CardTitle>
                  <CardDescription className="text-sm text-white/40">Manage programmatic access.</CardDescription>
                </div>
                <Button className="gap-2 text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
                  <Plus className="size-4" /> Create Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">Production Key</p>
                    <p className="text-xs text-white/40">Created Jan 15, 2026</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 rounded-md border border-white/[0.08] bg-brand-surface px-3 py-2 font-mono text-sm text-white/70">
                    {showApiKey ? placeholderKey : "vk_live_" + "\u2022".repeat(32)}
                  </div>
                  <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/10" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/10" onClick={handleCopy}>
                    {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 3. Stats Dashboard

Metric cards grid with an activity table and quick actions sidebar.

```tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Send,
} from "lucide-react";

// --- Stats data ---
const stats = [
  { title: "Total Users", value: "2,847", change: "+12.5%", trend: "up" as const, icon: Users, description: "vs last month" },
  { title: "Active Projects", value: "184", change: "+8.2%", trend: "up" as const, icon: FolderOpen, description: "vs last month" },
  { title: "Revenue", value: "$48,295", change: "+23.1%", trend: "up" as const, icon: DollarSign, description: "vs last month" },
  { title: "Growth", value: "14.8%", change: "-2.4%", trend: "down" as const, icon: TrendingUp, description: "vs last month" },
];

// --- Activity data ---
const recentActivity = [
  { user: "Sarah Chen", action: "Created new project", target: "Marketing Dashboard", time: "2 min ago", status: "completed" },
  { user: "Mike Johnson", action: "Updated settings", target: "API Configuration", time: "15 min ago", status: "completed" },
  { user: "Emily Davis", action: "Invited team member", target: "alex@example.com", time: "1 hour ago", status: "pending" },
  { user: "James Wilson", action: "Deployed update", target: "v2.4.1", time: "3 hours ago", status: "completed" },
  { user: "Lisa Park", action: "Generated report", target: "Q4 Analytics", time: "5 hours ago", status: "completed" },
];

export default function DashboardPage() {
  return (
    <div className="px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-white/50">Here&apos;s an overview of your account activity and metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`border-white/[0.06] bg-brand-surface-light text-white overflow-hidden ${index === 0 ? "relative" : ""}`}
            >
              {index === 0 && (
                <div className="absolute inset-x-0 top-0 h-[1px]" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }} />
              )}
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium text-white/50">{stat.title}</CardDescription>
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/[0.06]">
                  <Icon className="size-4 text-white/40" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <span className={`inline-flex items-center gap-0.5 font-medium ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                    {stat.change}
                  </span>
                  <span className="text-white/40">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Table */}
        <Card className="border-white/[0.06] bg-brand-surface-light text-white lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-white">Recent Activity</CardTitle>
                <CardDescription className="text-sm text-white/40">Latest actions across your workspace</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-white/40">User</TableHead>
                  <TableHead className="text-white/40">Action</TableHead>
                  <TableHead className="text-white/40">Target</TableHead>
                  <TableHead className="text-right text-white/40">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity, i) => (
                  <TableRow key={i} className="border-white/[0.06] hover:bg-white/[0.03]">
                    <TableCell className="font-medium text-white/80">{activity.user}</TableCell>
                    <TableCell className="text-white/60">{activity.action}</TableCell>
                    <TableCell className="text-white/50">{activity.target}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-white/40">{activity.time}</span>
                        <Badge
                          variant={activity.status === "completed" ? "secondary" : "outline"}
                          className={activity.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-white/[0.06] bg-brand-surface-light text-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">Quick Actions</CardTitle>
            <CardDescription className="text-sm text-white/40">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className="w-full justify-start gap-3 border-white/[0.08] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white">
              <div className="flex size-8 items-center justify-center rounded-md" style={{ background: "linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 15%, transparent), color-mix(in srgb, var(--brand-accent) 15%, transparent))" }}>
                <Plus className="size-4 text-brand-primary" />
              </div>
              Create New Project
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 border-white/[0.08] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white">
              <div className="flex size-8 items-center justify-center rounded-md" style={{ background: "linear-gradient(to bottom right, color-mix(in srgb, var(--brand-accent) 15%, transparent), color-mix(in srgb, var(--brand-primary) 15%, transparent))" }}>
                <Send className="size-4 text-brand-accent" />
              </div>
              Invite Team Members
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 border-white/[0.08] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white">
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10">
                <Download className="size-4 text-emerald-400" />
              </div>
              Export Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```
