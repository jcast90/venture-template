"use client";

import Image from "next/image";
import { Check } from "lucide-react";

/**
 * FeatureVisual — a small library of DISTINCT, lightweight product visuals for
 * feature rows. The point is variety and rhythm (like linear.app / mercury.com,
 * which give every feature its own visual and never repeat one identical mock
 * three times), NOT another copy of the big analytics dashboard.
 *
 * Each `kind` is a different UI fragment silhouette. `FeatureVisual` picks one
 * by feature index so a features list reads as three (or more) different
 * things, not the same block stamped repeatedly.
 *
 * On-brand per the design bible: neutral surfaces, ONE saturated accent
 * (`--brand-primary`) used for meaning only, a single hairline, no gradients,
 * no em dashes. If a real screenshot is supplied for the row, that always wins.
 */

const SURFACE = "var(--brand-surface-light, #141416)";
const PANEL = "rgba(255,255,255,0.02)";
const HAIRLINE = "rgba(255,255,255,0.07)";
const ACCENT = "var(--brand-primary)";
const ACCENT_TINT = "color-mix(in srgb, var(--brand-primary) 16%, transparent)";

type VisualKind = "metric" | "checklist" | "compare" | "timeline";

// Rotation of distinct silhouettes. Index into this by feature ordinal so
// adjacent rows never share a shape. Order chosen so the first row (usually the
// headline feature) leads with the punchy single-metric tile.
const KIND_ROTATION: VisualKind[] = ["metric", "checklist", "compare", "timeline"];

function Frame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border text-left"
      style={{ borderColor: HAIRLINE, background: SURFACE }}
    >
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{ borderColor: HAIRLINE }}
      >
        <span className="text-[10px] font-medium uppercase tracking-wider text-white/45">
          {label}
        </span>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: ACCENT }}
        />
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

/* ── metric: one big number with a small trend spark. Anchors a feature about
   results, speed, or scale. Distinct from the analytics dashboard: a single
   focus number, not a grid of three KPIs. ── */
function MetricVisual({ title }: { title: string }) {
  const bars = [38, 52, 45, 66, 58, 79, 71, 90];
  return (
    <Frame label={title}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-white/40">
            This month
          </div>
          <div className="mt-1 text-3xl font-semibold leading-none text-white">
            +47%
          </div>
          <div
            className="mt-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-medium"
            style={{ background: ACCENT_TINT, color: ACCENT }}
          >
            Trending up
          </div>
        </div>
        <div className="flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-[2px]"
              style={{
                height: `${h}%`,
                background: ACCENT,
                opacity: i === bars.length - 1 ? 1 : 0.28,
              }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ── checklist: a short run of completed items. Anchors a feature about
   coverage, automation, or "handles everything for you." ── */
function ChecklistVisual({ title }: { title: string }) {
  const rows = [
    { label: "Connected data source", done: true },
    { label: "Rules applied automatically", done: true },
    { label: "Report generated", done: true },
    { label: "Team notified", done: false },
  ];
  return (
    <Frame label={title}>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2.5">
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
              style={{
                background: r.done ? ACCENT : "rgba(255,255,255,0.05)",
                border: r.done ? "none" : `1px solid ${HAIRLINE}`,
              }}
            >
              {r.done && (
                <Check
                  className="h-2.5 w-2.5"
                  style={{ color: "var(--brand-primary-foreground, #fff)" }}
                  strokeWidth={3}
                />
              )}
            </span>
            <span
              className={`text-[11px] ${r.done ? "text-white/80" : "text-white/35"}`}
            >
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ── compare: before/after split. Anchors a feature about improvement,
   savings, or replacing an old workflow. ── */
function CompareVisual({ title }: { title: string }) {
  return (
    <Frame label={title}>
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg p-3"
          style={{ background: PANEL, border: `1px solid ${HAIRLINE}` }}
        >
          <div className="text-[8.5px] uppercase tracking-wider text-white/35">
            Before
          </div>
          <div className="mt-2 text-lg font-semibold leading-none text-white/50">
            6 hrs
          </div>
          <div className="mt-2 space-y-1">
            <span className="block h-1 w-full rounded bg-white/10" />
            <span className="block h-1 w-4/5 rounded bg-white/10" />
            <span className="block h-1 w-3/5 rounded bg-white/10" />
          </div>
        </div>
        <div
          className="rounded-lg p-3"
          style={{
            background: ACCENT_TINT,
            border: "1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)",
          }}
        >
          <div className="text-[8.5px] uppercase tracking-wider" style={{ color: ACCENT }}>
            After
          </div>
          <div className="mt-2 text-lg font-semibold leading-none text-white">
            8 min
          </div>
          <div className="mt-2 space-y-1">
            <span className="block h-1 w-full rounded" style={{ background: ACCENT }} />
            <span className="block h-1 w-1/3 rounded" style={{ background: ACCENT, opacity: 0.5 }} />
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ── timeline: a compact vertical flow of stages. Anchors a feature about
   process, orchestration, or "from A to shipped." ── */
function TimelineVisual({ title }: { title: string }) {
  const stages = [
    { label: "Request received", active: false },
    { label: "Processing", active: true },
    { label: "Ready to review", active: false },
  ];
  return (
    <Frame label={title}>
      <div className="relative pl-1">
        <span
          className="absolute left-[6px] top-2 bottom-2 w-px"
          style={{ background: HAIRLINE }}
        />
        <div className="space-y-4">
          {stages.map((s) => (
            <div key={s.label} className="relative flex items-center gap-3">
              <span
                className="z-10 h-[13px] w-[13px] shrink-0 rounded-full"
                style={{
                  background: s.active ? ACCENT : SURFACE,
                  border: `2px solid ${s.active ? ACCENT : HAIRLINE}`,
                  boxShadow: s.active
                    ? "0 0 0 3px color-mix(in srgb, var(--brand-primary) 20%, transparent)"
                    : "none",
                }}
              />
              <span
                className={`text-[11px] ${s.active ? "font-medium text-white/90" : "text-white/45"}`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

export function FeatureVisual({
  index,
  title,
  imageUrl,
  className,
}: {
  index: number;
  title: string;
  imageUrl?: string | null;
  className?: string;
}) {
  // A real screenshot always wins over a synthesized fragment.
  if (imageUrl) {
    return (
      <div
        className={`overflow-hidden rounded-xl border shadow-2xl ${className || ""}`}
        style={{ borderColor: HAIRLINE }}
      >
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 512px"
          />
        </div>
      </div>
    );
  }

  const kind = KIND_ROTATION[index % KIND_ROTATION.length];
  const inner =
    kind === "metric" ? (
      <MetricVisual title={title} />
    ) : kind === "checklist" ? (
      <ChecklistVisual title={title} />
    ) : kind === "compare" ? (
      <CompareVisual title={title} />
    ) : (
      <TimelineVisual title={title} />
    );

  return <div className={className}>{inner}</div>;
}
