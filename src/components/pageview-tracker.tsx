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

    const payload = JSON.stringify({
      venture_slug: ventureSlug,
      path: pathname,
      referrer: document.referrer,
    });

    // This endpoint lives on a DIFFERENT origin (venture-os.co) than the
    // venture domain. A normal JSON POST triggers a CORS preflight that the
    // ingest endpoint does not answer, which logs a red CORS error to the
    // console even though we swallow the rejection. Two changes avoid that:
    //   1. Prefer navigator.sendBeacon, which is fire-and-forget and exempt
    //      from CORS console noise. It is the right tool for pageview pings.
    //   2. Fall back to fetch with mode:"no-cors" and a non-preflighted body,
    //      so the browser sends a simple request with no failing preflight.
    try {
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon(ingestUrl, new Blob([payload], { type: "text/plain" }));
        return;
      }
      void fetch(ingestUrl, {
        method: "POST",
        mode: "no-cors",
        // text/plain is a CORS-safelisted content type, so no preflight fires.
        headers: { "Content-Type": "text/plain" },
        body: payload,
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
