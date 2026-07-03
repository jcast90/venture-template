import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Allow the E2B live-preview tunnel (https://<sandbox>-3000.e2b.app) to reach
  // the Next dev server. Next 16 blocks cross-origin dev requests, including the
  // HMR websocket, from non-localhost origins unless they are listed here.
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "venture-ops",
  project: process.env.SENTRY_PROJECT || "venture-os",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
