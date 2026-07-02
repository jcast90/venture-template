import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

// ─── Fontshare typography system ────────────────────────────────────────────
//
// Every venture picks ONE of the four named Fontshare presets (see the Venture
// OS design bible, landing-design-guidelines.md section 7). Fonts are
// self-hosted via next/font/local (woff2 downloaded from Fontshare into
// src/fonts) for production reliability, so a slow or blocked CDN never leaves
// a venture on a generic fallback.
//
// Fallback stacks are deliberately NEVER Inter/Roboto/Arial. A missing webfont
// degrades to Helvetica Neue / Charter / Iowan, which still read as designed.

const clashDisplay = localFont({
  variable: "--font-clash-display",
  display: "swap",
  src: [
    { path: "../fonts/clash-display-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/clash-display-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/clash-display-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/clash-display-700.woff2", weight: "700", style: "normal" },
  ],
});

const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    { path: "../fonts/satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/satoshi-700.woff2", weight: "700", style: "normal" },
  ],
});

const erode = localFont({
  variable: "--font-erode",
  display: "swap",
  src: [
    { path: "../fonts/erode-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/erode-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/erode-600.woff2", weight: "600", style: "normal" },
  ],
});

const generalSans = localFont({
  variable: "--font-general-sans",
  display: "swap",
  src: [
    { path: "../fonts/general-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/general-sans-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/general-sans-600.woff2", weight: "600", style: "normal" },
  ],
});

const zodiak = localFont({
  variable: "--font-zodiak",
  display: "swap",
  src: [
    { path: "../fonts/zodiak-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/zodiak-700.woff2", weight: "700", style: "normal" },
  ],
});

const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    { path: "../fonts/switzer-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/switzer-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/switzer-600.woff2", weight: "600", style: "normal" },
  ],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Preset NAMES are the contract with the generator. Do NOT rename these keys.
export type TypographyPreset =
  | "grotesque-display"
  | "editorial-serif"
  | "technical-mono"
  | "warm-humanist";

export type TypographyPresetConfig = {
  /** Space-separated className list combining all next/font variables used. */
  variableClassName: string;
  /** CSS value for --font-sans (body). */
  sansStack: string;
  /** CSS value for --font-display (headings). */
  displayStack: string;
  /** CSS value for --font-mono (code / labels). */
  monoStack: string;
};

// Fallbacks are chosen so a dropped webfont still looks intentional, never
// generic. No Inter / Roboto / Arial anywhere.
const FALLBACK_GROTESQUE = `"Helvetica Neue", "Segoe UI", sans-serif`;
const FALLBACK_HUMANIST = `"Avenir Next", "Segoe UI", sans-serif`;
const FALLBACK_SERIF = `"Iowan Old Style", Charter, "Hoefler Text", Palatino, serif`;
const FALLBACK_MONO = `ui-monospace, "SFMono-Regular", Menlo, monospace`;

export const TYPOGRAPHY_PRESETS: Record<TypographyPreset, TypographyPresetConfig> = {
  // A. Bold, modern, product-led (Linear lane).
  "grotesque-display": {
    variableClassName: `${clashDisplay.variable} ${satoshi.variable} ${jetbrainsMono.variable}`,
    sansStack: `var(--font-satoshi), ${FALLBACK_GROTESQUE}`,
    displayStack: `var(--font-clash-display), ${FALLBACK_GROTESQUE}`,
    monoStack: `var(--font-mono), ${FALLBACK_MONO}`,
  },
  // B. Refined, trustworthy, considered (Mercury lane).
  "editorial-serif": {
    variableClassName: `${erode.variable} ${generalSans.variable} ${jetbrainsMono.variable}`,
    sansStack: `var(--font-general-sans), ${FALLBACK_HUMANIST}`,
    displayStack: `var(--font-erode), ${FALLBACK_SERIF}`,
    monoStack: `var(--font-mono), ${FALLBACK_MONO}`,
  },
  // C. Precise, engineer-facing (Braintrust lane). Mono ONLY in code/labels.
  "technical-mono": {
    variableClassName: `${satoshi.variable} ${jetbrainsMono.variable}`,
    sansStack: `var(--font-satoshi), ${FALLBACK_GROTESQUE}`,
    displayStack: `var(--font-satoshi), ${FALLBACK_GROTESQUE}`,
    monoStack: `var(--font-mono), ${FALLBACK_MONO}`,
  },
  // D. Approachable, warm without childish (consumer/community).
  "warm-humanist": {
    variableClassName: `${zodiak.variable} ${switzer.variable} ${jetbrainsMono.variable}`,
    sansStack: `var(--font-switzer), ${FALLBACK_HUMANIST}`,
    displayStack: `var(--font-zodiak), ${FALLBACK_SERIF}`,
    monoStack: `var(--font-mono), ${FALLBACK_MONO}`,
  },
};

// Legacy preset names map onto the closest Fontshare preset so older
// venture.config.json files (clean/editorial/technical/friendly) keep working.
const LEGACY_ALIASES: Record<string, TypographyPreset> = {
  clean: "grotesque-display",
  editorial: "editorial-serif",
  technical: "technical-mono",
  friendly: "warm-humanist",
};

const DEFAULT_PRESET: TypographyPreset = "grotesque-display";

export function resolveTypographyPreset(preset?: string | null): TypographyPresetConfig {
  const raw = (preset ?? DEFAULT_PRESET).trim();
  const key = (TYPOGRAPHY_PRESETS[raw as TypographyPreset]
    ? (raw as TypographyPreset)
    : LEGACY_ALIASES[raw]) ?? DEFAULT_PRESET;
  return TYPOGRAPHY_PRESETS[key];
}

export type Density = "compact" | "default" | "spacious";

export type DensityScale = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  /** Base line-height multiplier */
  lineHeight: string;
  /** Base font size for body text */
  fontSize: string;
};

export const DENSITY_SCALES: Record<Density, DensityScale> = {
  compact: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    lineHeight: "1.4",
    fontSize: "0.9375rem",
  },
  default: {
    xs: "0.375rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    lineHeight: "1.5",
    fontSize: "1rem",
  },
  spacious: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4.5rem",
    lineHeight: "1.65",
    fontSize: "1.0625rem",
  },
};

export function resolveDensity(density?: string | null): DensityScale {
  const key = (density ?? "default") as Density;
  return DENSITY_SCALES[key] ?? DENSITY_SCALES.default;
}
