import * as React from "react";
import { RepoConnector } from "@/components/dev-tool-repo-audit/RepoConnector";
import { AuditPanel } from "@/components/dev-tool-repo-audit/AuditPanel";
import { LiveLogPanel } from "@/components/dev-tool-repo-audit/LiveLogPanel";
import { RunsTable } from "@/components/dev-tool-repo-audit/RunsTable";

/**
 * Audits page — composed shell for the dev-tool-repo-audit archetype.
 *
 * Layout:
 *   - RepoConnector at the top (empty-state CTA).
 *   - AuditPanel + LiveLogPanel side-by-side on lg+, stacked on mobile.
 *   - RunsTable underneath.
 *
 * Slot tokens (substituted by the catalog resolver at scaffold time):
 *   - {{tool_name}}: human-readable product name (used in heading + title)
 *   - {{primary_color}}: brand hex colour, applied via inline CSS variable
 */
export default function AuditsPage() {
  return (
    <div
      className="px-4 py-8 lg:px-8"
      style={{ ["--brand-primary" as string]: "{{primary_color}}" }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">
          {`{{tool_name}}`} Audits
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Connect a repository, run an audit, and review the findings — all in
          one place.
        </p>
      </div>

      <div className="space-y-6">
        <RepoConnector />

        <div className="grid gap-6 lg:grid-cols-2">
          <AuditPanel />
          <LiveLogPanel />
        </div>

        <RunsTable />
      </div>
    </div>
  );
}
