import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  buildCookieHeader,
  isTunnelAuthEnabled,
  verifyTunnelRequest,
} from "@/lib/tunnel-token";

export async function proxy(request: NextRequest) {
  // Bypass auth for Playwright E2E and screenshot captures.
  // SCREENSHOT_TOKEN must be set as a Vercel env var; the request must pass
  // the matching token via ?screenshot_mode=<token> to skip auth.
  const screenshotToken = process.env.SCREENSHOT_TOKEN;
  if (
    screenshotToken &&
    request.nextUrl.searchParams.get("screenshot_mode") === screenshotToken
  ) {
    return NextResponse.next();
  }

  // VOS-816 — Sandbox tunnel auth. Runs only when the e2b dev sandbox has
  // SANDBOX_TUNNEL_SECRET set (lifecycle spawn injects it alongside
  // VENTURE_ID + FUND_ID). On standalone deployments (i.e. the venture's
  // production Vercel app), the env is absent and this is a no-op.
  if (isTunnelAuthEnabled()) {
    const result = await verifyTunnelRequest({
      searchParams: request.nextUrl.searchParams,
      cookieHeader: request.headers.get("cookie"),
    });
    if (!result.ok) {
      return new NextResponse(`Forbidden: ${result.reason ?? "unauthorized"}`, {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    // First request after a fresh URL token — set the cookie so HMR
    // websocket reconnects + same-origin nav don't need URL params.
    if (result.cookieValue && result.expiresAt) {
      const response = await updateSession(request);
      response.headers.append(
        "Set-Cookie",
        buildCookieHeader(result.cookieValue, result.expiresAt),
      );
      return response;
    }
    // Cookie path or auth_disabled — fall through to normal flow.
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|monitoring|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
