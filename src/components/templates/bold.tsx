"use client";

import React from "react";
import config, { isLiveMode, hasRenderableFinalCta, type VentureConfig, type LandingSectionId } from "@/lib/config";
import { useResolvedLanding } from "@/lib/use-landing";
import { NavBar } from "./shared/nav";
import { FooterBar } from "./shared/footer";
import { WaitlistForm } from "./shared/waitlist-form";
import { PricingSection } from "./shared/pricing-section";
import { LogoBar } from "./shared/logo-bar";
import { StatsSection } from "./shared/stats-section";
import { StepsSection } from "./shared/steps-section";
import { ProblemSection as SharedProblemSection } from "./shared/problem-section";
import { TestimonialsSection } from "./shared/testimonials-section";
import { FaqSection } from "./shared/faq-section";
import { ArrowUpRight } from "lucide-react";

/* Bold: high-contrast editorial. Oversized display type, thick rules,
   numbered sections, magazine-like layout with strong typographic hierarchy. */

/* Editorial "tearsheet" visual. Not a browser chrome mock: a magazine-style
   data panel that matches Bold's high-contrast, ruled-line character. Shows a
   real headline metric with context, a bar chart, and a couple of ledger rows.
   No skeletons, no gradient. */
function BoldTearsheet() {
  const bars = [40, 66, 52, 78, 61, 90, 72];
  return (
    <div className="border-[3px] border-[var(--brand-fg)] bg-[var(--brand-surface)]">
      <div className="flex items-baseline justify-between border-b-[3px] border-[var(--brand-fg)] px-5 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--brand-fg-muted)]">
          Index
        </span>
        <span className="font-mono text-[10px] text-[var(--brand-fg-muted)]">Q3 · live</span>
      </div>
      <div className="px-5 pt-5 pb-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
          Monthly active
        </div>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-4xl font-semibold leading-none tracking-tight text-[var(--brand-fg)]">
            3,481
          </span>
          <span
            className="font-mono text-sm font-bold"
            style={{ color: "var(--brand-primary)" }}
          >
            +12.4%
          </span>
        </div>
        <div className="mt-1 text-[11px] text-[var(--brand-fg-faint)]">vs 3,096 last month</div>
      </div>
      {/* Bar chart, ruled baseline */}
      <div className="flex h-24 items-end gap-2 border-t border-[var(--brand-hairline-strong)] px-5 pt-4 pb-4">
        {bars.map((h, i) => (
          <div key={i} className="flex h-full flex-1 items-end">
            <div
              className="w-full"
              style={{
                height: `${h}%`,
                background: i === bars.length - 1 ? "var(--brand-primary)" : "var(--brand-fg)",
                opacity: i === bars.length - 1 ? 1 : 0.22,
              }}
            />
          </div>
        ))}
      </div>
      {/* Ledger rows */}
      <div className="border-t-[3px] border-[var(--brand-fg)]">
        {[
          { k: "Retention", v: "94%" },
          { k: "Avg. session", v: "18m" },
          { k: "New this week", v: "+412" },
        ].map((row, i) => (
          <div
            key={row.k}
            className={`flex items-center justify-between px-5 py-2.5 ${i > 0 ? "border-t border-[var(--brand-hairline)]" : ""}`}
          >
            <span className="text-[11px] uppercase tracking-wider text-[var(--brand-fg-muted)]">
              {row.k}
            </span>
            <span className="font-mono text-sm font-bold text-[var(--brand-fg)]">{row.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoldHero() {
  const { landing } = useResolvedLanding();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-32 pb-20 border-b-[3px] border-[var(--brand-fg)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-fg-muted)] mb-8">
          <span className="px-2 py-1 bg-[var(--brand-fg)] text-[var(--brand-surface)]">Issue 01</span>
          <span>·</span>
          <span>{config.name}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <div>
            <h1 className="font-semibold leading-[0.95] tracking-tight text-[var(--brand-fg)] text-5xl sm:text-6xl">
              {landing.headline}
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-snug text-[var(--brand-fg)] max-w-xl">
              {landing.subheadline}
            </p>
            <div className="mt-9">
              {waitlistMode && !isLiveMode ? (
                <WaitlistForm className="w-full max-w-sm" />
              ) : (
                <a
                  href="/signup"
                  className="group inline-flex items-center gap-3 border-[3px] border-[var(--brand-fg)] px-8 py-4 text-base font-bold uppercase tracking-wider text-[var(--brand-fg)] transition-colors hover:bg-[var(--brand-fg)] hover:text-[var(--brand-surface)]"
                >
                  {landing.primaryCta || "Start"}
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          </div>
          {/* Editorial data visual */}
          <div className="hidden lg:block">
            <BoldTearsheet />
          </div>
        </div>
      </div>
    </section>
  );
}

function BoldFeaturesEditorial() {
  const { landing } = useResolvedLanding();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section className="px-6 py-28 border-b-[3px] border-[var(--brand-fg)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline gap-6 mb-16 border-b border-[var(--brand-hairline-strong)] pb-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-fg-muted)]">§ Capabilities</span>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--brand-fg)]">What it does</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {features.map((f, i) => (
            <article key={i} className="group">
              <div className="flex items-baseline gap-4 mb-3">
                <span
                  className="text-5xl font-semibold leading-none"
                  style={{ color: "var(--brand-primary)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-[var(--brand-surface-card)]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--brand-fg)] mb-3">{f.title}</h3>
              <p className="text-base leading-relaxed text-[var(--brand-fg-muted)]">{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BoldCta() {
  const { landing } = useResolvedLanding();
  // VOS-969: hide the section entirely when finalCta is empty/missing.
  if (!hasRenderableFinalCta(landing.finalCta)) return null;
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section
      className="px-6 py-28 border-b-[3px] border-[var(--brand-fg)]"
      style={{ background: "var(--brand-primary)" }}
    >
      <div className="mx-auto max-w-5xl text-center text-[var(--brand-primary-foreground)]">
        <h2 className="font-semibold leading-[0.95] tracking-tight text-4xl sm:text-5xl">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto">
          {landing.finalCta.subheadline}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-3 bg-[var(--brand-surface)] px-8 py-4 text-base font-bold uppercase tracking-wider text-[var(--brand-fg)] transition-colors hover:bg-[var(--brand-fg)] hover:text-[var(--brand-surface)] border-[3px] border-[var(--brand-primary-foreground)]"
          >
            {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try Free" : "Get Started")}
            <ArrowUpRight className="h-5 w-5" />
          </a>
          {landing.finalCta.secondaryButton && (
            <a
              href={landing.finalCta.secondaryHref || "#pricing"}
              className="inline-flex items-center gap-2 text-base font-bold uppercase tracking-wider text-[var(--brand-primary-foreground)] border-b-[3px] border-[var(--brand-primary-foreground)] pb-0.5 hover:opacity-70 transition-opacity"
            >
              {landing.finalCta.secondaryButton}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

const BOLD_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <BoldHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="grid" />,
  "features": () => <BoldFeaturesEditorial />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="table" />,
  "faq": () => <FaqSection />,
  "cta": () => <BoldCta />,
};

const BOLD_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "social-proof", "stats", "features", "problem", "steps", "testimonials", "pricing", "cta",
];

export default function Bold({ config: _config }: { config: VentureConfig }) {
  const { landing } = useResolvedLanding();
  const sections = landing.sections ?? BOLD_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-fg)]">
      <NavBar variant="precision" />
      {sections.map((id) => {
        const render = BOLD_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Bold] Unknown section "${id}". Valid: ${Object.keys(BOLD_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
