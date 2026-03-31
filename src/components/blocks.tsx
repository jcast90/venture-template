"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Search,
  Inbox,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// BRAND GRADIENT — reusable style object
// ---------------------------------------------------------------------------
const brandGradient = {
  background:
    "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
} as const;

const brandGradientSubtle = {
  background:
    "linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 15%, transparent), color-mix(in srgb, var(--brand-accent) 15%, transparent))",
} as const;

// ---------------------------------------------------------------------------
// PageShell — wrapper for every dashboard page
// ---------------------------------------------------------------------------
function PageShell({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-4 py-8 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PageHeader — page title + description + optional right-side action
// ---------------------------------------------------------------------------
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-white/50">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GradientButton — the brand-colored button used for primary actions
// ---------------------------------------------------------------------------
interface GradientButtonProps
  extends React.ComponentProps<typeof Button> {
  icon?: LucideIcon;
}

function GradientButton({
  icon: Icon,
  children,
  className,
  ...props
}: GradientButtonProps) {
  return (
    <Button
      className={cn("text-white", className)}
      style={brandGradient}
      {...props}
    >
      {Icon && <Icon className="size-4 mr-2" />}
      {children}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// IconBox — small icon container used in stat cards, quick actions, lists
// ---------------------------------------------------------------------------
interface IconBoxProps {
  icon: LucideIcon;
  variant?: "muted" | "brand" | "success" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function IconBox({
  icon: Icon,
  variant = "muted",
  size = "md",
  className,
}: IconBoxProps) {
  const sizeMap = { sm: "size-7", md: "size-9", lg: "size-10" };
  const iconSize = { sm: "size-3.5", md: "size-4", lg: "size-5" };

  const variantMap = {
    muted: "bg-white/[0.06] text-white/40",
    brand: "text-brand-primary",
    success: "bg-emerald-500/10 text-emerald-400",
    danger: "bg-red-500/10 text-red-400",
    warning: "bg-amber-500/10 text-amber-400",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg",
        sizeMap[size],
        variantMap[variant],
        className
      )}
      style={variant === "brand" ? brandGradientSubtle : undefined}
    >
      <Icon className={iconSize[size]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatCard — a single metric card
// ---------------------------------------------------------------------------
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  changeLabel?: string;
  icon?: LucideIcon;
  highlight?: boolean;
  className?: string;
}

function StatCard({
  title,
  value,
  change,
  trend,
  changeLabel = "vs last month",
  icon: Icon,
  highlight,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-white/[0.06] bg-brand-surface-light text-white overflow-hidden",
        highlight && "relative",
        className
      )}
    >
      {highlight && (
        <div
          className="absolute inset-x-0 top-0 h-[1px]"
          style={brandGradient}
        />
      )}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="text-sm font-medium text-white/50">
          {title}
        </CardDescription>
        {Icon && <IconBox icon={Icon} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {change && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                trend === "up" ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {change}
            </span>
            <span className="text-white/40">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// StatsGrid — row of StatCards
// ---------------------------------------------------------------------------
interface StatsGridProps {
  stats: StatCardProps[];
  highlightFirst?: boolean;
  className?: string;
}

function StatsGrid({
  stats,
  highlightFirst = true,
  className,
}: StatsGridProps) {
  return (
    <div
      className={cn("mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {stats.map((stat, i) => (
        <StatCard
          key={stat.title}
          {...stat}
          highlight={highlightFirst && i === 0}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchInput — input with magnifying glass icon
// ---------------------------------------------------------------------------
interface SearchInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  containerClassName?: string;
}

function SearchInput({
  containerClassName,
  className,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
      <Input
        type="text"
        placeholder={placeholder}
        className={cn(
          "pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30",
          className
        )}
        {...props}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ThemedCard — card with default dark styling pre-applied
// ---------------------------------------------------------------------------
function ThemedCard({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "border-white/[0.06] bg-brand-surface-light text-white",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// SectionCard — titled card section (most common wrapper)
// ---------------------------------------------------------------------------
interface SectionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <ThemedCard className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-white">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-white/40">
                {description}
              </CardDescription>
            )}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </ThemedCard>
  );
}

// ---------------------------------------------------------------------------
// DataTable — themed table inside a card
// ---------------------------------------------------------------------------
interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  className?: string;
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = "id",
  className,
}: DataTableProps<T>) {
  return (
    <ThemedCard className={className}>
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06] hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "text-white/40",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center"
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={String(row[keyField])}
              className="border-white/[0.06] hover:bg-white/[0.03]"
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={cn(
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  {col.render
                    ? col.render(row)
                    : (String(row[col.key] ?? ""))}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-8 text-center text-white/40"
              >
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ThemedCard>
  );
}

// ---------------------------------------------------------------------------
// FormDialog — styled dialog for create / edit forms
// ---------------------------------------------------------------------------
interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  loading?: boolean;
}

function FormDialog({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  submitLabel = "Save",
  loading,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-brand-surface-light border-white/[0.06] text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">{children}</div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-white/70 hover:bg-white/5"
          >
            Cancel
          </Button>
          <GradientButton onClick={onSubmit} disabled={loading}>
            {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
            {submitLabel}
          </GradientButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// FormField — label + input pair with correct styling
// ---------------------------------------------------------------------------
interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-white/70">{label}</Label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ThemedInput — input with dark styling pre-applied
// ---------------------------------------------------------------------------
function ThemedInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20",
        className
      )}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// StatusBadge — pre-styled for common statuses
// ---------------------------------------------------------------------------
type StatusVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "active"
  | "inactive"
  | "pending"
  | "completed";

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  inactive: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  neutral: "border-white/20 text-white/50",
};

function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles.neutral;
  return (
    <Badge variant="outline" className={cn(style, className)}>
      {label ?? status}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// LoadingState — full-area spinner
// ---------------------------------------------------------------------------
function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center py-20", className)}>
      <Loader2 className="size-6 animate-spin text-white/40" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState — centered message with optional action
// ---------------------------------------------------------------------------
interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <IconBox icon={Icon} size="lg" className="mb-4" />
      <h3 className="text-sm font-medium text-white/70">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-white/40">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ListItem — bordered row used for team members, api keys, payment methods
// ---------------------------------------------------------------------------
interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

function ListItem({ children, className }: ListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProgressBar — usage/progress bar with gradient fill
// ---------------------------------------------------------------------------
interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  displayValue?: string;
  className?: string;
}

function ProgressBar({
  label,
  value,
  max,
  displayValue,
  className,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="text-white/80">
          {displayValue ?? `${value} / ${max}`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, ...brandGradient }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// QuickAction — icon + label row (used in quick action sidebars)
// ---------------------------------------------------------------------------
interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: "brand" | "success" | "danger" | "warning" | "muted";
  className?: string;
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
  variant = "brand",
  className,
}: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-start gap-3 border-white/[0.08] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white",
        className
      )}
      onClick={onClick}
    >
      <IconBox icon={Icon} variant={variant} size="sm" />
      {label}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export {
  // styles
  brandGradient,
  brandGradientSubtle,
  // layout
  PageShell,
  PageHeader,
  // stats
  StatCard,
  StatsGrid,
  // data
  SearchInput,
  DataTable,
  // cards
  ThemedCard,
  SectionCard,
  // forms
  FormDialog,
  FormField,
  ThemedInput,
  // feedback
  StatusBadge,
  LoadingState,
  EmptyState,
  // atoms
  GradientButton,
  IconBox,
  ListItem,
  ProgressBar,
  QuickAction,
};

// Re-export types for convenience
export type {
  StatCardProps,
  StatsGridProps,
  Column,
  DataTableProps,
  FormDialogProps,
  StatusVariant,
  EmptyStateProps,
  ProgressBarProps,
  QuickActionProps,
};
