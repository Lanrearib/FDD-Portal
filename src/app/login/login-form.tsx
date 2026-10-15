"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Input, PasswordInput } from "@/components/form";
import { Button } from "@/components/ui";

export function LoginForm({
  next,
  destination,
  heading,
  intro,
  staff = false,
}: {
  next?: string;
  destination: string;
  heading: string;
  intro: string;
  staff?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [pending, setPending] = useState(false);

  return (
    <div>
      <h1 className="t-h1">{heading}</h1>
      <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{intro}</p>
      {next === "new-proposal" && (
        <p className="mt-4 rounded-[12px] bg-info-soft px-3.5 py-2.5 text-[13.5px] leading-relaxed text-info">
          After you sign in, you’ll review your profile before starting a new proposal.
        </p>
      )}

      <form
        noValidate
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const errs: typeof errors = {};
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Enter the email address you registered with.";
          if (!password) errs.password = "Enter your password.";
          setErrors(errs);
          if (Object.keys(errs).length) return;
          setPending(true);
          setTimeout(() => router.push(destination), 500);
        }}
      >
        <Field label="Email address" error={errors.email}>
          <Input type="email" autoComplete="username" inputMode="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }} />
        </Field>
        <div>
          <Field label="Password" error={errors.password}>
            <PasswordInput autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: undefined })); }} />
          </Field>
          <Link href="/recover" className="mt-2 inline-block text-[13.5px] text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
            Forgot your password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {!staff ? (
        <p className="mt-8 text-[14px] text-ink-2">
          First time here?{" "}
          <Link href="/register" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            Create your profile
          </Link>
        </p>
      ) : (
        <p className="mt-8 text-[14px] text-ink-2">
          Not a counsellor?{" "}
          <Link href="/login" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            Candidate sign in
          </Link>
        </p>
      )}

      <p className="mt-10 rounded-[12px] bg-info-soft px-3.5 py-2.5 text-[13px] text-info">
        Prototype: any email and password will sign you in.
      </p>
    </div>
  );
}
