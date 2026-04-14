"use client";

import React from "react";
import config, { isLiveMode, resolveLandingConfig, type VentureConfig, type LandingSectionId } from "@/lib/config";
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
import { ArrowRight, TrendingUp, Activity, BarChart3, Circle, Table2, LineChart, LayoutGrid, FileText } from "lucide-react";

/* Dashboard: product-led landing. The hero IS the product — a mocked
   dashboard UI front-and-center showing live-looking metrics, panels,
   and interactive-feeling chrome. */

function MockDashboardPreview() {
  return (
    <div className="rounded-xl border border-brand-border bg-brand-surface-card overflow-hidden shadow-2xl">
      {/* App chrome */}
      <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <span className="text-xs text-zinc-500 font-medium">{config.name} · Overview</span>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Circle className="h-2 w-2 fill-green-400 text-green-400" />
          Live
        </div>
      </div>
      {/* Body: sidebar + content */}
      <div className="grid grid-cols-[160px_1fr] min-h-[320px]">
        <aside className="border-r border-brand-border bg-brand-surface p-3 space-y-1 hidden sm:block">
          {["Overview", "Projects", "Activity", "Reports", "Settings"].map((item, i) => (
            <div
              key={item}
              className={`rounded-md px-3 py-2 text-xs font-medium ${i === 0 ? "text-white" : "text-zinc-500"}`}
              style={i === 0 ? { background: "color-mix(in srgb, var(--brand-primary) 15%, transparent)" } : {}}
            >
              {item}
            </div>
          ))}
        </aside>
        <main className="p-5 space-y-4">
          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Active", value: "1,284", delta: "+12.4%", icon: Activity },
              { label: "Revenue", value: "$48.2K", delta: "+8.1%", icon: TrendingUp },
              { label: "Conversion", value: "3.8%", delta: "+0.4%", icon: BarChart3 },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-brand-border bg-brand-surface p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{kpi.label}</span>
                  <kpi.icon className="h-3 w-3 text-zinc-500" />
                </div>
                <div className="mt-1.5 text-lg font-semibold text-white">{kpi.value}</div>
                <div className="text-[10px] font-medium" style={{ color: "var(--brand-primary)" }}>{kpi.delta}</div>
              </div>
            ))}
          </div>
          {/* Chart placeholder */}
          <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white">Weekly activity</span>
              <span className="text-[10px] text-zinc-500">Last 7 days</span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {[35, 58, 42, 72, 65, 88, 76].map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, var(--brand-primary), var(--brand-accent))`,
                  opacity: 0.4 + (i / 10),
                }} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-28 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface-card px-3 py-1 text-xs font-medium text-zinc-300"
          >
            <Circle className="h-2 w-2 fill-green-400 text-green-400" />
            Now in beta
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {landing.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            {landing.subheadline}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            {waitlistMode && !isLiveMode ? (
              <WaitlistForm className="w-full max-w-md" />
            ) : (
              <>
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
                  style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
                >
                  {landing.primaryCta || "Start free trial"}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-md border border-brand-border bg-brand-surface-card px-6 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:border-brand-border-hover transition-colors"
                >
                  See it in action
                </a>
              </>
            )}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 relative">
          <div
            className="pointer-events-none absolute -inset-x-8 -top-8 -bottom-8 blur-3xl opacity-30"
            style={{ background: "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))" }}
          />
          <div className="relative">
            <MockDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Mini panel types: each feature gets a distinct CSS-drawn widget */
const PANEL_ICONS = [Table2, LineChart, LayoutGrid, FileText];

function MiniPanel({ index, title }: { index: number; title: string }) {
  const Icon = PANEL_ICONS[index % PANEL_ICONS.length];

  // Alternate between a table-style and chart-style panel
  const isChart = index % 2 === 1;

  return (
    <div className="overflow-hidden rounded-xl border border-brand-border bg-brand-surface shadow-xl">
      {/* Chrome */}
      <div className="flex items-center justify-between border-b border-brand-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/60" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
          <span className="h-2 w-2 rounded-full bg-green-400/60" />
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500">
          <Icon className="h-3 w-3" />
          {title}
        </span>
        <div className="w-12" />
      </div>

      {/* Panel content */}
      <div className="p-4 space-y-2">
        {isChart ? (
          <>
            <div className="flex items-end gap-1.5 h-16 mb-3">
              {[42, 68, 55, 80, 72, 90, 78].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, var(--brand-primary), var(--brand-accent))`,
                    opacity: 0.35 + i * 0.09,
                  }}
                />
              ))}
            </div>
            {[0, 1].map((row) => (
              <div key={row} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full" style={{ background: "var(--brand-primary)", opacity: 0.6 }} />
                <div className="h-2 flex-1 rounded-full bg-white/[0.06]" />
                <div className="h-2 w-10 rounded-full bg-white/[0.06]" />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2 mb-2 border-b border-brand-border pb-2">
              {["Name", "Status", "Date", "Value"].map((col) => (
                <div key={col} className="h-2 rounded-sm bg-white/[0.08]" />
              ))}
            </div>
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-2">
                <div className="h-2 rounded-sm bg-white/[0.05]" />
                <div
                  className="h-2 rounded-full"
                  style={{
                    background: row % 3 === 0
                      ? "color-mix(in srgb, var(--brand-primary) 30%, transparent)"
                      : "var(--brand-surface-card)",
                    width: "60%",
                  }}
                />
                <div className="h-2 rounded-sm bg-white/[0.04]" />
                <div className="h-2 rounded-sm bg-white/[0.05]" />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function DashboardFeaturePanels() {
  const { landing } = resolveLandingConfig();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section id="features" className="px-6 py-24 border-t border-brand-border">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            See it in action
          </h2>
          <p className="mt-3 text-zinc-400">
            Every panel built for clarity. No noise, no guesswork.
          </p>
        </div>

        <div className="space-y-20">
          {features.map((f, i) => {
            const isReversed = i % 2 === 1;
            return (
              <div
                key={i}
                className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${isReversed ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""}`}
              >
                <div>
                  <p className="mb-3 font-mono text-xs" style={{ color: "var(--brand-primary)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">{f.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-zinc-400">{f.description}</p>
                </div>
                <MiniPanel index={i} title={f.title} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DashboardCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-2xl border border-brand-border bg-brand-surface-card p-10 sm:p-14 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">{landing.finalCta.subheadline}</p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
          >
            {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try Free" : "Get Started")}
            <ArrowRight className="h-4 w-4" />
          </a>
          {landing.finalCta.secondaryButton && (
            <a
              href={landing.finalCta.secondaryHref || "#pricing"}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {landing.finalCta.secondaryButton} →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

const DASHBOARD_SECTIONS: Partial<Record<LandingSectionId, () => React.ReactNode>> = {
  "hero": () => <DashboardHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="grid" />,
  "features": () => <DashboardFeaturePanels />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="cards" />,
  "faq": () => <FaqSection />,
  "cta": () => <DashboardCta />,
};

// Story: see the product → understand the scale → see each panel in context → price
// No steps, no FAQ — product-led tools let the UI speak for itself
const DASHBOARD_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "stats", "features", "pricing", "cta",
];

export default function Dashboard({ config: _config }: { config: VentureConfig }) {
  const { landing } = resolveLandingConfig();
  const sections = landing.sections ?? DASHBOARD_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="default" />
      {sections.map((id) => {
        const render = DASHBOARD_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Dashboard] Unknown section "${id}". Valid: ${Object.keys(DASHBOARD_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
