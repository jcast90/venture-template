"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WifiOff, Database, RefreshCw, AlertTriangle } from "lucide-react";

function classifyError(error: Error): {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
} {
  const msg = error.message?.toLowerCase() ?? "";

  if (
    msg.includes("supabase") ||
    msg.includes("relation") ||
    msg.includes("does not exist") ||
    msg.includes("table") ||
    msg.includes("permission denied")
  ) {
    return {
      icon: Database,
      title: "Data unavailable",
      description:
        "Could not load data from the database. The table may not exist yet or you may not have access.",
    };
  }

  if (
    msg.includes("fetch") ||
    msg.includes("network") ||
    msg.includes("failed to fetch") ||
    msg.includes("econnrefused") ||
    msg.includes("enotfound")
  ) {
    return {
      icon: WifiOff,
      title: "Connection error",
      description:
        "Could not reach the server. Check your internet connection and try again.",
    };
  }

  return {
    icon: AlertTriangle,
    title: "Something went wrong",
    description:
      error.message || "An unexpected error occurred. Please try again.",
  };
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

  const { icon: Icon, title, description } = classifyError(error);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-white/[0.06] mb-4">
        <Icon className="size-6 text-white/40" />
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-white/50">{description}</p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-white/20">
          Error ID: {error.digest}
        </p>
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
