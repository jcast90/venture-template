"use client";

import { useState, FormEvent } from "react";
import { isLiveMode } from "@/lib/config";
import { useResolvedLanding } from "@/lib/use-landing";
import { buildTrackingPayload } from "@/lib/analytics/events";
import { ArrowRight, Check, Loader2 } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

export function WaitlistForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { landing } = useResolvedLanding();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...buildTrackingPayload() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div id="waitlist" className={className || "mx-auto mt-10 max-w-md"}>
      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4 text-emerald-400">
          <Check className="h-5 w-5" />
          <span className="font-medium">
            You&apos;re on the list! We&apos;ll be in touch.
          </span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-xl border border-brand-border bg-brand-surface-input px-5 py-3.5 text-sm text-[var(--brand-fg)] placeholder-zinc-500 outline-none transition-colors focus:border-brand-primary/50 focus:bg-brand-surface-input"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-opacity duration-200 ease-out hover:opacity-90 disabled:opacity-60"
            style={{
              background: "var(--brand-primary)",
              color: "var(--brand-primary-foreground)",
            }}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {landing.primaryCta ||
                  (isLiveMode ? "Try it Free" : "Join Waitlist")}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
      )}
      <p className="mt-4 text-xs text-[var(--brand-fg-faint)]">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

export function LiveCtaButtons() {
  const { landing } = useResolvedLanding();
  return (
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <a
        href="/signup"
        className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-opacity duration-200 ease-out hover:opacity-90"
        style={{
          background: "var(--brand-primary)",
          color: "var(--brand-primary-foreground)",
        }}
      >
        {landing.primaryCta || "Try it Free"}
        <ArrowRight className="h-4 w-4" />
      </a>
      <a
        href="#pricing"
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--brand-hairline)] px-8 py-3.5 text-sm font-medium transition-all hover:bg-[var(--brand-surface-card)]"
      >
        {landing.secondaryCta || "View Pricing"}
      </a>
    </div>
  );
}
