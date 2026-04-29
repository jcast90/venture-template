"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * RunsTable — recent audit runs, most recent first.
 *
 * Sample rows are deterministic (hardcoded ISO strings, fixed IDs) so
 * server-rendered HTML matches client hydration (VOS-204). Each row gets
 * data-testid="runs-table-row" so the Day 3 smoke test can count them.
 */
type RunStatus = "passed" | "failed" | "running";

type Run = {
  id: string;
  startedAtIso: string;
  startedAtLabel: string; // pre-formatted, en-US / UTC
  audit: string;
  status: RunStatus;
  findings: number;
};

const SAMPLE_RUNS: Run[] = [
  {
    id: "run_01HZX7K2D3",
    startedAtIso: "2026-04-28T14:02:00Z",
    startedAtLabel: "Apr 28, 2026, 2:02 PM UTC",
    audit: "security",
    status: "passed",
    findings: 0,
  },
  {
    id: "run_01HZX5R9YP",
    startedAtIso: "2026-04-28T11:18:00Z",
    startedAtLabel: "Apr 28, 2026, 11:18 AM UTC",
    audit: "performance",
    status: "passed",
    findings: 3,
  },
  {
    id: "run_01HZX44J7Q",
    startedAtIso: "2026-04-27T22:47:00Z",
    startedAtLabel: "Apr 27, 2026, 10:47 PM UTC",
    audit: "lint",
    status: "failed",
    findings: 12,
  },
  {
    id: "run_01HZX1F8AC",
    startedAtIso: "2026-04-27T09:05:00Z",
    startedAtLabel: "Apr 27, 2026, 9:05 AM UTC",
    audit: "security",
    status: "passed",
    findings: 1,
  },
];

function StatusBadge({ status }: { status: RunStatus }) {
  if (status === "passed") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      >
        passed
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge
        variant="outline"
        className="border-rose-400/30 bg-rose-400/10 text-rose-300"
      >
        failed
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-white/[0.08] bg-white/[0.04] text-white/70"
    >
      running
    </Badge>
  );
}

export function RunsTable() {
  const runs = SAMPLE_RUNS;

  return (
    <Card className="border-white/[0.06] bg-brand-surface-light text-white">
      <CardHeader>
        <CardTitle>Recent runs</CardTitle>
        <CardDescription className="text-white/60">
          The last few audit runs across all connected repositories.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {runs.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-white/40">
            No audit runs yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-white/60">Started</TableHead>
                <TableHead className="text-white/60">Audit</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-right text-white/60">
                  Findings
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow
                  key={run.id}
                  data-testid="runs-table-row"
                  className="border-white/[0.06]"
                >
                  <TableCell className="font-mono text-xs text-white/70">
                    {run.startedAtLabel}
                  </TableCell>
                  <TableCell className="capitalize">{run.audit}</TableCell>
                  <TableCell>
                    <StatusBadge status={run.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {run.findings}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
