"use client";

import config from "@/lib/config";
import Image from "next/image";

/**
 * Browser-window mockup frame. Shows a real screenshot when imageUrl is
 * provided, otherwise renders a designed, plausible product UI in the
 * venture's brand (NOT empty skeleton bars).
 *
 * The placeholder follows dashboard-design-guidelines.md: neutral surfaces,
 * hierarchy over borders, saturated/status color only for meaning, no pie
 * charts, no gradients. Two variants keep templates visually distinct:
 *   - "analytics" (default): KPI cards + a weekly bar chart + a status list.
 *   - "board": a compact work-board with status columns and task rows.
 */
export function ProductFrame({
  imageUrl,
  alt,
  className,
  variant = "analytics",
}: {
  imageUrl?: string | null;
  alt?: string;
  className?: string;
  variant?: "analytics" | "board";
}) {
  const domain =
    config.domain || `${config.name?.toLowerCase().replace(/\s+/g, "")}.com`;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--brand-hairline)] shadow-2xl ${className || ""}`}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-[var(--brand-hairline)] bg-[var(--brand-surface-card)] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-hairline-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-hairline-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-hairline-strong)]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] text-[var(--brand-fg-faint)]">{domain}</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Content area */}
      {imageUrl ? (
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={imageUrl}
            alt={alt || `${config.name} dashboard`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>
      ) : variant === "board" ? (
        <BoardMock />
      ) : (
        <AnalyticsMock />
      )}
    </div>
  );
}

const SURFACE = "var(--brand-surface-light, #141416)";
const PANEL = "var(--brand-surface-card)";
const HAIRLINE = "var(--brand-hairline)";

/* ── Variant A: analytics overview ─────────────────────────────────────────
   Top-left holds the single most important KPI (F-pattern anchor), each
   number is anchored to a delta ("vs last month"), a weekly bar chart shows
   trend shape, and a short activity list carries real status chips. */
function AnalyticsMock() {
  const kpis = [
    { label: "Active users", value: "3,481", delta: "+12%", positive: true, lead: true },
    { label: "Revenue", value: "$48.2k", delta: "+8%", positive: true },
    { label: "Churn", value: "2.1%", delta: "-0.4%", positive: true },
  ];
  const bars = [46, 62, 51, 73, 58, 84, 69];
  const rows = [
    { name: "Acme Co", meta: "Upgraded to Pro", status: "Active", tone: "ok" as const },
    { name: "Northwind", meta: "Trial ends in 3 days", status: "Trial", tone: "warn" as const },
    { name: "Globex", meta: "Payment retried", status: "At risk", tone: "err" as const },
  ];

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden text-left"
      style={{ background: SURFACE }}
    >
      <div className="flex h-full flex-col p-4 sm:p-5">
        {/* Header row */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[var(--brand-fg)]">
            {config.name} · Overview
          </span>
          <span className="inline-flex items-center gap-1.5 text-[9px] text-[var(--brand-fg-faint)]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--brand-success, #22c55e)" }}
            />
            Live
          </span>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-2">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-lg p-2.5"
              style={{
                background: PANEL,
                border: `1px solid ${k.lead ? "color-mix(in srgb, var(--brand-primary) 30%, transparent)" : HAIRLINE}`,
              }}
            >
              <div className="text-[8px] uppercase tracking-wider text-[var(--brand-fg-faint)]">
                {k.label}
              </div>
              <div className="mt-1 text-[15px] font-semibold leading-none text-[var(--brand-fg)]">
                {k.value}
              </div>
              <div
                className="mt-1 text-[8.5px] font-medium"
                style={{
                  color: k.positive
                    ? "var(--brand-success, #22c55e)"
                    : "var(--brand-error, #ef4444)",
                }}
              >
                {k.delta} vs last month
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div
          className="mt-2.5 rounded-lg p-3"
          style={{ background: PANEL, border: `1px solid ${HAIRLINE}` }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-medium text-[var(--brand-fg-muted)]">
              Weekly activity
            </span>
            <span className="text-[8px] text-[var(--brand-fg-faint)]">Last 7 days</span>
          </div>
          <div className="flex h-[52px] items-end gap-1.5">
            {bars.map((h, i) => (
              <div key={i} className="flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-[2px]"
                  style={{
                    height: `${h}%`,
                    background: "var(--brand-primary)",
                    // The most recent bar is the meaningful one; the rest
                    // recede so the trend's endpoint reads first.
                    opacity: i === bars.length - 1 ? 1 : 0.32,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Activity list */}
        <div className="mt-2.5 flex-1 space-y-0.5 overflow-hidden">
          {rows.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-2 rounded-md px-2 py-1.5"
              style={{ background: PANEL }}
            >
              <span className="text-[9.5px] font-medium text-[var(--brand-fg)]">
                {r.name}
              </span>
              <span className="truncate text-[9px] text-[var(--brand-fg-faint)]">{r.meta}</span>
              <span className="ml-auto">
                <StatusChip label={r.status} tone={r.tone} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Variant B: work board ─────────────────────────────────────────────────
   A compact kanban-style board. Distinct silhouette from the analytics
   variant so warmth-lane heroes read differently from precision heroes. */
function BoardMock() {
  const columns = [
    {
      title: "In progress",
      count: 3,
      cards: [
        { name: "Onboard Acme", tag: "Design", tone: "brand" as const },
        { name: "Draft Q3 plan", tag: "Ops", tone: "muted" as const },
      ],
    },
    {
      title: "Review",
      count: 2,
      cards: [{ name: "Billing revamp", tag: "Eng", tone: "warn" as const }],
    },
    {
      title: "Done",
      count: 8,
      cards: [{ name: "Ship changelog", tag: "Shipped", tone: "ok" as const }],
    },
  ];

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden text-left"
      style={{ background: SURFACE }}
    >
      <div className="flex h-full flex-col p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[var(--brand-fg)]">
            {config.name} · Board
          </span>
          <span className="rounded-md px-2 py-0.5 text-[8.5px] font-medium text-[var(--brand-fg-muted)]"
            style={{ background: "color-mix(in srgb, var(--brand-primary) 16%, transparent)", color: "var(--brand-primary)" }}
          >
            This week
          </span>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-2">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col">
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="text-[9px] font-medium text-[var(--brand-fg-muted)]">
                  {col.title}
                </span>
                <span className="text-[8px] text-[var(--brand-fg-faint)]">{col.count}</span>
              </div>
              <div className="space-y-1.5">
                {col.cards.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-md p-2"
                    style={{ background: PANEL, border: `1px solid ${HAIRLINE}` }}
                  >
                    <div className="text-[9.5px] font-medium leading-tight text-[var(--brand-fg)]">
                      {c.name}
                    </div>
                    <div className="mt-1.5">
                      <Tag label={c.tag} tone={c.tone} />
                    </div>
                  </div>
                ))}
                {/* Ghost row hints at more without adding a skeleton */}
                <div
                  className="rounded-md border border-dashed py-1.5 text-center text-[8px] text-[var(--brand-fg-faint)]"
                  style={{ borderColor: HAIRLINE }}
                >
                  + Add
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Status + tag chips ────────────────────────────────────────────────────
   Status color is paired with a text label, never color alone (AA + the
   traffic-light rule from the dashboard guidelines). */
function StatusChip({
  label,
  tone,
}: {
  label: string;
  tone: "ok" | "warn" | "err";
}) {
  const color =
    tone === "ok"
      ? "var(--brand-success, #22c55e)"
      : tone === "warn"
        ? "var(--brand-warning, #eab308)"
        : "var(--brand-error, #ef4444)";
  return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[8px] font-medium text-[var(--brand-fg-muted)]"
      style={{ background: "var(--brand-hairline)" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Tag({
  label,
  tone,
}: {
  label: string;
  tone: "brand" | "muted" | "ok" | "warn";
}) {
  const styles: Record<string, { bg: string; fg: string }> = {
    brand: {
      bg: "color-mix(in srgb, var(--brand-primary) 16%, transparent)",
      fg: "var(--brand-primary)",
    },
    ok: {
      bg: "color-mix(in srgb, var(--brand-success, #22c55e) 16%, transparent)",
      fg: "var(--brand-success, #22c55e)",
    },
    warn: {
      bg: "color-mix(in srgb, var(--brand-warning, #eab308) 18%, transparent)",
      fg: "var(--brand-warning, #eab308)",
    },
    muted: { bg: "var(--brand-hairline)", fg: "var(--brand-fg-muted)" },
  };
  const s = styles[tone] || styles.muted;
  return (
    <span
      className="inline-flex rounded px-1.5 py-0.5 text-[8px] font-medium"
      style={{ background: s.bg, color: s.fg }}
    >
      {label}
    </span>
  );
}
