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
import { ArrowRight, Users, Store, ShieldCheck, Search } from "lucide-react";

/* Marketplace: two-sided product. Dual-CTA hero (buyers / sellers),
   category grid, supply/demand stats, trust signals. */

function MarketplaceHero() {
  const { landing } = useResolvedLanding();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-32 pb-24 overflow-hidden">
      <div className="relative mx-auto max-w-6xl text-center">
        <p className="text-sm font-medium text-[var(--brand-fg-muted)] mb-4">A marketplace for {config.name}</p>
        <h1 className="mt-2 text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-[var(--brand-fg)]">
          {landing.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--brand-fg-muted)]">
          {landing.subheadline}
        </p>

        {waitlistMode && !isLiveMode ? (
          <div className="mt-10 mx-auto max-w-md">
            <WaitlistForm />
          </div>
        ) : (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/signup?role=buyer"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-[var(--brand-fg)] shadow-lg"
              style={{ background: "var(--brand-primary)" }}
            >
              <Search className="h-4 w-4" />
              I&apos;m looking to buy
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/signup?role=seller"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-[var(--brand-fg)]"
              style={{ background: "var(--brand-hairline-strong)", border: "1px solid var(--brand-fg-faint)" }}
            >
              <Store className="h-4 w-4" />
              I&apos;m selling
            </a>
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-[var(--brand-fg-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified sellers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Trusted community
          </span>
        </div>
      </div>
    </section>
  );
}

function MarketplaceCategoryGrid() {
  const { landing } = useResolvedLanding();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--brand-fg)]">
              Browse categories
            </h2>
            <p className="mt-3 text-[var(--brand-fg-muted)]">Find what you need, or list what you offer.</p>
          </div>
          <a href="#" className="text-sm font-medium text-[var(--brand-fg-muted)] hover:text-[var(--brand-fg)] inline-flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl p-5 transition-all hover:-translate-y-1 cursor-pointer"
              style={{
                background: "var(--brand-hairline)",
                border: "1px solid var(--brand-hairline-strong)",
              }}
            >
              <div
                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-lg"
                style={{
                  background: "color-mix(in srgb, var(--brand-primary) 12%, transparent)",
                  color: "var(--brand-primary)",
                }}
              >
                {f.icon || "◆"}
              </div>
              <h3 className="text-sm font-semibold text-[var(--brand-fg)] mb-1">{f.title}</h3>
              <p className="text-xs leading-relaxed text-[var(--brand-fg-muted)] line-clamp-2">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketplaceCta() {
  const { landing } = useResolvedLanding();
  // VOS-969: hide the section entirely when finalCta is empty/missing.
  if (!hasRenderableFinalCta(landing.finalCta)) return null;
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-28">
      <div
        className="mx-auto max-w-5xl rounded-3xl px-8 py-20 text-center"
        style={{ background: "var(--brand-primary)" }}
      >
        <h2
          className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight"
          style={{ color: "var(--brand-primary-foreground)" }}
        >
          {landing.finalCta.headline}
        </h2>
        <p
          className="mt-4 max-w-2xl mx-auto"
          style={{ color: "var(--brand-primary-foreground)", opacity: 0.9 }}
        >
          {landing.finalCta.subheadline}
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup?role=buyer"}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary-foreground)] px-6 py-3 text-sm font-semibold text-[var(--brand-primary)]"
          >
            Start buying
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup?role=seller"}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-[var(--brand-fg)] border border-[var(--brand-hairline-strong)]"
          >
            List an item
          </a>
        </div>
      </div>
    </section>
  );
}

const MARKETPLACE_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <MarketplaceHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="centered" />,
  "features": () => <MarketplaceCategoryGrid />,
  "steps": () => <StepsSection variant="cards" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="cards" />,
  "faq": () => <FaqSection />,
  "cta": () => <MarketplaceCta />,
};

const MARKETPLACE_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "stats", "features", "steps", "testimonials", "pricing", "faq", "cta",
];

export default function Marketplace({ config: _config }: { config: VentureConfig }) {
  const { landing } = useResolvedLanding();
  const sections = landing.sections ?? MARKETPLACE_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-[var(--brand-fg)]">
      <NavBar variant="default" />
      {sections.map((id) => {
        const render = MARKETPLACE_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Marketplace] Unknown section "${id}". Valid: ${Object.keys(MARKETPLACE_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
