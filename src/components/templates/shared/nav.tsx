"use client";

import config, { brand, isLiveMode } from "@/lib/config";
import { useResolvedLanding } from "@/lib/use-landing";

type NavVariant = "default" | "precision" | "momentum";

export function NavBar({ variant = "default" }: { variant?: NavVariant }) {
  const { landing } = useResolvedLanding();
  const waitlistMode = config.flags?.waitlistMode ?? true;
  const href = waitlistMode && !isLiveMode ? "#waitlist" : "/signup";

  const variantStyles: Record<NavVariant, { nav: string; logo: string; btn: string }> = {
    default: {
      nav: "border-b border-brand-border bg-brand-surface/80 backdrop-blur-xl",
      logo: "rounded-lg",
      btn: "rounded-full px-5 py-2",
    },
    precision: {
      nav: "border-b border-brand-border bg-brand-surface/90 backdrop-blur-md",
      logo: "rounded-sm",
      btn: "rounded-sm px-5 py-2 text-xs uppercase tracking-wider",
    },
    momentum: {
      nav: "border-b border-brand-border bg-brand-surface/60 backdrop-blur-2xl",
      logo: "rounded-lg",
      btn: "rounded-full px-6 py-2.5",
    },
  };

  const s = variantStyles[variant];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${s.nav}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          {brand.logoUrl ? (
            // VOS-BRAND-LOGO-GEN: generated logomark, falls back to a wordmark.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoUrl}
              alt={`${config.name} logo`}
              className={`h-8 w-8 ${s.logo} object-contain`}
            />
          ) : (
            // Flat monogram tile. No gradient fill.
            <div
              className={`h-8 w-8 ${s.logo} flex items-center justify-center text-sm font-semibold font-display`}
              style={{
                background: "var(--brand-primary)",
                color: "var(--brand-primary-foreground)",
              }}
            >
              {(config.name || "V").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-base font-semibold tracking-tight font-display">
            {config.name}
          </span>
        </div>
        <a
          href={href}
          className={`${s.btn} text-sm font-medium transition-colors duration-200 ease-out hover:opacity-90`}
          style={{
            background: "var(--brand-primary)",
            color: "var(--brand-primary-foreground)",
          }}
        >
          {landing.navCta ||
            landing.primaryCta ||
            (isLiveMode ? "Try it free" : "Get early access")}
        </a>
      </div>
    </nav>
  );
}
