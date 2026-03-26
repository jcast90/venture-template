import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/lib/inngest";

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

    // Fire Inngest event to trigger the drip email campaign
    await inngest.send({ name: "waitlist/signup", data: { email } });

    return NextResponse.json({ message: "Success" });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
