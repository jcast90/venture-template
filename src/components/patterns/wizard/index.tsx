"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

export interface WizardProps {
  steps: WizardStep[];
  onComplete?: () => void | Promise<void>;
  initialStep?: number;
  className?: string;
  completeLabel?: string;
  nextLabel?: string;
  backLabel?: string;
}

export function Wizard({
  steps,
  onComplete,
  initialStep = 0,
  className,
  completeLabel = "Finish",
  nextLabel = "Next",
  backLabel = "Back",
}: WizardProps) {
  const [current, setCurrent] = React.useState(initialStep);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (steps.length === 0) return null;

  const step = steps[current];
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;

  const handleNext = async () => {
    setError(null);
    if (step.validate) {
      setBusy(true);
      try {
        const ok = await step.validate();
        if (!ok) {
          setError("Please fix the highlighted issues before continuing.");
          setBusy(false);
          return;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Validation failed");
        setBusy(false);
        return;
      }
      setBusy(false);
    }
    if (isLast) {
      if (onComplete) {
        setBusy(true);
        try {
          await onComplete();
        } finally {
          setBusy(false);
        }
      }
    } else {
      setCurrent((n) => Math.min(n + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrent((n) => Math.max(n - 1, 0));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => {
          const state = i < current ? "done" : i === current ? "active" : "upcoming";
          return (
            <li key={s.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium",
                  state === "done" && "border-primary bg-primary text-primary-foreground",
                  state === "active" && "border-primary text-primary",
                  state === "upcoming" && "border-border text-muted-foreground"
                )}
                aria-current={state === "active" ? "step" : undefined}
              >
                {state === "done" ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  state === "active" ? "font-medium" : "text-muted-foreground"
                )}
              >
                {s.title}
              </span>
              {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border sm:w-10" aria-hidden />}
            </li>
          );
        })}
      </ol>

      <div className="rounded-lg border p-6">
        <div className="mb-1 text-lg font-semibold">{step.title}</div>
        {step.description && (
          <p className="mb-4 text-sm text-muted-foreground">{step.description}</p>
        )}
        <div>{step.content}</div>
        {error && (
          <div role="alert" className="mt-4 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack} disabled={isFirst || busy}>
          {backLabel}
        </Button>
        <div className="text-xs text-muted-foreground">
          Step {current + 1} of {steps.length}
        </div>
        <Button onClick={handleNext} disabled={busy}>
          {isLast ? completeLabel : nextLabel}
        </Button>
      </div>
    </div>
  );
}
