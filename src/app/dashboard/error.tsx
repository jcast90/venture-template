"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

function isConnectionError(error: Error): boolean {
  const msg = error.message?.toLowerCase() ?? "";
  return (
    msg.includes("fetch failed") ||
    msg.includes("network") ||
    msg.includes("supabase") ||
    msg.includes("connection") ||
    msg.includes("econnrefused") ||
    msg.includes("timeout")
  );
}

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard] Unhandled error:", error);
  }, [error]);

  const connectionIssue = isConnectionError(error);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10 mb-4">
        <AlertCircle className="size-6 text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-white">
        {connectionIssue ? "Could not load dashboard data" : "Something went wrong"}
      </h2>
      <p className="mt-2 max-w-sm text-center text-sm text-white/60">
        {connectionIssue
          ? "We were unable to connect to the database. This is usually temporary — please try again in a moment."
          : (error.message || "An unexpected error occurred.")}
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-white/30">Error ID: {error.digest}</p>
      )}
      <Button
        onClick={reset}
        className="mt-6 gap-2"
        variant="outline"
      >
        <RefreshCw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
