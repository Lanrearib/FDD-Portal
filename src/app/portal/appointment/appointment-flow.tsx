"use client";

import clsx from "clsx";
import { CalendarCheck, CalendarDays, Check, Clock, LifeBuoy, Lock, MapPin, Phone, Plus, Trash2, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Field, Select, Textarea } from "@/components/form";
import { Avatar, Button, ButtonLink, Card, StatusPill } from "@/components/ui";
import type { AppointmentView, Persona } from "@/lib/portal-data";
import { useStageUpdate } from "@/components/portal/stage-context";

type Mode = "in_person" | "video" | "phone";

const modeMeta: Record<Mode, { label: string; icon: typeof MapPin }> = {
  in_person: { label: "In person", icon: MapPin },
  video: { label: "Video call", icon: Video },
  phone: { label: "Phone call", icon: Phone },
};

const slots: { id: string; day: string; date: string; time: string; mode: Mode }[] = [
  { id: "s1", day: "Mon", date: "20 Oct", time: "09:00", mode: "in_person" },
  { id: "s2", day: "Mon", date: "20 Oct", time: "10:00", mode: "in_person" },
  { id: "s3", day: "Tue", date: "21 Oct", time: "14:00", mode: "video" },
  { id: "s4", day: "Wed", date: "22 Oct", time: "11:00", mode: "in_person" },
  { id: "s5", day: "Fri", date: "24 Oct", time: "15:00", mode: "phone" },
  { id: "s6", day: "Mon", date: "27 Oct", time: "09:30", mode: "in_person" },
  { id: "s7", day: "Tue", date: "28 Oct", time: "16:00", mode: "video" },
  { id: "s8", day: "Tue", date: "28 Oct", time: "17:00", mode: "video" },
];

type View = "summary" | "book" | "request" | "requested" | "help";

function CounsellorCard({ persona }: { persona: Persona }) {
  return (
    <div className="flex items-center gap-3.5 rounded-card bg-surface p-4 ring-1 ring-line/80">
      <Avatar name={persona.counsellor.name} size={44} />
      <div className="min-w-0">
        <p className="text-[12.5px] text-muted">Your counsellor for {persona.zone}</p>
        <p className="text-[15px] font-semibold">{persona.counsellor.name}</p>
        <p className="text-[13px] text-ink-2">
          {persona.counsellor.office}, {persona.counsellor.address}
        </p>
      </div>
    </div>
  );
}

/** Builds an iCalendar timestamp from the booked day, month and start time (Lagos time, UTC+1). */
function icsStamp(a: AppointmentView, addMinutes: number) {
  const [hh, mm] = (a.time?.match(/\d{1,2}:\d{2}/)?.[0] ?? "09:00").split(":").map(Number);
  const d = new Date(`${a.day} ${a.month} 2026 ${hh}:${mm} GMT+0100`);
  d.setMinutes(d.getMinutes() + addMinutes);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function Booked({ a, onReschedule, rescheduled }: { a: AppointmentView; onReschedule?: () => void; rescheduled?: boolean }) {
  const done = a.status === "completed";
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="t-h2">{a.kind}</h2>
        <StatusPill tone={done ? "ok" : "info"}>{done ? "Completed" : rescheduled ? "Rescheduled" : "Scheduled"}</StatusPill>
      </div>
      <div className="mt-5 flex items-start gap-4">
        <div className={clsx("flex w-[64px] shrink-0 flex-col items-center rounded-[14px] py-2.5", done ? "bg-sunken" : "bg-ink text-white")}>
          <span className="text-[12px] opacity-70">{a.month}</span>
          <span className="text-[28px] leading-none font-semibold tabular-nums">{a.day}</span>
          <span className="mt-0.5 text-[12px] opacity-70">{a.weekday}</span>
        </div>
        <dl className="min-w-0 space-y-1.5 text-[14.5px]">
          <div className="flex gap-2">
            <dt className="sr-only">When</dt>
            <Clock className="mt-[3px] size-4 shrink-0 text-muted" aria-hidden />
            <dd>
              {a.dateLabel}, {a.time}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="sr-only">Where</dt>
            <MapPin className="mt-[3px] size-4 shrink-0 text-muted" aria-hidden />
            <dd>
              {a.mode}
              {a.location ? `, ${a.location}` : ""}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="sr-only">With</dt>
            <CalendarCheck className="mt-[3px] size-4 shrink-0 text-muted" aria-hidden />
            <dd>With {a.with}</dd>
          </div>
        </dl>
      </div>
      {a.note && !done && <p className="mt-5 rounded-[14px] bg-sunken/70 p-3.5 text-[13.5px] text-ink-2">{a.note}</p>}
      {!done && onReschedule && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              const ics = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "BEGIN:VEVENT",
                `SUMMARY:${a.kind} with ${a.with}`,
                `LOCATION:${a.location ?? a.mode}`,
                `DTSTART:${icsStamp(a, 0)}`,
                `DTEND:${icsStamp(a, 45)}`,
                "END:VEVENT",
                "END:VCALENDAR",
              ].join("\r\n");
              const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
              const link = Object.assign(document.createElement("a"), { href: url, download: "appointment.ics" });
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            <CalendarDays className="size-4" aria-hidden />
            Add to calendar
          </Button>
          <Button variant="ghost" onClick={onReschedule}>
            Change time
          </Button>
        </div>
      )}
    </Card>
  );
}

