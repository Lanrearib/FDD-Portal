"use client";

import clsx from "clsx";
import { CalendarClock, MapPin, Phone, Plus, Trash2, Video } from "lucide-react";
import { useState } from "react";
import { Field, Input, Select, Textarea } from "@/components/form";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast";
import { Avatar, Button, ButtonLink, Card, StatusPill } from "@/components/ui";

type Mode = "In person" | "Video call" | "Phone call";
const modeIcon: Record<Mode, typeof MapPin> = { "In person": MapPin, "Video call": Video, "Phone call": Phone };

interface Booking {
  id: string;
  day: string;
  time: string;
  kind: string;
  who: string[];
  mode: Mode;
  caseHref: string;
  status: "Scheduled" | "Rescheduled" | "Cancelled";
}

interface Slot {
  id: string;
  day: string;
  time: string;
  mode: Mode;
  bookedBy?: string;
}

const initialBookings: Booking[] = [
  { id: "b1", day: "Thursday 16 October", time: "11:00 to 12:15", kind: "Counselling, session 2", who: ["Kunle Ajayi", "Bisi Martins"], mode: "In person", caseHref: "/staff/cases/pc-0102", status: "Scheduled" },
  { id: "b2", day: "Thursday 23 October", time: "10:00 to 10:45", kind: "First appointment", who: ["Tunde Bakare"], mode: "In person", caseHref: "/staff/candidates/c5", status: "Scheduled" },
];

const initialSlots: Slot[] = [
  { id: "s1", day: "Mon 20 Oct", time: "09:00", mode: "In person" },
  { id: "s2", day: "Mon 20 Oct", time: "10:00", mode: "In person" },
  { id: "s3", day: "Tue 21 Oct", time: "14:00", mode: "Video call" },
  { id: "s4", day: "Wed 22 Oct", time: "11:00", mode: "In person" },
  { id: "s9", day: "Thu 23 Oct", time: "10:00", mode: "In person", bookedBy: "Tunde Bakare" },
  { id: "s5", day: "Fri 24 Oct", time: "15:00", mode: "Phone call" },
  { id: "s6", day: "Mon 27 Oct", time: "09:30", mode: "In person" },
  { id: "s7", day: "Tue 28 Oct", time: "16:00", mode: "Video call" },
  { id: "s8", day: "Tue 28 Oct", time: "17:00", mode: "Video call" },
];

type Tab = "requests" | "upcoming" | "availability";

