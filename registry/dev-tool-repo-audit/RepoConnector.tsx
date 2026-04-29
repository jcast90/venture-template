"use client";

import * as React from "react";
import { GitBranch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * RepoConnector — empty-state CTA for connecting a code repository.
 *
 * Rendered at the top of the {{tool_name}} dashboard when no repo is yet
 * connected. Single primary CTA kicks off the OAuth install flow; no SSH
 * keys, no manual cloning, no PAT pasting.
 *
 * Slot tokens (substituted by the catalog resolver at scaffold time):
 *   - {{tool_name}}: human-readable product name
 */
export function RepoConnector() {
  return (
    <Card className="border-white/[0.06] bg-brand-surface-light text-white">
      <CardHeader className="space-y-2">
        <div
          className="flex size-10 items-center justify-center rounded-lg"
          style={{ background: "var(--brand-primary)", color: "#0b0b10" }}
          aria-hidden
        >
          <ShieldCheck className="size-5" />
        </div>
        <CardTitle className="text-xl">
          Connect a repository to {`{{tool_name}}`}
        </CardTitle>
        <CardDescription className="text-white/60">
          OAuth-only — no SSH keys, no manual cloning. {`{{tool_name}}`} reads
          your code on demand and never stores it.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ul className="space-y-1 text-sm text-white/60">
          <li>• Read-only access via the GitHub App</li>
          <li>• Pick individual repositories during install</li>
          <li>• Revoke any time from your GitHub settings</li>
        </ul>
        <Button
          data-testid="connect-repo-button"
          size="lg"
          className="gap-2"
          style={{
            background:
              "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
          }}
        >
          <GitBranch className="size-4" />
          Connect GitHub
        </Button>
      </CardContent>
    </Card>
  );
}
