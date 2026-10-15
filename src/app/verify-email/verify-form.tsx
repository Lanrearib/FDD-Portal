"use client";

import { Check, MailCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CodeInput } from "@/components/form";
import { Button, ButtonLink } from "@/components/ui";
import { maskEmail, pastorById } from "@/lib/reference";

const DEMO_CODE = "246810";
const MAX_TRIES = 5;

export function VerifyForm({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [cooldown, setCooldown] = useState(60);
  const [resent, setResent] = useState(false);
  const [done, setDone] = useState(false);
  const [registered, setRegistered] = useState<{ firstName?: string; pastorId?: string } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("fd-registered");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read from storage
      if (raw) setRegistered(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const locked = tries >= MAX_TRIES;

  const verify = () => {
    if (!/^\d{6}$/.test(code)) return setError("Enter all 6 digits of the code.");
    if (code !== DEMO_CODE) {
      const used = tries + 1;
      setTries(used);
      setCode("");
      return setError(
        used >= MAX_TRIES
          ? "Too many incorrect tries. Request a new code to continue."
          : `That code isn’t right. You have ${MAX_TRIES - used} ${MAX_TRIES - used === 1 ? "try" : "tries"} left.`,
      );
    }
    setDone(true);
  };

  const resend = () => {
    setCooldown(60);
    setTries(0);
    setCode("");
    setError(null);
    setResent(true);
  };

  if (done) {
    const pastor = registered?.pastorId ? pastorById(registered.pastorId) : undefined;
    return (
      <div className="animate-rise">
        <span className="flex size-12 items-center justify-center rounded-full bg-ok-soft text-ok">
          <Check className="size-6" strokeWidth={2.5} aria-hidden />
        </span>
        <h1 className="t-h1 mt-5">Your profile is ready{registered?.firstName ? `, ${registered.firstName}` : ""}</h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
          Your reference is <span className="font-semibold text-ink tabular-nums">FD-8N2K4R</span>. Keep it
          for any conversation with the department.
        </p>
        <ul className="mt-6 space-y-3 rounded-card bg-surface p-5 text-[14.5px] ring-1 ring-line/80">
          <li className="flex gap-3">
            <Check className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={2.5} aria-hidden />
            Email verified
          </li>
          <li className="flex gap-3">
            <Check className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={2.5} aria-hidden />
            {pastor ? `${pastor.name} has been emailed your introduction link` : "Your Pastor has been emailed your introduction link"}
          </li>
          <li className="flex gap-3">
            <span className="mt-1 ml-0.5 size-3 shrink-0 rounded-full bg-peach" aria-hidden />
            <span>
              <span className="font-medium">Next: verify your identity.</span>{" "}
              <span className="text-muted">It takes about two minutes with a photo ID.</span>
            </span>
          </li>
        </ul>
        <ButtonLink href="/portal/as/new" size="lg" className="mt-7 w-full sm:w-auto">
          Go to my portal
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      <span className="flex size-12 items-center justify-center rounded-full bg-sunken text-ink">
        <MailCheck className="size-6" aria-hidden />
      </span>
      <h1 className="t-h1 mt-5">Check your email</h1>
      <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
        We sent a 6-digit code to <span className="font-medium text-ink">{maskEmail(email)}</span>. It
        expires in 10 minutes.
      </p>

      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!locked) verify();
        }}
      >
        <CodeInput
          value={code}
          onChange={(v) => {
            setCode(v);
            setError(null);
          }}
          invalid={!!error}
        />
        {error && (
          <p role="alert" className="mt-3 text-[13.5px] font-medium text-bad">
            {error}
          </p>
        )}
        {resent && !error && (
          <p role="status" className="mt-3 text-[13.5px] text-ok">
            A new code is on its way. Earlier codes no longer work.
          </p>
        )}
        <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={locked}>
          Verify email
        </Button>
      </form>

      <div className="mt-8 space-y-2 text-[14px] text-ink-2">
        <p>
          Didn’t get it? Check your spam folder, or{" "}
          {cooldown > 0 ? (
            <span className="text-muted tabular-nums">request a new code in {cooldown}s</span>
          ) : (
            <button type="button" onClick={resend} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              send a new code
            </button>
          )}
          .
        </p>
        <p>
          Wrong email address?{" "}
          <Link href="/register" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            Go back and change it
          </Link>
        </p>
      </div>

      <p className="mt-10 rounded-[12px] bg-info-soft px-3.5 py-2.5 text-[13px] text-info">
        Prototype: no email is sent. Use the code <span className="font-semibold tabular-nums">{DEMO_CODE}</span>.
      </p>
    </div>
  );
}
