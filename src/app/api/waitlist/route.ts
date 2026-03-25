import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("waitlist").insert([{ email }]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails
        .send({
          from: "hello@example.com",
          to: email,
          subject: `Welcome to the waitlist!`,
          html: "<h2>You're on the list!</h2><p>We'll notify you when we launch.</p>",
        })
        .catch(() => {});
    }

    return NextResponse.json({ message: "Success" });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
