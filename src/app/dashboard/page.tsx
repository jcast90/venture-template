import config from "@/lib/config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome to {config.name}
        </h1>
        <p className="mt-1 text-sm text-white/50">
          This is your dashboard. Your product&apos;s features will appear here.
        </p>
      </div>

      <Card className="border-white/[0.06] bg-brand-surface-light text-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white">
            Getting started
          </CardTitle>
          <CardDescription className="text-sm text-white/40">
            A clean starting point for your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-white/[0.06]">
              <LayoutDashboard className="size-6 text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/70">
              Nothing here yet
            </p>
            <p className="max-w-sm text-sm text-white/40">
              As you build out {config.name}, your features and data will show
              up on this dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
