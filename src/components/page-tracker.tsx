"use client";

import posthog from "posthog-js";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { buildTrackingPayload, getCanonicalEventName } from "@/lib/analytics/events";

// VOS-951 — beacon real visitor traffic back to Venture OS so the workbench
// Visitors card shows live numbers. The slug is injected at build time
// (NEXT_PUBLIC_VENTURE_SLUG, set by the build pipeline); the Venture OS origin
// defaults to production and can be overridden per environment.
const VENTURE_SLUG = process.env.NEXT_PUBLIC_VENTURE_SLUG || "";
const VENTURE_OS_URL = (
  process.env.NEXT_PUBLIC_VENTURE_OS_URL || "https://venture-os.co"
).replace(/\/$/, "");

function beaconVentureOS(pathname: string) {
  if (!VENTURE_SLUG) return; // not a pipeline-built venture — nothing to report
  try {
    fetch(`${VENTURE_OS_URL}/api/track/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venture_slug: VENTURE_SLUG,
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
      keepalive: true,
      // Cross-origin, unauthenticated public beacon — the endpoint resolves the
      // fund server-side from the slug and never trusts the client for it.
      mode: "cors",
      credentials: "omit",
    }).catch(() => {
      // Silently ignore — analytics must never break the venture page.
    });
  } catch {
    // Ignore synchronous failures (e.g. malformed URL in a bad env).
  }
}

export function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    const payload = {
      page: pathname,
      ua: navigator.userAgent,
      ...buildTrackingPayload(),
    };

    const timer = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently ignore tracking failures
      });

      try {
        posthog.capture(
          getCanonicalEventName(pathname === "/" ? "landing_page_view" : "page_view"),
          payload
        );
      } catch {
        // Ignore PostHog client failures
      }

      // VOS-951 — also report to Venture OS for the workbench Visitors metric.
      beaconVentureOS(pathname);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
