"use client";

import config from "@/lib/config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card className="border-white/[0.06] bg-brand-surface-light">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white">
            General Settings
          </CardTitle>
          <CardDescription className="text-sm text-white/40">
            Update your product details and account information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-white/70">Product Name</Label>
              <Input
                defaultValue={config.name}
                className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Domain</Label>
              <Input
                defaultValue={config.domain}
                className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/20"
              />
            </div>
          </div>
          <Separator className="bg-white/[0.06]" />
          <div className="flex justify-end">
            <Button className="text-white" style={{ background: "var(--brand-primary)" }}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
