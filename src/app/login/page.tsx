import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function Login({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const nextValue = typeof next === "string" ? next : undefined;
  return (
    <AuthShell back={{ href: "/", label: "Home" }}>
      <LoginForm
        next={nextValue}
        destination={nextValue === "new-proposal" ? "/portal/as/zainab?next=/portal/new-proposal?preview=1" : "/portal"}
        heading="Welcome back"
        intro="Sign in to see your progress and next steps."
      />
    </AuthShell>
  );
}
