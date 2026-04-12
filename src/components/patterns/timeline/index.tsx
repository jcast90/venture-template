"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TimelineVariant = "default" | "success" | "warning" | "error" | "info";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string | Date;
  icon?: React.ReactNode;
  variant?: TimelineVariant;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  formatTimestamp?: (ts: string | Date) => string;
}

const variantColor: Record<TimelineVariant, string> = {
  default: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-sky-500",
};

const defaultFormat = (ts: string | Date) => {
  const d = typeof ts === "string" ? new Date(ts) : ts;
  if (isNaN(d.getTime())) return String(ts);
  return d.toLocaleString();
};

export function Timeline({ items, className, formatTimestamp = defaultFormat }: TimelineProps) {
  return (
    <ol className={cn("relative border-s border-border ps-6", className)}>
      {items.map((item, idx) => {
        const color = variantColor[item.variant ?? "default"];
        return (
          <li key={item.id} className={cn("mb-6 last:mb-0", idx === items.length - 1 && "mb-0")}>
            <span
              className={cn(
                "absolute -start-[7px] mt-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-background flex items-center justify-center text-[9px] text-white",
                color
              )}
              aria-hidden
            >
              {item.icon}
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <time className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</time>
            </div>
            {item.description && (
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
