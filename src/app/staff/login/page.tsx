import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "../../login/login-form";

export const metadata: Metadata = { title: "Staff sign in" };

export default function StaffLogin() {
  return (
    <AuthShell
      back={{ href: "/", label: "Home" }}
      aside={
        <div className="max-w-[40ch]">
          <h2 className="t-h2">For counsellors and department staff</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            You’ll see the candidates and cases routed to your Area or Zone. Every decision you make
            is recorded with your name and the time.
          </p>
        </div>
      }
    >
      <LoginForm
        staff
        destination="/staff"
        heading="Staff sign in"
        intro="Use the account the department set up for you."
      />
    </AuthShell>
  );
}
