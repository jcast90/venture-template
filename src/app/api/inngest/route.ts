import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { welcomeDrip } from "@/inngest/welcome-drip";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [welcomeDrip],
});
