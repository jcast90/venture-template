import type { CSSProperties } from "react";
import { brand as configBrand } from "@/lib/config";
import { resolveTypographyPreset, resolveDensity } from "@/lib/typography";

/**
 * brand-style — the SINGLE source of truth for the derived brand CSS custom
 * properties. Both `layout.tsx` (sets the core scheme tokens on `<html>` so the
 * body inherits them) and `brand-provider.tsx` (sets the full token set on the
 * page wrapper) consume this helper so the two can never drift.
 *
 * Scheme awareness (VOS-GEN-VARIETY-REAL): a venture may render LIGHT or DARK.
 * The generator now emits `config.brand.mode` = "light" | "dark" (default
 * "dark") plus an optional `ink` text colour. Every foreground / hairline /
 * card / input token is derived from the scheme so a light palette produces a
 * clean light page with DARK text (not white text on a light background), and a
 * dark palette still reads great.
 */

const RADIUS_MAP: Record<string, string> = {
  sharp: "0.25rem",
  rounded: "0.75rem",
  pill: "9999px",
};

// The base venture.config.json may or may not carry `mode`/`ink` (older configs
// omit them; the generator now emits them). To stay assignable regardless of
// what TypeScript infers from the JSON, accept the config brand type and read
// the two scheme fields through a permissive view.
type SchemeBrand = typeof configBrand;

type SchemeFields = { mode?: string | null; ink?: string | null };

function schemeFields(brand: SchemeBrand): SchemeFields {
  return brand as unknown as SchemeFields;
}

export function isLightBrand(brand: SchemeBrand = configBrand): boolean {
  return schemeFields(brand).mode === "light";
}

/**
 * The CORE scheme tokens that the `<body>` needs to inherit: page surface, the
 * foreground trio, and the hairline pair. Set these on `<html>` in layout so
 * everything under body resolves correctly even before BrandProvider mounts.
 */
export function brandCoreCssVars(brand: SchemeBrand = configBrand): CSSProperties {
  const isLight = isLightBrand(brand);

  const fg = schemeFields(brand).ink || (isLight ? "#1a1a1a" : "#ececef");
  const fgMuted = isLight ? "rgba(20,18,16,0.62)" : "rgba(236,236,239,0.60)";
  const fgFaint = isLight ? "rgba(20,18,16,0.45)" : "rgba(236,236,239,0.40)";
  const hairline = isLight ? "rgba(20,18,16,0.12)" : "rgba(255,255,255,0.09)";
  const hairlineStrong = isLight ? "rgba(20,18,16,0.20)" : "rgba(255,255,255,0.16)";

  return {
    "--brand-surface": brand.surface,
    "--brand-surface-light": brand.surfaceLight,
    "--brand-fg": fg,
    "--brand-fg-muted": fgMuted,
    "--brand-fg-faint": fgFaint,
    "--brand-hairline": hairline,
    "--brand-hairline-strong": hairlineStrong,
  } as CSSProperties;
}

/**
 * The FULL derived token set for the BrandProvider wrapper: everything in the
 * core set plus colours, radius, card/input surfaces, borders, typography and
 * density. Keeping this here (rather than inline in BrandProvider) is what lets
 * layout and provider share the exact same scheme logic.
 */
export function brandCssVars(brand: SchemeBrand = configBrand): CSSProperties {
  const isLight = isLightBrand(brand);
  const radius = RADIUS_MAP[brand.borderRadius ?? "rounded"] ?? RADIUS_MAP.rounded;
  const borderOpacity = brand.borderOpacity ?? 0.08;

  const typography = resolveTypographyPreset(brand.typography);
  const density = resolveDensity(brand.density);

  const core = brandCoreCssVars(brand);

  // Scheme-aware card / input / interactive-border derivations. Dark uses white
  // tints; light uses black tints so surfaces read as subtle elevation rather
  // than washed-out ghosts.
  const surfaceCard = isLight
    ? "var(--brand-surface-light, #ffffff)"
    : "rgba(255, 255, 255, 0.03)";
  const surfaceInput = isLight
    ? "rgba(20, 18, 16, 0.03)"
    : "rgba(255, 255, 255, 0.04)";
  const borderColor = isLight
    ? `rgba(20, 18, 16, ${borderOpacity + 0.04})`
    : `rgba(255, 255, 255, ${borderOpacity})`;
  const borderHover = isLight
    ? `rgba(20, 18, 16, ${Math.min(borderOpacity * 1.8 + 0.04, 0.24)})`
    : `rgba(255, 255, 255, ${Math.min(borderOpacity * 1.8, 0.2)})`;

  return {
    ...core,
    "--brand-primary": brand.primary,
    "--brand-primary-dark": brand.primaryDark,
    "--brand-accent": brand.accent,
    // Card + input surfaces are ALWAYS scheme-derived, never taken from the
    // palette/config: the curated palettes only define primary/accent/surface/
    // surfaceLight/ink, and a stale dark surfaceCard/surfaceInput left in a base
    // config (e.g. #141416) would otherwise win here and paint black cards +
    // black inputs on a LIGHT venture (the hero mock, stats band, and email
    // field all read --brand-surface-card/-input). Derive from the scheme.
    "--brand-surface-card": surfaceCard,
    "--brand-surface-input": surfaceInput,
    "--brand-radius": radius,
    "--brand-border-opacity": borderOpacity,
    "--brand-border-color": borderColor,
    "--brand-border-hover": borderHover,
    "--brand-success": brand.success ?? "#22c55e",
    "--brand-warning": brand.warning ?? "#eab308",
    "--brand-error": brand.error ?? "#ef4444",
    "--brand-muted": brand.muted ?? "#6b7280",
    "--brand-info": brand.info ?? "#3b82f6",
    "--brand-primary-foreground": brand.primaryForeground ?? "#ffffff",
    "--brand-accent-foreground": brand.accentForeground ?? "#ffffff",
    // Typography
    "--font-sans": typography.sansStack,
    "--font-display": typography.displayStack,
    "--font-mono-stack": typography.monoStack,
    fontFamily: typography.sansStack,
    // Density spacing scale
    "--spacing-xs": density.xs,
    "--spacing-sm": density.sm,
    "--spacing-md": density.md,
    "--spacing-lg": density.lg,
    "--spacing-xl": density.xl,
    "--spacing-2xl": density["2xl"],
    "--density-line-height": density.lineHeight,
    "--density-font-size": density.fontSize,
  } as CSSProperties;
}
