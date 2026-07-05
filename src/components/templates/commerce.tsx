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
import { ArrowRight, ShoppingBag, Star, Truck } from "lucide-react";

/* Commerce: e-commerce / DTC. Large lifestyle hero, collection grid,
   review stars, generous product-frame treatment. */

function CommerceHero() {
  const { landing } = useResolvedLanding();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-28 pb-20">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-[var(--brand-fg-muted)]">
            <Star className="h-3 w-3" style={{ color: "var(--brand-primary)" }} fill="currentColor" />
            New collection
          </p>
          <h1 className="mt-5 text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-[var(--brand-fg)]">
            {landing.headline}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--brand-fg-muted)]">{landing.subheadline}</p>

          <div className="mt-8">
            {waitlistMode && !isLiveMode ? (
              <WaitlistForm className="max-w-md" />
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-opacity duration-200 ease-out hover:opacity-90"
                  style={{ background: "var(--brand-primary)", color: "var(--brand-primary-foreground)" }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {landing.primaryCta || "Shop now"}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#features" className="text-sm font-medium text-[var(--brand-fg)] hover:text-[var(--brand-fg)] underline underline-offset-4">
                  Browse the collection
                </a>
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs text-[var(--brand-fg-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4" />
              Free shipping over $75
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4" style={{ color: "var(--brand-primary)" }} fill="currentColor" />
              4.9 · 2,400+ reviews
            </span>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden"
          style={{
            background: "var(--brand-surface-light)",
            border: "1px solid var(--brand-border-color)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-[7rem] opacity-[0.12]">
            <ShoppingBag className="h-28 w-28" style={{ color: "var(--brand-primary)" }} />
          </div>
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl p-4 backdrop-blur-md"
            style={{ background: "var(--brand-surface-card)", border: "1px solid var(--brand-hairline)" }}
          >
            <p className="text-xs font-medium text-[var(--brand-fg-muted)] uppercase tracking-wide">Best seller</p>
            <p className="mt-1 text-base font-semibold text-[var(--brand-fg)]">{config.name} Essentials</p>
            <div className="mt-2 flex items-center gap-1">
              {[0,1,2,3,4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 text-[var(--brand-fg)]" fill="currentColor" />
              ))}
              <span className="ml-2 text-xs text-[var(--brand-fg-muted)]">4.9 (1.2k)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommerceCollection() {
  const { landing } = useResolvedLanding();
  const features = landing.features || [];
  if (features.length === 0) return null;

  // Flat neutral product tiles. Depth from a single hairline and the emoji
  // mark, not decorative rainbow gradients.
  const tileBg = "var(--brand-surface-light)";

  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--brand-fg)]">
            Shop the collection
          </h2>
          <a href="/shop" className="text-sm font-medium text-[var(--brand-fg-muted)] hover:text-[var(--brand-fg)] inline-flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="group cursor-pointer">
              <div
                className="aspect-square w-full rounded-2xl mb-3 relative overflow-hidden transition-colors duration-200 ease-out group-hover:border-brand-border-hover"
                style={{ background: tileBg, border: "1px solid var(--brand-border-color)" }}
              >
                <div className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide backdrop-blur-md"
                  style={{ background: "var(--brand-surface-card)", color: "var(--brand-fg)" }}
                >
                  {i === 0 ? "New" : i === 1 ? "Best seller" : "Limited"}
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                  {f.icon || "◆"}
                </div>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-fg)]">{f.title}</p>
                  <p className="text-xs text-[var(--brand-fg-muted)] line-clamp-1 mt-0.5">{f.description}</p>
                </div>
                <p className="text-sm font-semibold text-[var(--brand-fg)] whitespace-nowrap">
                  ${(39 + i * 10).toFixed(0)}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-0.5">
                {[0,1,2,3,4].map((s) => (
                  <Star key={s} className="h-3 w-3" style={{ color: "var(--brand-primary)" }} fill="currentColor" />
                ))}
                <span className="ml-1.5 text-[10px] text-[var(--brand-fg-muted)]">({100 + i * 47})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommerceCta() {
  const { landing } = useResolvedLanding();
  // VOS-969: hide the section entirely when finalCta is empty/missing.
  if (!hasRenderableFinalCta(landing.finalCta)) return null;
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-28">
      <div
        className="mx-auto max-w-5xl rounded-3xl px-8 py-20 text-center"
        style={{
          background: "var(--brand-primary)",
          color: "var(--brand-primary-foreground)",
        }}
      >
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-4 max-w-2xl mx-auto" style={{ opacity: 0.9 }}>{landing.finalCta.subheadline}</p>
        <div className="mt-10">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/shop"}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary-foreground)] px-8 py-3.5 text-sm font-semibold text-[var(--brand-primary)] transition-opacity duration-200 ease-out hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            {landing.finalCtaButton || landing.primaryCta || "Shop now"}
          </a>
        </div>
      </div>
    </section>
  );
}

const COMMERCE_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <CommerceHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="centered" />,
  "features": () => <CommerceCollection />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="cards" />,
  "faq": () => <FaqSection />,
  "cta": () => <CommerceCta />,
};

const COMMERCE_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "features", "testimonials", "faq", "cta",
];

export default function Commerce({ config: _config }: { config: VentureConfig }) {
  const { landing } = useResolvedLanding();
  const sections = landing.sections ?? COMMERCE_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-[var(--brand-fg)]">
      <NavBar variant="default" />
      {sections.map((id) => {
        const render = COMMERCE_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Commerce] Unknown section "${id}". Valid: ${Object.keys(COMMERCE_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
