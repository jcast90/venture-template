"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw } from "lucide-react";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[settings] Unhandled error:", error);
  }, [error]);

  return (
    <div className="px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h1>
      </div>
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-white/[0.06] mb-4">
          <Settings className="size-6 text-white/40" />
        </div>
        <h2 className="text-base font-semibold text-white">
          Settings unavailable
        </h2>
        <p className="mt-2 max-w-sm text-sm text-white/50">
          Could not load your settings. This may be a temporary issue.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-white/20">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset} className="mt-6 gap-2" variant="outline">
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
