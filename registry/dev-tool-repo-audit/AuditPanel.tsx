"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * AuditPanel — central "run an audit" control.
 *
 * Renders one Badge per audit kind (slot {{audit_kinds}}) and a primary
 * "Run audit" button. The button is the click target the Day 3 Playwright
 * smoke test exercises.
 *
 * Slot tokens (substituted by the catalog resolver at scaffold time):
 *   - {{audit_kinds}}: array<string> of audit kinds (e.g. security, lint)
 */
const AUDIT_KINDS: string[] = {{audit_kinds}};

export function AuditPanel() {
  return (
    <Card className="border-white/[0.06] bg-brand-surface-light text-white">
      <CardHeader>
        <CardTitle>Run an audit</CardTitle>
        <CardDescription className="text-white/60">
          Pick the audit kinds to include, then trigger a run on the
          connected repository.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {AUDIT_KINDS.map((kind) => (
            <Badge
              key={kind}
              variant="outline"
              className="border-white/[0.08] bg-white/[0.04] text-white"
              style={{ color: "var(--brand-primary)" }}
            >
              {kind}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">
            Audits typically finish in under 2 minutes. Findings stream into
            the live log on the right.
          </p>
          <Button
            data-testid="run-audit-button"
            size="lg"
            className="gap-2"
            style={{
              background:
                "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
            }}
          >
            <Play className="size-4" />
            Run audit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
