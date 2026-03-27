import { redirect } from "next/navigation";

// OTP handles both sign-in and sign-up — no separate signup page needed
export default function SignupPage() {
  redirect("/login");
}
