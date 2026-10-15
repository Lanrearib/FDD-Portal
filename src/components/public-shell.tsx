"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./brand";
import { ButtonLink } from "./ui";

const links = [
  { href: "/#marriage", label: "Marriage process" },
  { href: "/counselling", label: "Counselling" },
  { href: "/bereavement", label: "Bereavement support" },
  { href: "/#resources", label: "Resources" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-frame/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[72px]">
        <Link href="/" aria-label="Family Development home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-[14px] text-ink-2 transition-colors hover:bg-surface hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/login" variant="ghost">
            Sign in
          </ButtonLink>
          <ButtonLink href="/start">Start the marriage process</ButtonLink>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex size-10 items-center justify-center rounded-full bg-surface ring-1 ring-line lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="public-menu"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>
      <div
        id="public-menu"
        className={clsx("border-t border-line/70 bg-frame px-4 pt-3 pb-5 lg:hidden", !open && "hidden")}
      >
        <ul className="space-y-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-[12px] px-3 py-3 text-[15px] hover:bg-surface"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2">
          <ButtonLink href="/start" size="lg" onClick={() => setOpen(false)}>
            Start the marriage process
          </ButtonLink>
          <ButtonLink href="/login" size="lg" variant="secondary" onClick={() => setOpen(false)}>
            Sign in
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-24 border-t border-line/80">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-muted">
            Supporting brothers, sisters, couples and grieving families across West and Central Africa.
          </p>
        </div>
        <div>
          <h2 className="text-[13.5px] font-semibold">Services</h2>
          <ul className="mt-3 space-y-2 text-[14px] text-ink-2">
            <li><Link className="hover:text-ink" href="/start">Marriage process</Link></li>
            <li><Link className="hover:text-ink" href="/counselling">Counselling for couples</Link></li>
            <li><Link className="hover:text-ink" href="/bereavement">Bereavement support</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[13.5px] font-semibold">Your account</h2>
          <ul className="mt-3 space-y-2 text-[14px] text-ink-2">
            <li><Link className="hover:text-ink" href="/login">Sign in</Link></li>
            <li><Link className="hover:text-ink" href="/recover">Reset your password</Link></li>
            <li><Link className="hover:text-ink" href="/staff/login">Staff sign in</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[13.5px] font-semibold">Department office</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
            Monday to Friday, 9:00 to 17:00
            <br />
            family@example.org
          </p>
        </div>
      </div>
      <div className="border-t border-line/80">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-[12.5px] text-muted sm:px-6">
          <p>Content on this site is approved by the Family Development Department.</p>
          <Link href="/privacy" className="underline decoration-line-strong underline-offset-4 hover:text-ink">
            Privacy notice
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <PublicHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
