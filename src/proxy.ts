import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

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

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|monitoring|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
