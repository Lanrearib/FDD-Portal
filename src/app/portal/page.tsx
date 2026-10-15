import clsx from "clsx";
import {
  CalendarDays,
  Check,
  CircleAlert,
  Clock,
  FileText,
  HeartHandshake,
  IdCard,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Reply,
  ShieldCheck,
  Upload,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MobileProgress, PortalFrame } from "@/components/portal/portal-frame";
import { Avatar, ButtonLink, Card, StatusPill } from "@/components/ui";
import { getPersona } from "@/lib/portal";
import type { AppointmentView, Check as CheckRow, NextAction, Update } from "@/lib/portal-data";

export const metadata: Metadata = { title: "Home" };

const actionIcons = { upload: Upload, reply: Reply, calendar: CalendarDays, heart: HeartHandshake, id: IdCard };
const updateIcons = { alert: CircleAlert, calendar: CalendarDays, file: FileText, shield: ShieldCheck, mail: Mail, heart: HeartHandshake, check: Check };
const toneIcon = {
  bad: "bg-bad-soft text-bad",
  info: "bg-info-soft text-info",
  ok: "bg-ok-soft text-ok",
  neutral: "bg-sunken text-ink-2",
};
const stripTone: Partial<Record<NextAction["tone"], string>> = {
  bad: "bg-bad-soft/60",
  action: "bg-peach-soft/70",
  info: "bg-info-soft/60",
};

function NextActionCard({ next }: { next: NextAction }) {
  const Icon = actionIcons[next.primary.icon];
  return (
    <Card className="animate-rise mt-7 overflow-hidden">
      <div className={clsx("border-b border-line/80 px-5 py-3 sm:px-6", stripTone[next.tone] ?? "bg-sunken/60")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusPill tone={next.tone}>{next.status}</StatusPill>
          {next.due && (
            <p className="text-[12.5px] text-ink-2">
              Due <span className="font-semibold text-ink">{next.due}</span>
            </p>
          )}
        </div>
      </div>
      <div className="px-5 pt-5 pb-6 sm:px-6">
        <h2 className="t-h2">{next.title}</h2>
        <p className="mt-1.5 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">{next.body}</p>

        {next.quote && (
          <figure className="mt-5 rounded-[14px] bg-sunken/70 p-4">
            <blockquote className="text-[14.5px] leading-relaxed text-ink">“{next.quote.text}”</blockquote>
            <figcaption className="mt-3 flex items-center gap-2.5 text-[12.5px] text-muted">
              <Avatar name={next.quote.author} size={24} />
              <span>
                <span className="font-medium text-ink-2">{next.quote.author}</span>, your counsellor, on {next.quote.when}
              </span>
            </figcaption>
          </figure>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink href={next.primary.href} size="lg">
            <Icon className="size-4" aria-hidden />
            {next.primary.label}
          </ButtonLink>
          {next.secondary && (
            <ButtonLink href={next.secondary.href} variant="secondary" size="lg">
              {next.secondary.href === "/portal/messages" && <MessageCircle className="size-4" aria-hidden />}
              {next.secondary.label}
            </ButtonLink>
          )}
        </div>
        {next.footnote && <p className="mt-4 text-[13px] leading-relaxed text-muted">{next.footnote}</p>}
      </div>
    </Card>
  );
}

function AppointmentCard({ appointment }: { appointment: AppointmentView | null }) {
  if (!appointment) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="t-h3">First appointment</h2>
          <StatusPill tone="neutral">Not yet</StatusPill>
        </div>
        <div className="mt-5 flex items-start gap-4">
          <span className="flex size-[58px] shrink-0 items-center justify-center rounded-[14px] border border-dashed border-line-strong text-faint">
            <Lock className="size-5" aria-hidden />
          </span>
          <p className="text-[14px] leading-relaxed text-ink-2">
            You’ll book this with your Zone’s counsellor once your identity and your Pastor’s introduction
            are confirmed.
          </p>
        </div>
      </Card>
    );
  }
  const statusPill = {
    required: { tone: "action" as const, label: "Appointment Required" },
    requested: { tone: "wait" as const, label: "Requested" },
    scheduled: { tone: "info" as const, label: "Scheduled" },
    completed: { tone: "ok" as const, label: "Completed" },
  }[appointment.status];
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="t-h3">{appointment.kind}</h2>
        <StatusPill tone={statusPill.tone}>{statusPill.label}</StatusPill>
      </div>
      <div className="mt-5 flex items-start gap-4">
        <div
          className={clsx(
            "flex w-[58px] shrink-0 flex-col items-center rounded-[14px] py-2",
            appointment.status === "completed" ? "bg-sunken text-ink" : "bg-ink text-white",
          )}
        >
          <span className="text-[11.5px] opacity-70">{appointment.month}</span>
          <span className="text-[24px] leading-none font-semibold tabular-nums">{appointment.day}</span>
          <span className="mt-0.5 text-[11.5px] opacity-70">{appointment.weekday}</span>
        </div>
        <div className="min-w-0 text-[14px] leading-relaxed">
          <p className="font-medium">
            {appointment.time}, {appointment.mode?.toLowerCase()}
          </p>
          {appointment.location && (
            <p className="mt-0.5 flex items-start gap-1.5 text-ink-2">
              <MapPin className="mt-[3px] size-3.5 shrink-0 text-muted" aria-hidden />
              {appointment.location}
            </p>
          )}
          <p className="mt-0.5 text-muted">with {appointment.with}</p>
        </div>
      </div>
      {appointment.status !== "completed" && (
        <div className="mt-5 flex gap-2">
          <ButtonLink href="/portal/appointment" variant="secondary" size="sm">
            View details
          </ButtonLink>
        </div>
      )}
    </Card>
  );
}

