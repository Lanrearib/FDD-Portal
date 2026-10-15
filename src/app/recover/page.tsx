import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { RecoverFlow } from "./recover-flow";

export const metadata: Metadata = { title: "Reset your password" };

export default function Recover() {
  return (
    <AuthShell back={{ href: "/login", label: "Sign in" }}>
      <RecoverFlow />
    </AuthShell>
  );
}
