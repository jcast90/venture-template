"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ManagedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  updatedAt: string | Date;
  url?: string;
}

export interface FileManagerProps {
  files: ManagedFile[];
  onUpload?: (files: File[]) => void;
  onDelete?: (id: string) => void;
  onOpen?: (file: ManagedFile) => void;
  view?: "grid" | "list";
  className?: string;
  accept?: string;
}

function formatSize(bytes: number): string {
  if (!bytes && bytes !== 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function fileIcon(type: string): string {
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("video/")) return "🎬";
  if (type.startsWith("audio/")) return "🎵";
  if (type.includes("pdf")) return "📕";
  if (type.includes("zip") || type.includes("tar")) return "🗜️";
  if (type.includes("sheet") || type.includes("csv")) return "📊";
  if (type.includes("word") || type.includes("document")) return "📝";
  return "📄";
}

export function FileManager({
  files,
  onUpload,
  onDelete,
  onOpen,
  view = "grid",
  className,
  accept,
}: FileManagerProps) {
  const [mode, setMode] = React.useState<"grid" | "list">(view);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list || !onUpload) return;
    const arr = Array.from(list);
    if (arr.length) onUpload(arr);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 rounded-md border p-0.5">
          <button
            type="button"
            onClick={() => setMode("grid")}
            className={cn(
              "rounded px-2 py-1 text-xs",
              mode === "grid" ? "bg-muted font-medium" : "text-muted-foreground"
            )}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setMode("list")}
            className={cn(
              "rounded px-2 py-1 text-xs",
              mode === "list" ? "bg-muted font-medium" : "text-muted-foreground"
            )}
          >
            List
          </button>
        </div>
        {onUpload && (
          <Button size="sm" onClick={() => inputRef.current?.click()}>
            Upload
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {onUpload && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={cn(
            "rounded-md border-2 border-dashed p-4 text-center text-sm text-muted-foreground transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border"
          )}
        >
          Drag files here or click Upload
        </div>
      )}

      {mode === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {files.map((f) => (
            <div
              key={f.id}
              className="group flex flex-col items-center gap-2 rounded-md border p-3 hover:bg-muted/40"
            >
              <button
                type="button"
                onClick={() => onOpen?.(f)}
                className="text-4xl"
                aria-label={`Open ${f.name}`}
              >
                {fileIcon(f.type)}
              </button>
              <div className="w-full truncate text-center text-xs font-medium" title={f.name}>
                {f.name}
              </div>
              <div className="text-[10px] text-muted-foreground">{formatSize(f.size)}</div>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(f.id)}
                  className="text-[10px] text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          {files.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
              No files yet
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead>Updated</TableHead>
                {onDelete && <TableHead className="w-20" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={onDelete ? 5 : 4} className="py-6 text-center text-muted-foreground">
                    No files yet
                  </TableCell>
                </TableRow>
              ) : (
                files.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <button
                        type="button"
                        className="flex items-center gap-2 font-medium hover:underline"
                        onClick={() => onOpen?.(f)}
                      >
                        <span>{fileIcon(f.type)}</span>
                        <span className="truncate">{f.name}</span>
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{f.type || "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatSize(f.size)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(f.updatedAt).toLocaleDateString()}
                    </TableCell>
                    {onDelete && (
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => onDelete(f.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
