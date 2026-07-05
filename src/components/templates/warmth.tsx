"use client";

import React, { useEffect, useRef } from "react";
import config, { isLiveMode, hasRenderableFinalCta, type VentureConfig, type LandingSectionId } from "@/lib/config";
import { useResolvedLanding } from "@/lib/use-landing";
import { NavBar } from "./shared/nav";
import { FooterBar } from "./shared/footer";
import { WaitlistForm, LiveCtaButtons } from "./shared/waitlist-form";
import { PricingSection } from "./shared/pricing-section";
import { LogoBar } from "./shared/logo-bar";
import { StatsSection as SharedStatsSection } from "./shared/stats-section";
import { StepsSection as SharedStepsSection } from "./shared/steps-section";
import { ProblemSection as SharedProblemSection } from "./shared/problem-section";
import { TestimonialsSection as SharedTestimonialsSection } from "./shared/testimonials-section";
import { FaqSection as SharedFaqSection } from "./shared/faq-section";
import { ProductFrame } from "./shared/product-frame";
import { FeatureVisual } from "./shared/feature-visual";
import { BrandIconBox } from "./shared/gradient-text";
import {
  ArrowRight,
  Target,
  Layers,
  Sparkles,
  AlertCircle,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";

const ICON_MAP: Record<string, typeof Zap> = {
  Zap,
  Target,
  Layers,
  Sparkles,
  AlertCircle,
  Shield,
  TrendingUp,
};

function getIcon(name?: string) {
  return (name && ICON_MAP[name]) || Zap;
}

/* ─── Intersection Observer fade-up ─── */
function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: make visible after 2s if IntersectionObserver doesn't fire
    const fallbackTimer = setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 2000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallbackTimer);
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Hero (asymmetric: left copy, right product) ─── */
function WarmthHero() {
  const { landing } = useResolvedLanding();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-40 pb-24 overflow-x-clip">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy side */}
        <div className="min-w-0 max-w-xl">
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            {landing.headline}
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--brand-fg-muted)]">
            {landing.subheadline}
          </p>

          {waitlistMode && !isLiveMode ? (
            <WaitlistForm className="mt-9 max-w-md" />
          ) : (
            <div className="mt-9">
              <LiveCtaButtons />
            </div>
          )}
        </div>

        {/* Product side, bleeding slightly past its column on wide screens only */}
        <FadeIn className="relative min-w-0 lg:-mr-10" delay={200}>
          <ProductFrame
            imageUrl={landing.heroImage}
            alt={`${config.name} product interface`}
            variant="board"
            className="shadow-[0_24px_70px_-20px_rgba(0,0,0,0.55)]"
          />
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Alternating features ─── */
function FeaturesSection() {
  const { landing } = useResolvedLanding();
  const features = landing.features;
  if (!features?.length) return null;

  return (
    <section className="px-6 py-28 border-t border-brand-border">
      <div className="mx-auto max-w-5xl">
        <FadeIn className="mb-20 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything you need
          </h2>
        </FadeIn>

        <div className="space-y-24">
          {features.map((feature, i) => {
            const Icon = getIcon(feature.icon);
            const isReversed = i % 2 === 1;
            const featureImage = landing.featureImages?.[i] || null;

            return (
              <FadeIn
                key={i}
                delay={i * 100}
                className={`flex flex-col gap-12 items-center ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              >
                {/* Text side */}
                <div className="flex-1 lg:max-w-md">
                  <BrandIconBox size="lg">
                    <Icon className="h-7 w-7" style={{ color: "var(--brand-primary)" }} />
                  </BrandIconBox>
                  <h3 className="mt-6 text-2xl font-semibold font-display">{feature.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-[var(--brand-fg-muted)]">
                    {feature.description}
                  </p>
                </div>

                {/* Visual side — a DISTINCT lightweight visual per feature
                   (varies by index), not the same product mock repeated. A
                   real screenshot, when supplied, still wins. */}
                <div className="flex-1 w-full max-w-lg">
                  <FeatureVisual
                    index={i}
                    title={feature.title}
                    imageUrl={featureImage}
                    className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)]"
                  />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */
function FinalCtaSection() {
  const { landing } = useResolvedLanding();
  // VOS-969: hide the section entirely when finalCta is empty/missing.
  if (!hasRenderableFinalCta(landing.finalCta)) return null;
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-32 border-t border-brand-border">
      <FadeIn className="mx-auto max-w-3xl">
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-5 max-w-xl text-lg text-[var(--brand-fg-muted)]">
          {landing.finalCta.subheadline}
        </p>

        <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-opacity duration-200 ease-out hover:opacity-90"
            style={{
              background: "var(--brand-primary)",
              color: "var(--brand-primary-foreground)",
            }}
          >
            {landing.finalCtaButton ||
              landing.primaryCta ||
              (isLiveMode ? "Try it free" : "Join the waitlist")}
            <ArrowRight className="h-5 w-5" />
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
      </FadeIn>
    </section>
  );
}

/* ─── Section registry ─── */
const WARMTH_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <WarmthHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <SharedStatsSection variant="centered" />,
  "problem": () => <SharedProblemSection variant="centered" />,
  "features": () => <FeaturesSection />,
  "steps": () => <SharedStepsSection variant="vertical" />,
  "testimonials": () => <SharedTestimonialsSection />,
  "pricing": () => <PricingSection variant="cards" />,
  "faq": () => <SharedFaqSection />,
  "cta": () => <FinalCtaSection />,
};

const WARMTH_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "social-proof", "stats", "problem", "features",
  "steps", "testimonials", "pricing", "faq", "cta",
];

/* ─── Main Warmth template ─── */
export default function Warmth({ config: _config }: { config: VentureConfig }) {
  const { landing } = useResolvedLanding();
  const sections = landing.sections ?? WARMTH_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-[var(--brand-fg)]">
      <NavBar variant="default" />
      {sections.map((id) => {
        const render = WARMTH_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Warmth] Unknown section "${id}" in landing.sections. Valid: ${Object.keys(WARMTH_SECTIONS).join(", ")}`);
          }
          return null;
        }
        // Render sections directly (no whileInView gate on the whole section).
        // Gating every section behind scroll-reveal is both a design-bible
        // anti-pattern (do not fade-in everything) and the fragile pattern
        // that left content invisible in QA. Motion is reserved for smaller,
        // self-healing moments inside sections (e.g. the hero product frame).
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