export function AppointmentFlow({ persona }: { persona: Persona }) {
  const a = persona.appointment;
  const updateStage = useStageUpdate();
  const [view, setView] = useState<View>(a?.status === "required" ? "book" : "summary");
  const [booked, setBooked] = useState<AppointmentView | null>(a);
  const [rescheduled, setRescheduled] = useState(false);
  const [mode, setMode] = useState<Mode | "all">("all");
  const [picked, setPicked] = useState<string | null>(null);
  const [prefs, setPrefs] = useState([{ date: "", part: "Morning" }]);
  const [prefMode, setPrefMode] = useState<Mode>("in_person");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!a) {
    return (
      <Card className="mt-7 p-6">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed border-line-strong text-faint">
            <Lock className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="t-h2">Not open yet</h2>
            <p className="mt-2 max-w-[56ch] text-[14.5px] leading-relaxed text-ink-2">
              Your first appointment opens when your identity and your Pastor’s introduction have both been
              confirmed. You’ll then pick a time with {persona.counsellor.name}, the counsellor for {persona.zone}.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const visible = slots.filter((s) => mode === "all" || s.mode === mode);
  const days = [...new Set(visible.map((s) => `${s.day} ${s.date}`))];
  const pickedSlot = slots.find((s) => s.id === picked);

  if (view === "book") {
    return (
      <div className="mt-7 space-y-6">
        <CounsellorCard persona={persona} />
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="t-h2">Choose a time</h2>
            <div role="radiogroup" aria-label="How you’d like to meet" className="flex flex-wrap gap-1.5">
              {(["all", "in_person", "video", "phone"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className={clsx(
                    "h-8 rounded-full px-3 text-[13px] font-medium transition-colors",
                    mode === m ? "bg-ink text-white" : "text-ink-2 ring-1 ring-line hover:bg-sunken",
                  )}
                >
                  {m === "all" ? "Any" : modeMeta[m].label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {days.map((d) => (
              <div key={d} className="grid gap-2 sm:grid-cols-[110px_1fr] sm:items-center">
                <p className="text-[14px] font-medium">{d}</p>
                <div className="flex flex-wrap gap-2">
                  {visible
                    .filter((s) => `${s.day} ${s.date}` === d)
                    .map((s) => {
                      const Icon = modeMeta[s.mode].icon;
                      const on = picked === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setPicked(s.id)}
                          className={clsx(
                            "flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-medium ring-1 transition-colors",
                            on ? "bg-ink text-white ring-ink" : "bg-surface ring-line-strong hover:ring-ink/40",
                          )}
                        >
                          <span className="tabular-nums">{s.time}</span>
                          <Icon className={clsx("size-3.5", on ? "text-white/70" : "text-muted")} aria-hidden />
                          <span className="sr-only">{modeMeta[s.mode].label}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
            {days.length === 0 && (
              <p className="rounded-[14px] bg-sunken/70 p-4 text-[14px] text-ink-2">
                No {mode !== "all" && modeMeta[mode].label.toLowerCase()} times are open. Try another option, or
                send your preferred times.
              </p>
            )}
          </div>
        </div>

        {pickedSlot && (
          <Card className="animate-rise flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-[13px] text-muted">You’ve chosen</p>
              <p className="text-[16px] font-semibold">
                {pickedSlot.day} {pickedSlot.date} at {pickedSlot.time}, {modeMeta[pickedSlot.mode].label.toLowerCase()}
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => {
                const [dd, mon] = pickedSlot.date.split(" ");
                setBooked({
                  ...a,
                  status: "scheduled",
                  day: dd,
                  month: mon,
                  weekday: pickedSlot.day,
                  dateLabel: `${pickedSlot.day} ${pickedSlot.date}`,
                  time: pickedSlot.time,
                  mode: modeMeta[pickedSlot.mode].label,
                  location: pickedSlot.mode === "in_person" ? `${persona.counsellor.office}, ${persona.counsellor.address}` : undefined,
                });
                setRescheduled(a.status === "scheduled");
                updateStage("appointment", {
                  state: "waiting",
                  status: a.status === "scheduled" ? "Rescheduled" : "Appointment Scheduled",
                  detail: `${pickedSlot.day} ${pickedSlot.date} at ${pickedSlot.time} with ${persona.counsellor.name}`,
                });
                setPicked(null);
                setView("summary");
              }}
            >
              <Check className="size-4" strokeWidth={2.5} aria-hidden />
              Book this time
            </Button>
          </Card>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line/80 pt-5 text-[14px]">
          <button type="button" onClick={() => setView("request")} className="font-medium underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            None of these times work
          </button>
          <button type="button" onClick={() => setView("help")} className="font-medium underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            Ask for help
          </button>
          {booked && (
            <button type="button" onClick={() => setView("summary")} className="text-ink-2 hover:text-ink">
              Keep my current time
            </button>
          )}
        </div>
      </div>
    );
  }

  if (view === "request") {
    return (
      <form
        noValidate
        className="mt-7 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!prefs.some((p) => p.date)) return setError("Add at least one date that suits you.");
          setView("requested");
        }}
      >
        <CounsellorCard persona={persona} />
        <div>
          <h2 className="t-h2">Tell us when suits you</h2>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">
            Give up to three options. {persona.counsellor.name} will confirm one, or suggest another.
          </p>
        </div>
        <div className="space-y-3">
          {prefs.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
              <Field label={`Option ${i + 1}: date`} error={i === 0 ? error : undefined}>
                <input
                  type="date"
                  min="2026-10-16"
                  value={p.date}
                  onChange={(e) => {
                    setError(null);
                    setPrefs((x) => x.map((y, j) => (j === i ? { ...y, date: e.target.value } : y)));
                  }}
                  className="h-12 w-full rounded-field bg-surface px-4 text-[15px] ring-1 ring-line-strong focus:ring-2 focus:ring-ink focus:outline-none aria-invalid:ring-2 aria-invalid:ring-bad"
                />
              </Field>
              <Field label="Time of day">
                <Select value={p.part} onChange={(e) => setPrefs((x) => x.map((y, j) => (j === i ? { ...y, part: e.target.value } : y)))}>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </Select>
              </Field>
              {prefs.length > 1 ? (
                <Button variant="ghost" size="icon" aria-label={`Remove option ${i + 1}`} onClick={() => setPrefs((x) => x.filter((_, j) => j !== i))}>
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              ) : (
                <span className="w-10" />
              )}
            </div>
          ))}
          {prefs.length < 3 && (
            <Button variant="ghost" size="sm" onClick={() => setPrefs((x) => [...x, { date: "", part: "Morning" }])}>
              <Plus className="size-4" aria-hidden />
              Add another option
            </Button>
          )}
        </div>
        <Field label="How would you like to meet?">
          <Select value={prefMode} onChange={(e) => setPrefMode(e.target.value as Mode)}>
            {(Object.keys(modeMeta) as Mode[]).map((m) => (
              <option key={m} value={m}>
                {modeMeta[m].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Anything your counsellor should know?" optional>
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg">
            Send my preferred times
          </Button>
          <Button variant="ghost" size="lg" onClick={() => setView("book")}>
            Back to available times
          </Button>
        </div>
      </form>
    );
  }

  if (view === "requested" || view === "help") {
    const help = view === "help";
    return (
      <Card className="animate-rise mt-7 p-6">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-wait-soft text-wait">
            {help ? <LifeBuoy className="size-5" aria-hidden /> : <Clock className="size-5" aria-hidden />}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="t-h2">{help ? "We’ll be in touch" : "Request sent"}</h2>
              <StatusPill tone="wait">{help ? "Help requested" : "Requested"}</StatusPill>
            </div>
            <p className="mt-2 max-w-[56ch] text-[14.5px] leading-relaxed text-ink-2">
              {help
                ? `${persona.counsellor.name} has been told you need help finding a time. If they’re unavailable, the central office will arrange it with you.`
                : `${persona.counsellor.name} will confirm a time with you, usually within two working days. Your appointment isn’t booked until you see it marked Scheduled here.`}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <ButtonLink href="/portal" variant="secondary">
                Back to Home
              </ButtonLink>
              <Button variant="ghost" onClick={() => setView("book")}>
                See available times again
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // summary
  return (
    <div className="mt-7 space-y-5">
      {booked && <Booked a={booked} rescheduled={rescheduled} onReschedule={booked.status === "scheduled" && booked.kind === "First appointment" ? () => setView("book") : undefined} />}
      {booked?.kind !== "First appointment" && (
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="t-h3">First appointment</h2>
            <StatusPill tone="ok">Completed</StatusPill>
          </div>
          <p className="mt-2 text-[14px] text-ink-2">Held with {persona.counsellor.name}.</p>
        </Card>
      )}
      {persona.sessions ? (
        <p className="text-[14px] text-ink-2">
          Counselling sessions are arranged by your counsellor.{" "}
          <Link href="/portal/counselling" className="font-medium text-ink underline decoration-line-strong underline-offset-4">
            See your counselling plan
          </Link>
        </p>
      ) : (
        booked?.status === "completed" && (
          <p className="text-[14px] leading-relaxed text-muted">
            Later counselling sessions are arranged by your counsellor once a proposal is accepted.
          </p>
        )
      )}
    </div>
  );
}
