import { ChevronRight, KeyRound, UserRoundPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Start the marriage process" };

const choices = [
  {
    href: "/register",
    icon: UserRoundPlus,
    title: "First time here",
    body: "Create your profile, verify your email and identity, and choose your Pastor.",
  },
  {
    href: "/login?next=new-proposal",
    icon: KeyRound,
    title: "I already have an account",
    body: "Sign in to continue, or to start a new proposal with your existing profile.",
  },
];

export default function Start() {
  return (
    <AuthShell
      back={{ href: "/", label: "Home" }}
      aside={
        <div className="max-w-[40ch]">
          <h2 className="t-h2">One profile, kept for every proposal</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            If you have taken part in the marriage process before, as a brother or a sister, please
            sign in rather than registering again. Your verified details carry over, and each new
            proposal gets its own reference.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            Nothing from an earlier proposal is shared with anyone in a new one.
          </p>
        </div>
      }
    >
      <h1 className="t-h1">Have you used this portal before?</h1>
      <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
        We ask so that nobody ends up with two profiles.
      </p>

      <ul className="mt-8 space-y-3">
        {choices.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                className="group flex items-center gap-4 rounded-card bg-surface p-5 shadow-card ring-1 ring-line/70 transition-shadow hover:ring-ink/40"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sunken text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold">{c.title}</span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{c.body}</span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-[13.5px] leading-relaxed text-muted">
        Looking for counselling as a married couple instead?{" "}
        <Link href="/counselling" className="font-medium text-ink underline decoration-line-strong underline-offset-4">
          Request counselling
        </Link>
      </p>
    </AuthShell>
  );
}
