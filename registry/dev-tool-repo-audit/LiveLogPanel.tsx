"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * LiveLogPanel — streaming-log surface for an in-flight audit run.
 *
 * For the spike, this is a static empty state. When a real run is wired up,
 * each log line streams into the scrollable region. The pulsing dot makes
 * the panel feel alive even when idle.
 */
export function LiveLogPanel() {
  return (
    <Card
      data-testid="live-log-panel"
      className="border-white/[0.06] bg-brand-surface-light text-white"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">Live log</CardTitle>
          <CardDescription className="text-white/60">
            Streaming output from the active audit run.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span
            className="size-2 animate-pulse rounded-full"
            style={{ background: "var(--brand-primary)" }}
            aria-hidden
          />
          idle
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto rounded-md border border-white/[0.06] bg-black/40 p-4 font-mono text-xs text-white/60">
          <p className="text-white/40">No audit running.</p>
          <p className="mt-1 text-white/30">
            Click <span className="text-white/60">Run audit</span> to start a
            new run. Output will appear here in real time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
