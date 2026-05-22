"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Reports pageviews to the Venture OS native analytics ingest endpoint
// (POST /api/track/pageview). The endpoint resolves the venture by slug,
// computes is_organic server-side, and inserts a pageview_events row.
//
// Fire-and-forget: failures never throw and never block render. No-ops
// entirely when NEXT_PUBLIC_VENTURE_SLUG is unset (e.g. local dev).

const DEFAULT_INGEST_URL = "https://venture-os.co/api/track/pageview";

export function PageviewTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string>("");

  useEffect(() => {
    const ventureSlug = process.env.NEXT_PUBLIC_VENTURE_SLUG;
    if (!ventureSlug) return;

    // Skip duplicate fires for the same path.
    if (pathname === lastSent.current) return;
    lastSent.current = pathname;

    const ingestUrl =
      process.env.NEXT_PUBLIC_VOS_ANALYTICS_URL || DEFAULT_INGEST_URL;

    try {
      fetch(ingestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venture_slug: ventureSlug,
          path: pathname,
          referrer: document.referrer,
        }),
        keepalive: true,
      }).catch(() => {
        // Silently ignore tracking failures.
      });
    } catch {
      // Never let analytics break the page.
    }
  }, [pathname]);

  return null;
}
