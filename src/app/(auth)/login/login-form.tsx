"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import config from "@/lib/config";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("magic");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const supabase = createClient();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    });
    if (error) { setErrorMsg(error.message); setStatus("error"); }
    else { setStatus("sent"); }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErrorMsg(error.message); setStatus("error"); }
    else { router.push(redirect); }
  }

  async function handleOAuth(provider: "google" | "github") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    });
  }

  if (status === "sent") {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md bg-brand-surface-light border-white/[0.06]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2"><Logo size={40} /></div>
            <CardTitle className="text-2xl mt-4">Check your email</CardTitle>
            <CardDescription className="text-gray-400">
              We sent a magic link to <strong className="text-white">{email}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" onClick={() => setStatus("idle")}>Back to login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-4 rounded-3xl opacity-15 blur-2xl pointer-events-none" style={{ background: "radial-gradient(circle, var(--brand-primary), transparent 70%)" }} />
        <Card className="relative w-full bg-brand-surface-light border-white/[0.06]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><Logo size={40} /></div>
          <CardTitle className="text-2xl">{config.name}</CardTitle>
          <CardDescription className="text-gray-400">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 hover:border-brand-primary/30 transition-colors" onClick={() => handleOAuth("google")}>Google</Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 hover:border-brand-primary/30 transition-colors" onClick={() => handleOAuth("github")}>GitHub</Button>
          </div>
          <div className="relative">
            <Separator className="bg-white/[0.06]" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-surface-light px-3 text-xs text-gray-500">or continue with email</span>
          </div>
          <form onSubmit={mode === "magic" ? handleMagicLink : handlePasswordLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/5 border-white/10" />
            </div>
            {mode === "password" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" onClick={() => setMode("magic")} className="text-xs text-brand-primary hover:opacity-80">Use magic link</button>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/5 border-white/10" />
              </div>
            )}
            {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
            <Button type="submit" disabled={status === "loading"} className="w-full text-white" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}>
              {status === "loading" ? "Loading..." : mode === "magic" ? "Send Magic Link" : "Sign In"}
            </Button>
          </form>
          <button type="button" onClick={() => setMode(mode === "magic" ? "password" : "magic")} className="w-full text-center text-sm text-gray-400 hover:text-gray-300">
            {mode === "magic" ? "Use password instead" : "Use magic link instead"}
          </button>
          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account? <Link href="/signup" className="text-brand-primary hover:opacity-80">Sign up</Link>
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
