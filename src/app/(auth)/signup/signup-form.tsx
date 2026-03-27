"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import config from "@/lib/config";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-lg bg-brand-surface-light border-white/[0.06]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2"><Logo size={40} /></div>
            <CardTitle className="text-2xl mt-4">Check your email</CardTitle>
            <CardDescription className="text-gray-400">
              We sent a login link to <strong className="text-white">{email}</strong>.
              <br />Click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <p className="text-xs text-gray-500 text-center">
              Didn&apos;t receive it? Check your spam folder or try again.
            </p>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" onClick={() => setStatus("idle")}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-4 rounded-3xl opacity-15 blur-2xl pointer-events-none" style={{ background: "radial-gradient(circle, var(--brand-primary), transparent 70%)" }} />
        <Card className="relative w-full bg-brand-surface-light border-white/[0.06]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2"><Logo size={40} /></div>
            <CardTitle className="text-2xl">Get started with {config.name}</CardTitle>
            <CardDescription className="text-gray-400">
              Create your free account in seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="bg-white/5 border-white/10"
                />
              </div>
              {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full text-white"
                style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
              >
                {status === "loading" ? "Sending..." : "Create Account"}
              </Button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-4">
              No password needed — we&apos;ll email you a secure login link.
            </p>
            <p className="text-center text-sm text-gray-400 mt-3">
              Already have an account? <Link href="/login" className="text-brand-primary hover:opacity-80">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
