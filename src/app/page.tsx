"use client";

import { useState, FormEvent } from "react";
import config from "@/lib/config";
import {
  ArrowRight,
  Check,
  AlertCircle,
  Zap,
  Target,
  Layers,
  Sparkles,
  Shield,
  TrendingUp,
  Loader2,
} from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function LandingPage() {
  const { landing } = config;
  const waitlistMode = config.flags?.waitlistMode ?? true;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

  const stepIcons = [Target, Layers, Sparkles];
  const painIcons = [AlertCircle, Shield, TrendingUp, Zap, Target, Layers];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0A0A0F]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              {config.name}
            </span>
          </div>
          <a
            href={waitlistMode ? "#waitlist" : "/signup"}
            className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-sm font-medium transition-all hover:from-blue-500 hover:to-violet-500 hover:shadow-lg hover:shadow-blue-500/25"
          >
            {waitlistMode ? "Get Early Access" : "Get Started"}
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-36 pb-24 text-center overflow-hidden">
        {/* Glow effects */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px]" />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Now in early access</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {landing.headline}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            {landing.subheadline}
          </p>

          {/* Waitlist form (only in waitlist mode) */}
          {waitlistMode ? (
          <div id="waitlist" className="mx-auto mt-10 max-w-md">
            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4 text-emerald-400">
                <Check className="h-5 w-5" />
                <span className="font-medium">
                  You&apos;re on the list! We&apos;ll be in touch.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-blue-500/50 focus:bg-white/[0.06]"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 text-sm font-semibold transition-all hover:from-blue-500 hover:to-violet-500 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
            )}
            <p className="mt-4 text-xs text-zinc-600">
              No spam. Unsubscribe anytime.
            </p>
          </div>
          ) : (
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-sm font-semibold transition-all hover:from-blue-500 hover:to-violet-500 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-medium transition-all hover:bg-white/5"
            >
              View Pricing
            </a>
          </div>
          )}
        </div>
      </section>

      {/* ── Pain Stats ── */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {landing.painStats.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 px-8 py-12 text-center">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                {item.stat}
              </span>
              <span className="text-sm text-zinc-400">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                works
              </span>
            </h2>
            <p className="mt-4 text-zinc-400">
              Get started in minutes, not months.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {landing.steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/10">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Step {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="px-6 py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Problems we{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                solve
              </span>
            </h2>
            <p className="mt-4 text-zinc-400">
              Say goodbye to the frustrations holding you back.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landing.painPoints.map((point, i) => {
              const Icon = painIcons[i % painIcons.length];
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {point}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing (hidden in waitlist mode) ── */}
      {!waitlistMode && (
      <section id="pricing" className="px-6 py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                transparent
              </span>{" "}
              pricing
            </h2>
            <p className="mt-4 text-zinc-400">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {landing.pricing.map((tier, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                  tier.highlighted
                    ? "border-blue-500/30 bg-gradient-to-b from-blue-500/[0.08] to-violet-500/[0.04] shadow-2xl shadow-blue-500/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-1 text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold">{tier.plan}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{tier.desc}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-zinc-500">{tier.period}</span>
                  )}
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/signup"
                  className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 hover:shadow-lg hover:shadow-blue-500/25"
                      : "border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08]"
                  }`}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Final CTA ── */}
      <section className="relative px-6 py-32 overflow-hidden">
        {/* Glow effects */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 right-1/3 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {landing.finalCta.headline}
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            {landing.finalCta.subheadline}
          </p>

          <div className="mt-10">
            <a
              href={waitlistMode ? "#waitlist" : "/signup"}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-base font-semibold transition-all hover:from-blue-500 hover:to-violet-500 hover:shadow-xl hover:shadow-blue-500/25"
            >
              {waitlistMode ? "Join the Waitlist" : "Get Started Free"}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium">{config.name}</span>
          </div>
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} {config.name}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
