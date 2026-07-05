// VOS-209: server component on purpose. Previously this was `"use client"`
// AND called `new Date().getFullYear()` in the render body. The client
// hydration ran at a different wall-clock instant than the SSR tick, which
// fires React #418 when the year boundary (or any timezone drift) is
// crossed. Rendering on the server once and shipping a static string kills
// the mismatch. Keep this file a server component.
import config, { brand } from "@/lib/config";

// Hardcoded. `new Date()` (even at module scope under "use client") runs
// at two different instants: once during the server bundle and once in
// the browser, which can differ by a year at the Jan 1 UTC boundary. A
// literal is the only truly deterministic option. Bump this annually in
// CI or via a venture-template release.
const COPYRIGHT_YEAR = 2026;

export function FooterBar() {
  return (
    <footer className="border-t border-brand-border px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoUrl}
              alt={`${config.name} logo`}
              className="h-6 w-6 rounded-md object-contain"
            />
          ) : (
            <div
              className="h-6 w-6 rounded-md flex items-center justify-center text-xs font-semibold font-display"
              style={{
                background: "var(--brand-primary)",
                color: "var(--brand-primary-foreground)",
              }}
            >
              {(config.name || "V").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium">{config.name}</span>
        </div>
        <p className="text-xs text-[var(--brand-fg-faint)]">
          &copy; {COPYRIGHT_YEAR} {config.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
