"use client";

import config from "@/lib/config";

const RADIUS_MAP: Record<string, string> = {
  sharp: "0.25rem",
  rounded: "0.75rem",
  pill: "9999px",
};

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const { brand } = config;
  const radius = RADIUS_MAP[brand.borderRadius ?? "rounded"] ?? RADIUS_MAP.rounded;
  const angle = brand.gradientAngle ?? 135;
  const borderOpacity = brand.borderOpacity ?? 0.06;

  return (
    <div
      style={
        {
          "--brand-primary": brand.primary,
          "--brand-primary-dark": brand.primaryDark,
          "--brand-accent": brand.accent,
          "--brand-surface": brand.surface,
          "--brand-surface-light": brand.surfaceLight,
          "--brand-surface-card": brand.surfaceCard ?? `rgba(255, 255, 255, ${borderOpacity * 0.5})`,
          "--brand-surface-input": brand.surfaceInput ?? `rgba(255, 255, 255, ${borderOpacity * 0.67})`,
          "--brand-radius": radius,
          "--brand-gradient-angle": `${angle}deg`,
          "--brand-border-opacity": borderOpacity,
          "--brand-border-color": `rgba(255, 255, 255, ${borderOpacity})`,
          "--brand-border-hover": `rgba(255, 255, 255, ${Math.min(borderOpacity * 1.8, 0.2)})`,
          "--brand-success": brand.success ?? "#22c55e",
          "--brand-warning": brand.warning ?? "#eab308",
          "--brand-error": brand.error ?? "#ef4444",
          "--brand-muted": brand.muted ?? "#6b7280",
          "--brand-info": brand.info ?? "#3b82f6",
          "--brand-primary-foreground": brand.primaryForeground ?? "#ffffff",
          "--brand-accent-foreground": brand.accentForeground ?? "#ffffff",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
