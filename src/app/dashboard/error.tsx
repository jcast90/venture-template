"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="mt-2 text-sm text-white/60">{error.message}</p>
      <Button
        onClick={reset}
        className="mt-6"
        variant="outline"
      >
        Try again
      </Button>
    </div>
  );
}
