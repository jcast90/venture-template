"use client";

import { useResolvedLanding } from "@/lib/use-landing";

type ProblemVariant = "centered" | "grid";

const painIcons = ["→", "⚡", "↗", "⬡", "◆", "▲"];

export function ProblemSection({ variant = "centered" }: { variant?: ProblemVariant }) {
  const { landing } = useResolvedLanding();
  if (!landing.painPoints?.length) return null;

  if (variant === "grid") return <ProblemGrid painPoints={landing.painPoints} />;
  return <ProblemCentered painPoints={landing.painPoints} />;
}

type ProblemProps = { painPoints: string[] };

/* ─── Editorial list, left-aligned (Warmth) ─── */
function ProblemCentered({ painPoints }: ProblemProps) {
  // Lead item is the biggest; the rest sit quieter beneath it. Hierarchy from
  // size and space, not a "The Problem" scaffolding heading.
  const [lead, ...rest] = painPoints;
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
          {lead}
        </p>
        {rest.length > 0 && (
          <div className="mt-8 max-w-2xl space-y-3">
            {rest.map((point, i) => (
              <p key={i} className="text-base leading-relaxed text-zinc-400">
                {point}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── 2-col compact list (Precision) ─── */
function ProblemGrid({ painPoints }: ProblemProps) {
  return (
    <section className="px-6 py-20 border-t border-brand-border">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
          {painPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="font-mono text-xs mt-1"
                style={{ color: "var(--brand-primary)" }}
                aria-hidden
              >
                {painIcons[i % painIcons.length]}
              </span>
              <p className="text-sm leading-relaxed text-zinc-300">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
