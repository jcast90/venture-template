import type { Metadata } from "next";
import "./globals.css";
import config, { brand } from "@/lib/config";
import { PageTracker } from "@/components/page-tracker";
import { PageviewTracker } from "@/components/pageview-tracker";
import { BrandProvider } from "@/components/brand-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { resolveTypographyPreset } from "@/lib/typography";
import { brandCoreCssVars, isLightBrand } from "@/lib/brand-style";

const typography = resolveTypographyPreset(config.brand?.typography);

// VOS-GEN-VARIETY-REAL: render light OR dark per venture. The `dark` class is
// applied ONLY when the palette is dark; a light palette gets dark text on a
// light surface. Core scheme tokens are set on <html> so <body> inherits them.
const isLight = isLightBrand(brand);
const htmlStyle = {
  ...brandCoreCssVars(brand),
  colorScheme: isLight ? "light" : "dark",
} as React.CSSProperties;

export const metadata: Metadata = {
  title: config.name + " - " + config.tagline,
  description: config.description,
  // VOS-BRAND-LOGO-GEN: use the generated favicon when present.
  ...(brand.faviconUrl ? { icons: { icon: brand.faviconUrl } } : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${typography.variableClassName}${isLight ? "" : " dark"}`}
      style={htmlStyle}
    >
      <body className="antialiased bg-brand-surface text-[var(--brand-fg)] font-sans">
        <BrandProvider>
          <AnalyticsProvider>
            <PageTracker />
            <PageviewTracker />
            {children}
          </AnalyticsProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
