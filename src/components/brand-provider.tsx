"use client";

import config from "@/lib/config";
import { brandCssVars } from "@/lib/brand-style";

/**
 * BrandProvider sets the FULL derived brand token set on a wrapper around the
 * page. The scheme-aware derivation (light vs dark foreground / hairline / card
 * / input) lives in `brandCssVars` so it stays identical to what layout.tsx
 * puts on `<html>`. See src/lib/brand-style.ts.
 */
export function BrandProvider({ children }: { children: React.ReactNode }) {
  const { brand } = config;

  return <div style={brandCssVars(brand)}>{children}</div>;
}
