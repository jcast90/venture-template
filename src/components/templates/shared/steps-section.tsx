"use client";

import { useResolvedLanding } from "@/lib/use-landing";
import { GradientText } from "./gradient-text";

type StepsVariant = "vertical" | "horizontal" | "cards";

export function StepsSection({ variant = "vertical" }: { variant?: StepsVariant }) {
  const { landing } = useResolvedLanding();
  if (!landing.steps?.length) return null;

  if (variant === "horizontal") return <StepsHorizontal steps={landing.steps} />;
  if (variant === "cards") return <StepsCards steps={landing.steps} />;
  return <StepsVertical steps={landing.steps} />;
}

type StepsProps = { steps: { title: string; desc: string }[] };

/* ─── Vertical dotted line (Warmth) ─── */
function StepsVertical({ steps }: StepsProps) {
  return (
    <section className="px-6 py-28 border-t border-brand-border">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 max-w-xl">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            From signup to shipped in three steps
          </h2>
        </div>

        <div className="relative">
          {/* Single hairline connector. */}
          <div
            className="absolute left-6 top-2 bottom-2 w-px hidden sm:block"
            style={{ background: "var(--brand-border-color)" }}
          />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6 sm:pl-0">
                <div
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold font-display"
                  style={{
                    background: "var(--brand-primary)",
                    color: "var(--brand-primary-foreground)",
                  }}
                >
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[var(--brand-fg-muted)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Horizontal timeline (Precision) ─── */
function StepsHorizontal({ steps }: StepsProps) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight mb-12">How it works</h2>

        <div className="relative">
          <div
            className="absolute top-6 left-0 right-0 h-px hidden sm:block"
            style={{ background: "var(--brand-border-color)" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm border border-brand-border bg-brand-surface text-xs font-mono font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  0{i + 1}
                </div>
                <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                <p className="text-xs leading-relaxed text-[var(--brand-fg-faint)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Glass cards (Momentum) ─── */
function StepsCards({ steps }: StepsProps) {
  return (
    <section className="px-6 py-24 border-t border-brand-border">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold tracking-tight mb-12">
          <GradientText>How it works</GradientText>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group flex flex-col items-start rounded-2xl p-6 backdrop-blur-xl transition-all hover:bg-brand-surface-card"
              style={{
                background: "var(--brand-surface-card)",
                border: "1px solid var(--brand-border-color)",
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold font-display"
                style={{
                  background: "var(--brand-primary)",
                  color: "var(--brand-primary-foreground)",
                }}
              >
                {i + 1}
              </div>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--brand-fg-muted)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