function ChecksCard({ checks, overall }: { checks: CheckRow[]; overall: { label: string; tone: NextAction["tone"] } }) {
  const allDone = checks.every((c) => c.state === "done");
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="t-h3">Validation</h2>
        <StatusPill tone={allDone ? "ok" : overall.tone}>{allDone ? "All checks passed" : "In progress"}</StatusPill>
      </div>
      <ul className="mt-4 divide-y divide-line/80">
        {checks.map((row) => (
          <li key={row.label} className="flex items-center gap-3 py-2.5">
            <span
              className={clsx(
                "flex size-6 shrink-0 items-center justify-center rounded-full",
                row.state === "done" ? "bg-ok-soft text-ok" : row.state === "action" ? "bg-peach-soft text-[#a4472a]" : "bg-wait-soft text-wait",
              )}
            >
              {row.state === "done" ? (
                <Check className="size-3.5" strokeWidth={2.75} aria-hidden />
              ) : row.state === "action" ? (
                <CircleAlert className="size-3.5" aria-hidden />
              ) : (
                <Clock className="size-3.5" aria-hidden />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium">{row.label}</p>
              <p className="truncate text-[12.5px] text-muted">{row.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Updates({ updates }: { updates: Update[] }) {
  return (
    <section className="mt-10" aria-labelledby="updates-heading">
      <div className="flex items-baseline justify-between">
        <h2 id="updates-heading" className="t-h2">
          Recent updates
        </h2>
        <Link href="/portal/history" className="text-[13px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
          See all
        </Link>
      </div>
      <ol className="mt-4 space-y-1">
        {updates.map((u) => {
          const Icon = updateIcons[u.icon];
          return (
            <li key={u.title + u.when} className="flex gap-3.5 rounded-[14px] px-2 py-3">
              <span className={clsx("flex size-9 shrink-0 items-center justify-center rounded-full", toneIcon[u.tone])}>
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-[14.5px] font-medium">{u.title}</p>
                  <p className="text-[12.5px] text-muted tabular-nums">{u.when}</p>
                </div>
                <p className="mt-0.5 text-[13.5px] text-ink-2">{u.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default async function PortalHome() {
  const p = await getPersona();
  const done = p.stages.filter((s) => s.state === "done").length;
  const needsYou = p.next.tone === "action" || p.next.tone === "bad";

  return (
    <PortalFrame persona={p}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-7 items-center rounded-full bg-surface px-3 text-[12.5px] text-ink-2 ring-1 ring-line">
          Proposal <span className="ml-1 font-semibold text-ink tabular-nums">{p.proposalRef}</span>
        </span>
        <StatusPill tone={p.overallStatus.tone}>{p.overallStatus.label}</StatusPill>
      </div>

      <h1 className="t-h1 mt-5">Good afternoon, {p.firstName}</h1>
      <p className="mt-2 max-w-[56ch] text-[15.5px] leading-relaxed text-ink-2">
        {done} of {p.stages.length} stages {done === 1 ? "is" : "are"} complete.{" "}
        {needsYou ? "One thing needs you before your journey can move on." : "Nothing needs you right now. Here’s what’s coming up."}
      </p>

      <MobileProgress />
      <NextActionCard next={p.next} />

      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-1 min-[1180px]:grid-cols-2">
        <AppointmentCard appointment={p.appointment} />
        <ChecksCard checks={p.checks} overall={p.overallStatus} />
      </div>

      <Updates updates={p.updates} />
    </PortalFrame>
  );
}
