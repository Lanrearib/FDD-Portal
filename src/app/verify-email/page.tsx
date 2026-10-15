import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { VerifyForm } from "./verify-form";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyEmail({ searchParams }: PageProps<"/verify-email">) {
  const { email } = await searchParams;
  const address = typeof email === "string" && email.includes("@") ? email : "you@example.com";
  return (
    <AuthShell>
      <VerifyForm email={address} />
    </AuthShell>
  );
}