export function AppointmentsView() {
  const [tab, setTab] = useState<Tab>("requests");
  const [bookings, setBookings] = useState(initialBookings);
  const [slots, setSlots] = useState(initialSlots);
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [reason, setReason] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ date: "", time: "09:00", mode: "In person" as Mode });
  const [error, setError] = useState<string | null>(null);
  const { toast, toastNode } = useToast();

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "requests", label: "Requests", count: 1 },
    { key: "upcoming", label: "Upcoming", count: bookings.filter((b) => b.status !== "Cancelled").length },
    { key: "availability", label: "Your open times", count: slots.filter((s) => !s.bookedBy).length },
  ];
  const days = [...new Set(slots.map((s) => s.day))];

  return (
    <div className="mx-auto max-w-[1000px]">
      <h1 className="t-h1">Appointments</h1>
      <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
        First appointments and counselling sessions for Ikeja Zone. Candidates book your open times themselves, or send
        preferred times for you to confirm.
      </p>

      <div role="tablist" aria-label="Appointments" className="mt-8 flex gap-6 overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            id={`tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`panel-${t.key}`}
            onClick={() => setTab(t.key)}
            className={clsx("-mb-px flex shrink-0 items-center gap-1.5 border-b-2 pb-3 text-[14px] transition-colors", tab === t.key ? "border-ink font-semibold" : "border-transparent text-muted hover:text-ink")}
          >
            {t.label}
            <span className="text-[12px] font-normal text-faint tabular-nums">{t.count}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-6">
        {tab === "requests" && (
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name="Funke Adebayo" size={44} />
              <div className="min-w-[200px] flex-1">
                <p className="text-[15px] font-semibold">Funke Adebayo</p>
                <p className="text-[13px] text-muted">First appointment, in person. Requested yesterday at 18:20.</p>
              </div>
              <StatusPill tone="action">Requested</StatusPill>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {["Mon 20 Oct, morning", "Tue 21 Oct, afternoon", "Fri 24 Oct, morning"].map((p) => (
                <li key={p} className="rounded-full bg-sunken px-3 py-1.5 text-[13px]">
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink href="/staff/candidates/c3" className="mt-5">
              <CalendarClock className="size-4" aria-hidden />
              Confirm a time
            </ButtonLink>
            <p className="mt-4 text-[13px] text-muted">A request isn’t a booking. Funke sees “Requested” until you confirm.</p>
          </Card>
        )}

        {tab === "upcoming" && (
          <ul className="space-y-3">
            {bookings.map((b) => {
              const Icon = modeIcon[b.mode];
              const cancelled = b.status === "Cancelled";
              return (
                <li key={b.id}>
                  <Card className={clsx("p-5 sm:p-6", cancelled && "opacity-60")}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] text-muted">{b.day}</p>
                        <p className="text-[17px] font-semibold tabular-nums">{b.time}</p>
                      </div>
                      <StatusPill tone={cancelled ? "neutral" : "info"}>{b.status}</StatusPill>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
                      <span className="font-medium">{b.kind}</span>
                      <span className="flex items-center gap-2">
                        <span className="flex -space-x-2">
                          {b.who.map((w) => (
                            <Avatar key={w} name={w} size={24} />
                          ))}
                        </span>
                        {b.who.join(" and ")}
                      </span>
                      <span className="flex items-center gap-1.5 text-ink-2">
                        <Icon className="size-3.5 text-muted" aria-hidden />
                        {b.mode}
                      </span>
                    </div>
                    {!cancelled && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        <ButtonLink href={b.caseHref} variant="secondary" size="sm">
                          Open case
                        </ButtonLink>
                        <Button variant="ghost" size="sm" onClick={() => { setReason(""); setError(null); setCancelling(b); }}>
                          Cancel appointment
                        </Button>
                      </div>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}

        {tab === "availability" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-[56ch] text-[14px] text-ink-2">Candidates in Ikeja Zone see these times when they book a first appointment.</p>
              <Button onClick={() => { setDraft({ date: "", time: "09:00", mode: "In person" }); setError(null); setAdding(true); }}>
                <Plus className="size-4" aria-hidden />
                Add open time
              </Button>
            </div>
            <div className="mt-5 space-y-3">
              {days.map((d) => (
                <Card key={d} className="p-4 sm:px-5">
                  <div className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-center">
                    <p className="text-[14px] font-medium">{d}</p>
                    <ul className="flex flex-wrap gap-2">
                      {slots
                        .filter((s) => s.day === d)
                        .map((s) => {
                          const Icon = modeIcon[s.mode];
                          return (
                            <li key={s.id} className={clsx("flex h-10 items-center gap-2 rounded-full pr-1.5 pl-3.5 text-[13.5px] ring-1", s.bookedBy ? "bg-info-soft text-info ring-info/20" : "bg-surface ring-line-strong")}>
                              <span className="font-medium tabular-nums">{s.time}</span>
                              <Icon className="size-3.5 opacity-70" aria-hidden />
                              <span className="sr-only">{s.mode}</span>
                              {s.bookedBy ? (
                                <span className="pr-2 text-[12.5px]">Booked by {s.bookedBy}</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const before = slots;
                                    setSlots((x) => x.filter((y) => y.id !== s.id));
                                    toast(`Removed ${s.day}, ${s.time}.`, { label: "Undo", onClick: () => setSlots(before) });
                                  }}
                                  className="flex size-7 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-bad"
                                  aria-label={`Remove ${s.day} at ${s.time}`}
                                >
                                  <Trash2 className="size-3.5" aria-hidden />
                                </button>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        title="Cancel this appointment?"
        description={cancelling ? `${cancelling.who.join(" and ")} will be emailed, and asked to choose a new time.` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelling(null)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (reason.trim().length < 10) return setError("A reason is required.");
                setBookings((bs) => bs.map((b) => (b.id === cancelling!.id ? { ...b, status: "Cancelled" } : b)));
                toast("Appointment cancelled. The candidate has been emailed.");
                setCancelling(null);
              }}
            >
              Cancel appointment
            </Button>
          </>
        }
      >
        <Field label="Reason" hint="Shared with the candidate." error={error}>
          <Textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError(null); }} />
        </Field>
      </Modal>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add an open time"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!draft.date) return setError("Choose a date.");
                const day = new Date(draft.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
                setSlots((x) => [...x, { id: `n${Date.now()}`, day, time: draft.time, mode: draft.mode }]);
                setAdding(false);
                toast(`${day} at ${draft.time} is now open for booking.`);
              }}
            >
              Add time
            </Button>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date" error={error} className="sm:col-span-2">
            <Input type="date" min="2026-10-16" value={draft.date} onChange={(e) => { setDraft((d) => ({ ...d, date: e.target.value })); setError(null); }} />
          </Field>
          <Field label="Start time">
            <Select value={draft.time} onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}>
              {["09:00", "09:30", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="How you’ll meet">
            <Select value={draft.mode} onChange={(e) => setDraft((d) => ({ ...d, mode: e.target.value as Mode }))}>
              {(Object.keys(modeIcon) as Mode[]).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </Field>
        </div>
        <p className="mt-4 text-[13px] text-muted">
          In-person times use your office: Ikeja Zone Family Office, 14 Allen Avenue.
        </p>
      </Modal>
      {toastNode}
    </div>
  );
}
