"use client";

import clsx from "clsx";
import { Compass, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/*
  Prototype-only navigation for design review: jump straight to any screen.
  Remove before launch.
*/

const groups: { title: string; screens: { href: string; label: string }[] }[] = [
  {
    title: "Public",
    screens: [
      { href: "/", label: "Landing page" },
      { href: "/start", label: "First time or returning" },
      { href: "/register", label: "Registration" },
      { href: "/verify-email?email=tunde.bakare@example.com", label: "Verify email" },
      { href: "/login", label: "Sign in" },
      { href: "/recover", label: "Reset password" },
      { href: "/counselling", label: "Couple counselling request" },
      { href: "/bereavement", label: "Bereavement support request" },
      { href: "/this-page-does-not-exist", label: "Page not found" },
    ],
  },
  {
    title: "Candidate personas",
    screens: [
      { href: "/portal/as/new", label: "Femi: just registered" },
      { href: "/portal/as/tunde", label: "Tunde: letter returned" },
      { href: "/portal/as/daniel", label: "Daniel: share intention" },
      { href: "/portal/as/zainab", label: "Zainab: respond to proposal" },
      { href: "/portal/as/kunle", label: "Kunle: in counselling" },
    ],
  },
  {
    title: "Candidate pages",
    screens: [
      { href: "/portal/identity", label: "Verify identity" },
      { href: "/portal/documents", label: "Documents" },
      { href: "/portal/appointment", label: "Appointments" },
      { href: "/portal/proposal", label: "Proposal" },
      { href: "/portal/counselling", label: "Counselling" },
      { href: "/portal/messages", label: "Messages" },
      { href: "/portal/profile", label: "Profile" },
      { href: "/portal/history", label: "History" },
      { href: "/portal/new-proposal?preview=1", label: "New proposal (returning)" },
    ],
  },
  {
    title: "Pastor link",
    screens: [
      { href: "/assess/demo", label: "Introduce a candidate" },
      { href: "/assess/submitted", label: "Already submitted" },
      { href: "/assess/expired", label: "Expired link" },
      { href: "/assess/replaced", label: "Replaced link" },
      { href: "/assess/not-a-real-token", label: "Invalid link" },
    ],
  },
  {
    title: "Counsellor",
    screens: [
      { href: "/staff/login", label: "Staff sign in" },
      { href: "/staff", label: "Overview (Ikeja Zone)" },
      { href: "/staff/candidates", label: "All candidates" },
      { href: "/staff/candidates/c1", label: "Case: identity review" },
      { href: "/staff/candidates/c2", label: "Case: consent letter review" },
      { href: "/staff/candidates/c3", label: "Case: appointment request" },
      { href: "/staff/candidates/c4", label: "Case: Pastor overdue" },
      { href: "/staff/candidates/c6", label: "Case: Pastor unable to confirm" },
      { href: "/staff/candidates/c7", label: "Case: counselling sessions" },
      { href: "/staff/candidates/c9", label: "Case: email not verified" },
      { href: "/staff/cases", label: "Proposal cases" },
      { href: "/staff/cases/pc-0044", label: "Case closed: rejected by sister" },
      { href: "/staff/appointments", label: "Appointments" },
      { href: "/staff/messages", label: "Messages" },
      { href: "/staff/support", label: "Support requests" },
      { href: "/staff/reports", label: "Reports (Ikeja Zone)" },
    ],
  },
  {
    title: "Central office",
    screens: [
      { href: "/central", label: "Overview (all Areas)" },
      { href: "/central/counsellors", label: "Counsellors and Zones" },
      { href: "/central/pastors", label: "Pastor directory" },
      { href: "/central/reports", label: "Reports" },
      { href: "/central/audit", label: "Audit log" },
      { href: "/central/settings", label: "Settings" },
    ],
  },
  {
    title: "Leadership",
    screens: [{ href: "/leadership", label: "At a glance (totals only)" }],
  },
];

export function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => !panelRef.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-4 left-[68px] z-[60] lg:right-4 lg:left-auto print:hidden">
      {open && (
        <div
          id="demo-panel"
          className="animate-rise absolute bottom-14 left-0 lg:right-0 lg:left-auto max-h-[70dvh] w-[270px] overflow-y-auto scroll-thin rounded-card bg-surface p-2 shadow-pop ring-1 ring-line"
        >
          <p className="px-3 pt-2 pb-1 text-[12.5px] text-muted">Prototype screens</p>
          {groups.map((g) => (
            <div key={g.title} className="py-1">
              <p className="px-3 pt-2 pb-1 text-[13px] font-semibold">{g.title}</p>
              <ul>
                {g.screens.map((s) => {
                  const active = pathname === s.href.split("?")[0];
                  return (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={clsx(
                          "block rounded-[10px] px-3 py-2 text-[13.5px]",
                          active ? "bg-sunken font-medium" : "text-ink-2 hover:bg-sunken hover:text-ink",
                        )}
                      >
                        {s.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="demo-panel"
        aria-label="Prototype screens"
        className="flex size-11 items-center justify-center gap-2 rounded-full bg-surface text-[13.5px] font-medium shadow-pop ring-1 ring-line hover:bg-sunken sm:w-auto sm:px-4"
      >
        {open ? <X className="size-4" aria-hidden /> : <Compass className="size-4" aria-hidden />}
        <span className="hidden sm:inline" aria-hidden>
          Screens
        </span>
      </button>
    </div>
  );
}
