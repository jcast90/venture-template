"use client";

import React from "react";
import config, { isLiveMode, hasRenderableFinalCta, type VentureConfig, type LandingSectionId } from "@/lib/config";
import { useResolvedLanding } from "@/lib/use-landing";
import { NavBar } from "./shared/nav";
import { FooterBar } from "./shared/footer";
import { WaitlistForm, LiveCtaButtons } from "./shared/waitlist-form";
import { PricingSection } from "./shared/pricing-section";
import { LogoBar } from "./shared/logo-bar";
import { StatsSection } from "./shared/stats-section";
import { StepsSection } from "./shared/steps-section";
import { ProblemSection as SharedProblemSection } from "./shared/problem-section";
import { TestimonialsSection } from "./shared/testimonials-section";
import { FaqSection } from "./shared/faq-section";
import { ProductFrame } from "./shared/product-frame";
import { ArrowRight, Target, Layers, Sparkles } from "lucide-react";

const stepIcons = [Target, Layers, Sparkles];
const painIcons = [
  "→",
  "⚡",
  "↗",
  "⬡",
  "◆",
  "▲",
];

/* ─── Hero (split: text left, visual right) ─── */
function PrecisionHero() {
  const { landing } = useResolvedLanding();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-36 pb-24 overflow-hidden">
      {/* Flat accent hairline */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--brand-border-color)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            {landing.headline}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--brand-fg-muted)]">
            {landing.subheadline}
          </p>

          {waitlistMode && !isLiveMode ? (
            <WaitlistForm className="mt-8 max-w-sm" />
          ) : (
            <div className="mt-8 flex gap-3">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold transition-opacity duration-200 ease-out hover:opacity-90"
                style={{ background: "var(--brand-primary)", color: "var(--brand-primary-foreground)" }}
              >
                {landing.primaryCta || "Try it Free"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        {/* Product visual */}
        <div className="hidden lg:block">
          <ProductFrame
            imageUrl={landing.heroImage}
            alt={`${config.name} dashboard`}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Stats bar (horizontal, monospace) ─── */
function StatsBar() {
  const { landing } = useResolvedLanding();

  return (
    <section className="border-y border-brand-border">
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3">
        {landing.painStats.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-center gap-3 px-6 py-6 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-brand-border" : ""}`}
          >
            <span className="font-mono text-2xl font-bold text-[var(--brand-fg)]">
              {item.stat}
            </span>
            <span className="text-xs uppercase tracking-wider text-[var(--brand-fg-faint)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Timeline (horizontal 3-step) ─── */
function TimelineSection() {
  const { landing } = useResolvedLanding();

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold tracking-tight mb-12">How it works</h2>

        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute top-6 left-0 right-0 h-px hidden sm:block"
            style={{ background: "var(--brand-border-color)" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {landing.steps.map((step, i) => (
              <div key={i} className="relative">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm border border-brand-border bg-brand-surface text-xs font-mono font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  0{i + 1}
                </div>
                <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                <p className="text-xs leading-relaxed text-[var(--brand-fg-faint)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pain points (2-col compact grid) ─── */
function PainPointsGrid() {
  const { landing } = useResolvedLanding();

  return (
    <section className="px-6 py-20 border-t border-brand-border">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight mb-8">
          Problems we solve
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {landing.painPoints.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-sm border border-brand-border bg-brand-surface-card p-4 transition-colors hover:border-brand-border-hover"
            >
              <span className="font-mono text-xs text-brand-primary mt-0.5">
                {painIcons[i % painIcons.length]}
              </span>
              <p className="text-sm leading-relaxed text-[var(--brand-fg-muted)]">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA (minimal) ─── */
function MinimalCta() {
  const { landing } = useResolvedLanding();
  // VOS-969: hide the section entirely when finalCta is empty/missing.
  if (!hasRenderableFinalCta(landing.finalCta)) return null;
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-24 border-t border-brand-border">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-semibold">{landing.finalCta.headline}</h2>
          <p className="mt-2 text-sm text-[var(--brand-fg-muted)]">
            {landing.finalCta.subheadline}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold transition-opacity duration-200 ease-out hover:opacity-90"
            style={{ background: "var(--brand-primary)", color: "var(--brand-primary-foreground)" }}
          >
            {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try it Free" : "Get Started")}
            <ArrowRight className="h-4 w-4" />
          </a>
          {landing.finalCta.secondaryButton && (
            <a
              href={landing.finalCta.secondaryHref || "#pricing"}
              className="text-sm text-[var(--brand-fg-muted)] hover:text-[var(--brand-fg)] transition-colors"
            >
              {landing.finalCta.secondaryButton}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Section registry ─── */
const PRECISION_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <PrecisionHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="grid" />,
  "features": () => null,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="table" />,
  "faq": () => <FaqSection />,
  "cta": () => <MinimalCta />,
};

const PRECISION_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "stats", "steps", "problem", "pricing", "cta",
];

/* ─── Main Precision template ─── */
export default function Precision({ config: _config }: { config: VentureConfig }) {
  const { landing } = useResolvedLanding();
  const sections = landing.sections ?? PRECISION_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-[var(--brand-fg)]">
      <NavBar variant="precision" />
      {sections.map((id) => {
        const render = PRECISION_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Precision] Unknown section "${id}" in landing.sections. Valid: ${Object.keys(PRECISION_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
