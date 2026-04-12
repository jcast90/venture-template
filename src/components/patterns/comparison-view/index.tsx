"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ComparisonColumn {
  id: string;
  title: string;
  subtitle?: string;
  highlighted?: boolean;
  ctaLabel?: string;
  onCta?: () => void;
}

export interface ComparisonRow {
  feature: string;
  description?: string;
  values: Record<string, boolean | string | number>;
}

export interface ComparisonViewProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  className?: string;
}

function renderValue(v: boolean | string | number | undefined) {
  if (v === true) return <span className="text-emerald-600 dark:text-emerald-400">✓</span>;
  if (v === false || v === undefined || v === null)
    return <span className="text-muted-foreground">—</span>;
  return <span>{String(v)}</span>;
}

export function ComparisonView({ columns, rows, className }: ComparisonViewProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left text-sm font-medium text-muted-foreground" />
            {columns.map((col) => (
              <th
                key={col.id}
                className={cn(
                  "p-4 text-left align-top",
                  col.highlighted && "bg-primary/5 rounded-t-md"
                )}
              >
                <div className="text-base font-semibold">{col.title}</div>
                {col.subtitle && (
                  <div className="mt-1 text-sm text-muted-foreground">{col.subtitle}</div>
                )}
                {col.ctaLabel && (
                  <Button
                    size="sm"
                    variant={col.highlighted ? "default" : "outline"}
                    className="mt-3"
                    onClick={col.onCta}
                  >
                    {col.ctaLabel}
                  </Button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row.feature}-${idx}`} className="border-b last:border-0">
              <td className="p-4 align-top">
                <div className="text-sm font-medium">{row.feature}</div>
                {row.description && (
                  <div className="mt-0.5 text-xs text-muted-foreground">{row.description}</div>
                )}
              </td>
              {columns.map((col) => (
                <td
                  key={col.id}
                  className={cn(
                    "p-4 text-sm",
                    col.highlighted && "bg-primary/5"
                  )}
                >
                  {renderValue(row.values[col.id])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
