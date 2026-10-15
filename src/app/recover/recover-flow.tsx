"use client";

import { Check, KeyRound } from "lucide-react";
import { useState } from "react";
import { CodeInput, Field, Input, PasswordInput } from "@/components/form";
import { Button, ButtonLink } from "@/components/ui";
import { maskEmail } from "@/lib/reference";

type Step = "email" | "code" | "password" | "done";

export function RecoverFlow() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (step === "done") {
    return (
      <div className="animate-rise">
        <span className="flex size-12 items-center justify-center rounded-full bg-ok-soft text-ok">
          <Check className="size-6" strokeWidth={2.5} aria-hidden />
        </span>
        <h1 className="t-h1 mt-5">Password changed</h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
          You can now sign in with your new password. We’ve emailed you to confirm the change.
        </p>
        <ButtonLink href="/login" size="lg" className="mt-7">
          Sign in
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      <span className="flex size-12 items-center justify-center rounded-full bg-sunken text-ink">
        <KeyRound className="size-6" aria-hidden />
      </span>

      {step === "email" && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter the email address you registered with.");
            setStep("code");
          }}
        >
          <h1 className="t-h1 mt-5">Reset your password</h1>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
            Enter the email you registered with. If it matches a profile, we’ll send a code.
          </p>
          <Field label="Email address" error={error} className="mt-8">
            <Input type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} />
          </Field>
          <Button type="submit" size="lg" className="mt-6 w-full">
            Send code
          </Button>
        </form>
      )}

      {step === "code" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^\d{6}$/.test(code)) return setError("Enter all 6 digits of the code.");
            if (code !== "246810") return setError("That code isn’t right. Check the latest email we sent.");
            setError(null);
            setStep("password");
          }}
        >
          <h1 className="t-h1 mt-5">Enter your code</h1>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
            If <span className="font-medium text-ink">{maskEmail(email.trim())}</span> has a profile, a
            6-digit code is on its way. It expires in 10 minutes.
          </p>
          <div className="mt-8">
            <CodeInput value={code} onChange={(v) => { setCode(v); setError(null); }} invalid={!!error} />
            {error && <p role="alert" className="mt-3 text-[13.5px] font-medium text-bad">{error}</p>}
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
            Continue
          </Button>
          <p className="mt-10 rounded-[12px] bg-info-soft px-3.5 py-2.5 text-[13px] text-info">
            Prototype: use the code <span className="font-semibold tabular-nums">246810</span>.
          </p>
        </form>
      )}

      {step === "password" && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (password.length < 10 || !/[0-9]/.test(password) || !/[a-zA-Z]/.test(password))
              return setError("Use at least 10 characters, with letters and numbers.");
            if (password !== confirm) return setError("The two passwords don’t match.");
            setStep("done");
          }}
        >
          <h1 className="t-h1 mt-5">Choose a new password</h1>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
            You’ll be signed out on other devices.
          </p>
          <div className="mt-8 space-y-5">
            <Field label="New password" hint="At least 10 characters, with letters and numbers.">
              <PasswordInput autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} />
            </Field>
            <Field label="Confirm new password" error={error}>
              <PasswordInput autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(null); }} />
            </Field>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full">
            Save new password
          </Button>
        </form>
      )}
    </div>
  );
}
