import clsx from "clsx";
import {
  BellRing,
  CalendarClock,
  FileCheck2,
  IdCard,
  MapPin,
  MessageSquareWarning,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ButtonLink } from "@/components/ui";
import { CandidateTable } from "./candidate-table";
import { candidates, metrics } from "./data";

export const metadata: Metadata = { title: "Overview" };

const user = { name: "Sis. Ngozi Okafor", firstName: "Ngozi", subtitle: "Counsellor, Ikeja Zone" };

type Attention = {
  id: string;
  icon: typeof IdCard;
  title: string;
  who: string;
  meta: string;
  action: string;
  href: string;
  urgent?: boolean;
};

const attention: { group: string; items: Attention[] }[] = [
  {
    group: "Overdue",
    items: [
      {
        id: "a1",
        href: "/staff/candidates/c4",
        icon: BellRing,
        title: "Pastor's introduction outstanding",
        who: "Emeka Nwosu",
        meta: "Pastor John Ojo, link sent 9 days ago, 2 reminders",
        action: "Send reminder",
        urgent: true,
      },
    ],
  },
  {
    group: "To review",
    items: [
      {
        id: "a2",
        href: "/staff/candidates/c1",
        icon: IdCard,
        title: "Identity document",
        who: "Chiamaka Eze",
        meta: "National ID card, uploaded 2 hours ago",
        action: "Review",
      },
      {
        id: "a3",
        href: "/staff/candidates/c2",
        icon: FileCheck2,
        title: "Consent letter, version 2",
        who: "Daniel Okoro",
        meta: "Re-uploaded 5 hours ago",
        action: "Review",
      },
    ],
  },
  {
    group: "To schedule",
    items: [
      {
        id: "a4",
        href: "/staff/candidates/c3",
        icon: CalendarClock,
        title: "Appointment request",
        who: "Funke Adebayo",
        meta: "3 preferred times, in person",
        action: "Confirm a time",
      },
    ],
  },
  {
    group: "Follow up",
    items: [
      {
        id: "a5",
        href: "/staff/candidates/c6",
        icon: MessageSquareWarning,
        title: "Pastor unable to confirm membership",
        who: "Ifeoma Chukwu",
        meta: "Pastor Michael Ade (Zonal), 3 days ago",
        action: "Open case",
      },
    ],
  },
];

const upcoming = [
  {
    day: "Thu 16",
    time: "11:00",
    title: "Counselling, session 2",
    who: "Kunle Ajayi and Bisi Martins",
    where: "Ikeja Zone Family Office",
    icon: MapPin,
  },
  {
    day: "Thu 23",
    time: "10:00",
    title: "First appointment",
    who: "Tunde Bakare",
    where: "Ikeja Zone Family Office",
    icon: MapPin,
  },
];

function Aside() {
  const total = attention.reduce((n, g) => n + g.items.length, 0);
  return (
    <div className="space-y-8">
      <section aria-labelledby="attention-heading">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="attention-heading" className="t-h2">
              Needs your attention
            </h2>
            <p className="mt-1 text-[13px] text-muted">{total} items, oldest first</p>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {attention.map((g) => (
            <div key={g.group}>
              <h3 className={clsx("mb-2 text-[12.5px] font-medium", g.group === "Overdue" ? "text-bad" : "text-muted")}>
                {g.group}
              </h3>
              <ul className="space-y-2">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.id}
                      className={clsx(
                        "rounded-[14px] bg-surface p-3.5 ring-1",
                        item.urgent ? "ring-bad/30" : "ring-line/70",
                      )}
                    >
                      <div className="flex gap-3">
                        <span
                          className={clsx(
                            "flex size-8 shrink-0 items-center justify-center rounded-full",
                            item.urgent ? "bg-bad-soft text-bad" : "bg-sunken text-ink-2",
                          )}
                        >
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13.5px] font-medium leading-snug">{item.title}</p>
                          <p className="mt-0.5 text-[13px] text-ink-2">{item.who}</p>
                          <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{item.meta}</p>
                          <ButtonLink
                            href={item.href}
                            size="sm"
                            variant={item.urgent ? "primary" : "secondary"}
                            className="mt-3"
                          >
                            {item.action}
                          </ButtonLink>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="today-heading">
        <div className="flex items-baseline justify-between">
          <h2 id="today-heading" className="t-h3">
            Coming up
          </h2>
          <Link
            href="/staff/appointments"
            className="text-[13px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink"
          >
            All appointments
          </Link>
        </div>
        <ol className="mt-3 space-y-2">
          {upcoming.map((a) => {
            const Icon = a.icon;
            return (
              <li key={a.day + a.time} className="flex gap-3 rounded-[14px] bg-sunken/70 p-3">
                <span className="w-14 shrink-0 pt-px tabular-nums">
                  <span className="block text-[12.5px] text-muted">{a.day}</span>
                  <span className="block text-[14px] font-semibold">{a.time}</span>
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium">{a.title}</p>
                  <p className="text-[13px] text-ink-2">{a.who}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-muted">
                    <Icon className="size-3.5" aria-hidden />
                    {a.where}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

export default function StaffOverview() {
  return (
    <AppShell user={user} variant="staff" aside={<Aside />}>
      <div className="mx-auto max-w-[920px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-surface px-3 text-[12.5px] text-ink-2 ring-1 ring-line">
            <MapPin className="size-3.5 text-muted" aria-hidden />
            Ikeja Zone, Lagos Area
          </span>
          <span className="text-[12.5px] text-muted">Wednesday 15 October</span>
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="t-h1">Good afternoon, {user.firstName}</h1>
            <p className="mt-2 max-w-[56ch] text-[15.5px] leading-relaxed text-ink-2">
              Five items need you and one is overdue. Your next session is tomorrow at 11:00.
            </p>
          </div>
        </div>

        {/* Counts: one panel, eight cells */}
        <section aria-label="Caseload summary" className="mt-7 overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line/70">
          <ul className="grid grid-cols-2 gap-px bg-line/80 sm:grid-cols-4">
            {metrics.map((m) => (
              <li key={m.label} className="bg-surface">
                <Link
                  href={m.href}
                  className="flex h-full flex-col px-4 py-3 transition-colors hover:bg-frame/70 sm:px-5 sm:py-4"
                >
                  <span className="text-[12.5px] leading-snug text-muted">{m.label}</span>
                  <span className="mt-1.5 text-[24px] leading-none font-semibold tracking-[-0.02em] tabular-nums sm:mt-2 sm:text-[28px]">
                    {m.value}
                  </span>
                  {m.note && (
                    <span
                      className={clsx(
                        "mt-1.5 text-[12px]",
                        m.tone === "bad" ? "font-medium text-bad" : "text-muted",
                      )}
                    >
                      {m.note}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6">
          <CandidateTable rows={candidates} />
        </div>

        <p className="mt-6 max-w-[70ch] text-[13px] leading-relaxed text-muted">
          You can see candidates routed to Ikeja Zone. To hand a case to the central office, open it
          and choose Escalate.
        </p>
      </div>
    </AppShell>
  );
}
