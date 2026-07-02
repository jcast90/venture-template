"use client";

import { useSyncExternalStore } from "react";
import {
  baseVentureConfig,
  resolveLandingConfig,
  type VentureConfig,
} from "@/lib/config";

// ─── Hydration-safe landing resolution ──────────────────────────────────────
//
// resolveLandingConfig() picks an A/B variant using Math.random() + cookies.
// Called directly in a client component's render, it produces DIFFERENT copy on
// the server (always base config) versus the client (possibly variant_b), which
// is the classic React #418 hydration mismatch that left the hero blank in the
// QA run (empty skeletons + a giant empty void below the hero).
//
// useResolvedLanding() fixes it by returning base config for SSR AND the first
// client render (so hydration matches exactly), then re-rendering with the
// assigned variant once mounted. Every landing component uses this hook instead
// of calling resolveLandingConfig() during render.
//
// This lives in its own "use client" module because config.ts is also imported
// by server components and API routes, which may not import client-only hooks.

function subscribeToHydration(onStoreChange: () => void): () => void {
  // Flip to "hydrated" on the next microtask after mount so the first client
  // render still matches the server snapshot.
  if (typeof queueMicrotask === "function") {
    queueMicrotask(onStoreChange);
    return () => {};
  }
  const id = window.setTimeout(onStoreChange, 0);
  return () => window.clearTimeout(id);
}

function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true, // client: hydrated once the subscription fires
    () => false // server + first client render: not yet hydrated
  );
}

export function useResolvedLanding(): VentureConfig {
  const hydrated = useHydrated();
  // Before hydration completes, always render the deterministic base config so
  // SSR and first client paint agree. After, apply the assigned A/B variant.
  return hydrated ? resolveLandingConfig() : baseVentureConfig;
}
