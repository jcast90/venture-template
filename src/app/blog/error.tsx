"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[blog] Unhandled error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-brand-surface flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        <h2 className="text-xl font-semibold text-white">Could not load blog posts</h2>
        <p className="mt-2 text-sm text-white/60">
          Blog content is temporarily unavailable. Please try again shortly.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="size-4" />
            Try again
          </Button>
          <Button asChild variant="ghost" className="text-white/60 hover:text-white">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
