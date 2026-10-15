"use client";

import clsx from "clsx";
import {
  ArrowUpRight,
  BellRing,
  CalendarCheck,
  Check,
  Clock,
  Eye,
  FileText,
  Link2,
  Mail,
  RotateCcw,
  Send,
  UserRoundCog,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { PastorPicker } from "@/app/register/register-wizard";
import type { StageView } from "@/components/journey-path";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/form";
import { Modal } from "@/components/modal";
import { Avatar, Button, Card, StatusPill, type Tone } from "@/components/ui";
import { pastorById } from "@/lib/reference";
import type { CaseRecord, Panel, Session } from "./case-data";

export interface Action {
  log: string;
  detail?: string;
  toast: string;
  stages?: { key: string; patch: Partial<StageView> }[];
  message?: string;
  validation?: { label: string; tone: Tone };
}

type Act = (a: Action) => void;

/* ---------- shared bits ---------- */

function PanelCard({
  status,
  tone,
  meta,
  title,
  intro,
  children,
}: {
  status: string;
  tone: Tone;
  meta?: ReactNode;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  const strip: Partial<Record<Tone, string>> = {
    action: "from-peach-soft/80",
    bad: "from-bad-soft/70",
    wait: "from-wait-soft/80",
    info: "from-info-soft/80",
    ok: "from-ok-soft/80",
  };
  return (
    <Card className="animate-rise mt-7 overflow-hidden">
      <div className={clsx("flex flex-wrap items-center justify-between gap-2 border-b border-line/80 bg-gradient-to-r to-transparent px-5 py-3 sm:px-6", strip[tone] ?? "from-sunken")}>
        <StatusPill tone={tone}>{status}</StatusPill>
        {meta && <p className="text-[12.5px] text-ink-2">{meta}</p>}
      </div>
      <div className="px-5 pt-5 pb-6 sm:px-6">
        <h2 className="t-h2">{title}</h2>
        {intro && <div className="mt-1.5 max-w-[62ch] text-[14.5px] leading-relaxed text-ink-2">{intro}</div>}
        {children}
      </div>
    </Card>
  );
}

function Resolved({ tone, icon, title, body }: { tone: "ok" | "bad" | "info" | "wait"; icon: ReactNode; title: string; body: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, []);
  const bg = { ok: "bg-ok-soft text-ok", bad: "bg-bad-soft text-bad", info: "bg-info-soft text-info", wait: "bg-wait-soft text-wait" }[tone];
  return (
    <Card className="animate-rise mt-7 p-5 sm:p-6">
      <div ref={ref} className="flex gap-4">
        <span className={clsx("flex size-10 shrink-0 items-center justify-center rounded-full", bg)}>{icon}</span>
        <div className="min-w-0">
          <h2 className="t-h2">{title}</h2>
          <div className="mt-1.5 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">{body}</div>
          <p className="mt-3 text-[13px] text-muted">Recorded in the case history with your name and the time.</p>
        </div>
      </div>
    </Card>
  );
}

/** Reason chips plus a message to the candidate; used whenever something is returned. */
function ReturnForm({
  firstName,
  reasons,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  firstName: string;
  reasons: { label: string; message: string }[];
  onCancel: () => void;
  onSubmit: (reason: string, message: string) => void;
  submitLabel: string;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const groupId = useId();
  const msgId = useId();
  return (
    <div className="animate-rise mt-6 rounded-[14px] ring-1 ring-line">
      <div className="p-4 sm:p-5">
        <p id={groupId} className="text-[14px] font-medium">
          Why is it being returned?
        </p>
        <div role="radiogroup" aria-labelledby={groupId} className="mt-3 flex flex-wrap gap-2">
          {reasons.map((r) => (
            <button
              key={r.label}
              type="button"
              role="radio"
              aria-checked={reason === r.label}
              onClick={() => {
                setReason(r.label);
                setError(null);
                setMessage(`Hello ${firstName}, thank you for sending this. ${r.message}`.trim());
              }}
              className={clsx(
                "h-9 rounded-full px-3.5 text-[13.5px] transition-colors",
                reason === r.label ? "bg-ink text-white" : "bg-surface text-ink-2 ring-1 ring-line-strong hover:bg-sunken",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <label htmlFor={msgId} className="mt-5 block text-[14px] font-medium">
          Message to {firstName}
        </label>
        <p className="mt-0.5 text-[12.5px] text-muted">Sent by email and shown in their portal.</p>
        <textarea
          id={msgId}
          rows={4}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setError(null);
          }}
          placeholder="Choose a reason to start with a suggested message."
          className="mt-2 w-full resize-y rounded-field bg-frame px-3.5 py-3 text-[14px] leading-relaxed ring-1 ring-line placeholder:text-faint focus:bg-surface focus:ring-ink focus:outline-none"
        />
        {error && (
          <p role="alert" className="mt-2 text-[13px] font-medium text-bad">
            {error}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line/80 bg-frame/60 px-4 py-3 sm:px-5">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (!reason) return setError(`Choose a reason. ${firstName} will see it.`);
            if (message.trim().length < 20) return setError(`Add a short message telling ${firstName} what to change.`);
            onSubmit(reason, message.trim());
          }}
        >
          <Send className="size-4" aria-hidden />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

function DocThumb({ kind, label }: { kind: "letter" | "card"; label: string }) {
  return (
    <figure className="min-w-0">
      <div
        aria-hidden
        className={clsx(
          "relative w-full overflow-hidden rounded-[10px] bg-surface shadow-card ring-1 ring-line",
          kind === "letter" ? "aspect-[3/4]" : "aspect-[1.58]",
        )}
      >
        {kind === "letter" ? (
          <div className="absolute inset-0 px-[14%] py-[12%]">
            <div className="h-[5%] w-[45%] rounded-sm bg-ink/70" />
            <div className="mt-[10%] space-y-[6%]">
              {[92, 100, 96, 88, 100, 70, 100, 84].map((w, i) => (
                <div key={i} className="h-[2.4%] min-h-[3px] rounded-full bg-line-strong" style={{ width: `${w}%` }} />
              ))}
            </div>
            <svg viewBox="0 0 120 40" className="mt-[12%] w-[52%] text-ink/70">
              <path d="M4 28c10-14 18-20 22-12s-6 18 2 14 14-22 22-18-4 20 6 16 16-14 24-10 10 8 34-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
        ) : (
          <div className="absolute inset-0 flex gap-[6%] bg-gradient-to-br from-[#e8f0ea] to-[#dfe7f3] p-[7%]">
            <div className="h-full w-[30%] rounded-[6px] bg-gradient-to-b from-[#c9b8a8] to-[#9d8676]" />
            <div className="flex-1 space-y-[9%] pt-[4%]">
              {[80, 60, 90, 50, 70].map((w, i) => (
                <div key={i} className="h-[7%] rounded-full bg-ink/25" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <figcaption className="mt-1.5 flex items-center gap-1 text-[12.5px] font-medium text-ink-2">
        {label}
        <ArrowUpRight className="size-3.5" aria-hidden />
      </figcaption>
    </figure>
  );
}

/* ---------- Reminder modal (PRD §9.2) ---------- */

export function ReminderModal({
  open,
  onClose,
  recipient,
  task,
  count,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  recipient: string;
  task: string;
  count?: { sent: number; max: number };
  onSend: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Remind ${recipient}`}
      description="Sent using the department’s approved wording. If the task is completed before it goes out, it won’t be sent."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSend(note.trim());
              setNote("");
            }}
          >
            <BellRing className="size-4" aria-hidden />
            Send reminder
          </Button>
        </>
      }
    >
      <div className="rounded-[14px] bg-sunken/70 p-4 text-[14px] leading-relaxed">
        <p className="text-[12.5px] text-muted">Approved template: outstanding task</p>
        <p className="mt-2">
          Hello {recipient}, this is a gentle reminder from the Family Development Department. When you can, please{" "}
          {task.charAt(0).toLowerCase() + task.slice(1)}. Thank you.
        </p>
      </div>
      <Field label="Add a personal note" optional className="mt-5">
        <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      {count && (
        <p className="mt-4 text-[13px] text-muted">
          This will be reminder {count.sent + 1} of {count.max} for this task.
        </p>
      )}
    </Modal>
  );
}

/* ---------- Identity review ---------- */

function IdentityReview({ record, panel, act }: { record: CaseRecord; panel: Extract<Panel, { kind: "identity_review" }>; act: Act }) {
  const [checks, setChecks] = useState([false, false, false, false]);
  const [returning, setReturning] = useState(false);
  const [done, setDone] = useState<null | { ok: boolean; reason?: string }>(null);
  const allChecked = checks.every(Boolean);
  const labels = ["The photo is clear and shows the whole document", "The name matches the profile", "The date of birth matches the profile", "The document hasn’t expired"];

  if (done)
    return done.ok ? (
      <Resolved tone="ok" icon={<Check className="size-5" strokeWidth={2.5} aria-hidden />} title="Identity verified" body={`${record.firstName} has been emailed. Their identity check is complete.`} />
    ) : (
      <Resolved tone="bad" icon={<RotateCcw className="size-5" aria-hidden />} title="Identity document returned" body={`${record.firstName} has been asked for a new upload. Reason recorded: ${done.reason?.toLowerCase()}.`} />
    );

  return (
    <PanelCard status="Pending Counsellor Review" tone="action" meta={<>Uploaded <span className="font-semibold text-ink">{panel.uploaded}</span></>} title={`Verify ${record.firstName}’s identity`} intro="Compare the document with the profile. Your decision is recorded, and the document is visible only to counsellors.">
      <div className="mt-5 grid grid-cols-2 gap-4 sm:max-w-[420px]">
        {panel.files.map((f, i) => (
          <DocThumb key={f} kind="card" label={i === 0 ? "Front" : "Back"} />
        ))}
      </div>

      <table className="mt-6 w-full text-left text-[14px]">
        <caption className="sr-only">Document details compared with the profile</caption>
        <thead>
          <tr className="text-[12.5px] text-muted">
            <th className="pb-2 font-normal" scope="col"><span className="sr-only">Field</span></th>
            <th className="pb-2 font-normal" scope="col">On the document</th>
            <th className="pb-2 font-normal" scope="col">On the profile</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/80 border-y border-line/80">
          <tr>
            <th scope="row" className="py-2.5 pr-3 font-normal text-muted">Name</th>
            <td className="py-2.5 pr-3">{panel.onDocument.name}</td>
            <td className="py-2.5">{panel.onProfile.name}</td>
          </tr>
          <tr>
            <th scope="row" className="py-2.5 pr-3 font-normal text-muted">Date of birth</th>
            <td className="py-2.5 pr-3">{panel.onDocument.dob}</td>
            <td className="py-2.5">{panel.onProfile.dob}</td>
          </tr>
          <tr>
            <th scope="row" className="py-2.5 pr-3 font-normal text-muted">Expires</th>
            <td className="py-2.5 pr-3">{panel.onDocument.expires}</td>
            <td className="py-2.5 text-muted">{panel.docType}</td>
          </tr>
        </tbody>
      </table>

      <fieldset className="mt-5 space-y-3">
        <legend className="mb-3 text-[14px] font-medium">Before you verify</legend>
        {labels.map((l, i) => (
          <Checkbox key={l} label={l} checked={checks[i]} onChange={(v) => setChecks((c) => c.map((x, j) => (j === i ? v : x)))} />
        ))}
      </fieldset>

      {!returning ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            disabled={!allChecked}
            onClick={() => {
              setDone({ ok: true });
              act({
                log: "Verified identity document",
                detail: `${panel.docType}.`,
                toast: `Identity verified. ${record.firstName} has been emailed.`,
                stages: [{ key: "identity", patch: { state: "done", status: "Completed", detail: `${panel.docType} verified today` } }],
                // Validation needs every gate (FR-06): move to the next outstanding one.
                validation: record.stages.find((st) => st.key === "pastor")?.state === "done"
                  ? { label: "Validated", tone: "ok" }
                  : { label: "Pastor Assessment Pending", tone: "wait" },
              });
            }}
          >
            <Check className="size-4" strokeWidth={2.5} aria-hidden />
            Verify identity
          </Button>
          <Button size="lg" variant="secondary" onClick={() => setReturning(true)}>
            <RotateCcw className="size-4" aria-hidden />
            Return for correction
          </Button>
          {!allChecked && <p className="text-[13px] text-muted">Tick all four checks to verify.</p>}
        </div>
      ) : (
        <ReturnForm
          firstName={record.firstName}
          submitLabel="Return document"
          onCancel={() => setReturning(false)}
          reasons={[
            { label: "Blurry or cut off", message: "The photo is hard to read. Please upload a clear photo showing the whole document." },
            { label: "Name doesn’t match", message: "The name on the document doesn’t match your profile. Please message me so we can sort it out." },
            { label: "Expired", message: "The document has expired. Please upload a current photo ID." },
            { label: "Not an accepted ID", message: "Please upload a passport, national ID card, driver’s licence or voter’s card." },
          ]}
          onSubmit={(reason, message) => {
            setDone({ ok: false, reason });
            act({
              log: "Returned identity document",
              detail: `Reason: ${reason.toLowerCase()}.`,
              toast: `Document returned. ${record.firstName} has been emailed.`,
              message,
              stages: [{ key: "identity", patch: { state: "returned", status: "Returned for Correction", detail: `Returned today: ${reason.toLowerCase()}` } }],
            });
          }}
        />
      )}
    </PanelCard>
  );
}

/* ---------- Consent review ---------- */

function ConsentReview({ record, panel, act }: { record: CaseRecord; panel: Extract<Panel, { kind: "consent_review" }>; act: Act }) {
  const [returning, setReturning] = useState(false);
  const [done, setDone] = useState<null | { ok: boolean; reason?: string }>(null);

  if (done)
    return done.ok ? (
      <Resolved tone="ok" icon={<Check className="size-5" strokeWidth={2.5} aria-hidden />} title="Consent letter accepted" body={`${record.firstName} has been emailed and can now formally share his intention with the sister.`} />
    ) : (
      <Resolved tone="bad" icon={<RotateCcw className="size-5" aria-hidden />} title="Consent letter returned" body={`${record.firstName} has been emailed your message and asked for a new copy. Reason recorded: ${done.reason?.toLowerCase()}.`} />
    );

  return (
    <PanelCard status="Pending Counsellor Review" tone="action" meta={<>Uploaded <span className="font-semibold text-ink">{panel.uploaded}</span></>} title={`Review consent letter, version ${panel.version}`} intro={`Check that it is signed by a parent or guardian, dated, and names ${record.firstName}. Accepting unlocks the next stage.`}>
      <div className="mt-5 grid grid-cols-[92px_minmax(0,1fr)] gap-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
        <DocThumb kind="letter" label="Open" />
        <div className="min-w-0 space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <div className="min-w-0 text-[13.5px]">
              <p className="truncate font-medium">{panel.fileName}</p>
              <p className="text-muted">{panel.fileSize}</p>
            </div>
          </div>
          {panel.candidateNote && (
            <figure className="rounded-[14px] bg-sunken/70 p-3.5">
              <blockquote className="text-[14px] leading-relaxed">“{panel.candidateNote}”</blockquote>
              <figcaption className="mt-2 flex items-center gap-2 text-[12.5px] text-muted">
                <Avatar name={record.name} size={22} />
                {record.name}, with the upload
              </figcaption>
            </figure>
          )}
          {panel.previous.map((p) => (
            <p key={p.version} className="flex items-start gap-3 text-[13px] text-ink-2">
              <RotateCcw className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
              <span>
                Version {p.version} was returned on {p.uploaded}. <span className="text-muted">{p.reason}</span>
              </span>
            </p>
          ))}
        </div>
      </div>
      {!returning ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            size="lg"
            onClick={() => {
              setDone({ ok: true });
              act({
                log: `Accepted consent letter, version ${panel.version}`,
                toast: `Letter accepted. ${record.firstName} has been emailed.`,
                stages: [
                  { key: "consent", patch: { state: "done", status: "Completed", detail: `Version ${panel.version} accepted today` } },
                  { key: "intention", patch: { state: "waiting", status: "Awaiting Candidate", detail: `${record.firstName} can now share his intention` } },
                ],
              });
            }}
          >
            <Check className="size-4" strokeWidth={2.5} aria-hidden />
            Accept letter
          </Button>
          <Button size="lg" variant="secondary" onClick={() => setReturning(true)}>
            <RotateCcw className="size-4" aria-hidden />
            Return for correction
          </Button>
        </div>
      ) : (
        <ReturnForm
          firstName={record.firstName}
          submitLabel="Return letter"
          onCancel={() => setReturning(false)}
          reasons={[
            { label: "Missing signature", message: "Before I can accept it, the letter needs to be signed by your parent or guardian. A clear photo of the signed page is fine." },
            { label: "Not dated", message: "Before I can accept it, the letter needs the date it was written." },
            { label: "Hard to read", message: "Parts of the letter are hard to read. Please upload a clearer scan or photo." },
            { label: "Wrong document", message: "The file you uploaded isn’t a parental consent letter. Please check and upload the letter." },
            { label: "Something else", message: "" },
          ]}
          onSubmit={(reason, message) => {
            setDone({ ok: false, reason });
            act({
              log: `Returned consent letter, version ${panel.version}`,
              detail: `Reason: ${reason.toLowerCase()}.`,
              toast: `Letter returned. ${record.firstName} has been emailed.`,
              message,
              stages: [{ key: "consent", patch: { state: "returned", status: "Returned for Correction", detail: `Returned today: ${reason.toLowerCase()}` } }],
            });
          }}
        />
      )}
    </PanelCard>
  );
}

/* ---------- Appointment request ---------- */

function AppointmentRequest({ record, panel, act }: { record: CaseRecord; panel: Extract<Panel, { kind: "appointment_request" }>; act: Act }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [time, setTime] = useState("");
  const [mode, setMode] = useState(panel.mode);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const times = { Morning: ["09:00", "10:00", "11:00"], Afternoon: ["13:00", "14:00", "15:00"], Evening: ["17:00", "18:00"] } as Record<string, string[]>;

  if (done)
    return <Resolved tone="info" icon={<CalendarCheck className="size-5" aria-hidden />} title="Appointment confirmed" body={`${done}. ${record.firstName} has been emailed the details and can add it to their calendar.`} />;

  return (
    <PanelCard status="Appointment Requested" tone="action" meta={<>Requested <span className="font-semibold text-ink">{panel.requested}</span></>} title={`Confirm ${record.firstName}’s first appointment`} intro="None of your open times suited them, so they’ve sent preferred times. Pick one and set the exact time.">
      {panel.note && (
        <figure className="mt-5 rounded-[14px] bg-sunken/70 p-3.5">
          <blockquote className="text-[14px] leading-relaxed">“{panel.note}”</blockquote>
          <figcaption className="mt-2 flex items-center gap-2 text-[12.5px] text-muted">
            <Avatar name={record.name} size={22} />
            {record.name}
          </figcaption>
        </figure>
      )}
      <fieldset className="mt-5">
        <legend className="text-[14px] font-medium">Preferred times, in person unless changed</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {panel.preferred.map((p, i) => (
            <label
              key={p.date}
              className={clsx(
                "cursor-pointer rounded-[14px] bg-surface p-3.5 ring-1 transition-shadow has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink",
                choice === i ? "ring-2 ring-ink" : "ring-line-strong hover:ring-ink/40",
              )}
            >
              <input type="radio" name="pref" className="sr-only" checked={choice === i} onChange={() => { setChoice(i); setTime(""); setError(null); }} />
              <span className="block text-[12.5px] text-muted">Option {i + 1}</span>
              <span className="block text-[15px] font-semibold">{p.date}</span>
              <span className="block text-[13px] text-ink-2">{p.part}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {choice !== null && (
        <div className="animate-rise mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Start time" error={error}>
            <Select value={time} onChange={(e) => { setTime(e.target.value); setError(null); }}>
              <option value="">Choose a time</option>
              {times[panel.preferred[choice].part].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="How you’ll meet">
            <Select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option>In person</option>
              <option>Video call</option>
              <option>Phone call</option>
            </Select>
          </Field>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          size="lg"
          disabled={choice === null}
          onClick={() => {
            if (!time) return setError("Choose a start time.");
            const when = `${panel.preferred[choice!].date} at ${time}, ${mode.toLowerCase()}`;
            setDone(`Booked for ${when}`);
            act({
              log: "Confirmed first appointment",
              detail: `${when}.`,
              toast: `Appointment confirmed. ${record.firstName} has been emailed.`,
              stages: [{ key: "appointment", patch: { state: "waiting", status: "Appointment Scheduled", detail: `${panel.preferred[choice!].date}, ${time}` } }],
            });
          }}
        >
          <CalendarCheck className="size-4" aria-hidden />
          Confirm appointment
        </Button>
      </div>
      <p className="mt-4 text-[13px] text-muted">Can’t do any of these? Message {record.firstName} with another time from the Messages tab.</p>
    </PanelCard>
  );
}

/* ---------- Pastor pending ---------- */

function ReissueModal({ open, onClose, pastor, onConfirm }: { open: boolean; onClose: () => void; pastor: string; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send a new introduction link"
      description={`The current link stops working straight away, and ${pastor} gets a new one that lasts 14 days.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => (reason ? onConfirm(reason) : setError("Choose a reason."))}>
            <Link2 className="size-4" aria-hidden />
            Send new link
          </Button>
        </>
      }
    >
      <Field label="Reason" error={error}>
        <Select value={reason} onChange={(e) => { setReason(e.target.value); setError(null); }}>
          <option value="">Choose a reason</option>
          <option>The link is about to expire</option>
          <option>The Pastor couldn’t find the email</option>
          <option>The Pastor’s email address was updated</option>
          <option>Another reason</option>
        </Select>
      </Field>
    </Modal>
  );
}

export function ReassignPastorModal({
  open,
  onClose,
  current,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  current: string;
  onConfirm: (pastorName: string, reason: string) => void;
}) {
  const [pastorId, setPastorId] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ pastor?: string; reason?: string }>({});
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Reassign the Pastor"
      description={`${current} stays on the record. The new Pastor gets a fresh introduction link, and the old link stops working.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const e = { pastor: pastorId ? undefined : "Choose a Pastor from the directory.", reason: reason.trim().length >= 10 ? undefined : "Explain why, in a sentence." };
              setErrors(e);
              if (e.pastor || e.reason) return;
              onConfirm(pastorById(pastorId)!.name, reason.trim());
            }}
          >
            <UserRoundCog className="size-4" aria-hidden />
            Reassign and send link
          </Button>
        </>
      }
    >
      <PastorPicker zoneId="ikeja" value={pastorId} onChange={(id) => { setPastorId(id); setErrors((x) => ({ ...x, pastor: undefined })); }} error={errors.pastor} />
      <Field label="Reason for reassigning" className="mt-5" error={errors.reason}>
        <Textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setErrors((x) => ({ ...x, reason: undefined })); }} placeholder="For example, the Pastor is travelling until next month" />
      </Field>
    </Modal>
  );
}

function PastorPending({ record, panel, act }: { record: CaseRecord; panel: Extract<Panel, { kind: "pastor_pending" }>; act: Act }) {
  const [modal, setModal] = useState<null | "remind" | "reissue" | "reassign">(null);
  const [reminders, setReminders] = useState(panel.reminders);
  const [pastor, setPastor] = useState(panel.pastor);
  const [events, setEvents] = useState<{ label: string; when: string; icon: typeof Mail; tone?: string }[]>([
    { label: `Link sent to ${panel.pastor}`, when: panel.sent, icon: Mail },
    ...(panel.opened ? [{ label: "Opened and email verified, not yet submitted", when: panel.opened, icon: Eye }] : []),
    ...panel.reminderDates.map((when, i) => ({ label: `Automatic reminder ${i + 1}`, when, icon: BellRing })),
  ]);

  return (
    <PanelCard status={`Overdue by ${panel.overdueDays} days`} tone="bad" meta={<>Link expires <span className="font-semibold text-ink">{panel.expires}</span></>} title={`Waiting for ${pastor}`} intro={`${record.firstName} can’t be validated until their Pastor’s introduction is in. You can remind the Pastor, send a fresh link, or reassign to another Pastor.`}>
      <ol className="mt-5 space-y-3">
        {events.map((e, i) => {
          const Icon = e.icon;
          return (
            <li key={i} className="flex items-center gap-3 text-[14px]">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sunken text-ink-2">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="flex-1">{e.label}</span>
              <span className="text-[13px] text-muted tabular-nums">{e.when}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" onClick={() => setModal("remind")} disabled={reminders >= 3}>
          <BellRing className="size-4" aria-hidden />
          Remind {pastor}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => setModal("reissue")}>
          <Link2 className="size-4" aria-hidden />
          Send new link
        </Button>
        <Button size="lg" variant="ghost" onClick={() => setModal("reassign")}>
          <UserRoundCog className="size-4" aria-hidden />
          Reassign Pastor
        </Button>
      </div>
      {reminders >= 3 && <p className="mt-3 text-[13px] text-muted">The maximum of 3 reminders has been sent. Try a new link or reassigning.</p>}

      <ReminderModal
        open={modal === "remind"}
        onClose={() => setModal(null)}
        recipient={pastor}
        task={`complete your introduction of ${record.name}`}
        count={{ sent: reminders, max: 3 }}
        onSend={(note) => {
          setModal(null);
          setReminders((r) => r + 1);
          setEvents((ev) => [...ev, { label: `Reminder ${reminders + 1}, sent by you`, when: "Just now", icon: BellRing }]);
          act({ log: `Sent reminder to ${pastor}`, detail: note ? `Personal note: “${note}”` : `Reminder ${reminders + 1} of 3.`, toast: `Reminder sent to ${pastor}.` });
        }}
      />
      <ReissueModal
        open={modal === "reissue"}
        onClose={() => setModal(null)}
        pastor={pastor}
        onConfirm={(reason) => {
          setModal(null);
          setEvents((ev) => [...ev, { label: "Old link cancelled, new link sent", when: "Just now", icon: Link2 }]);
          act({
            log: `Sent a new introduction link to ${pastor}`,
            detail: `Reason: ${reason.toLowerCase()}. Previous link cancelled.`,
            toast: `New link sent to ${pastor}.`,
            stages: [{ key: "pastor", patch: { detail: "New link sent today" } }],
          });
        }}
      />
      <ReassignPastorModal
        open={modal === "reassign"}
        onClose={() => setModal(null)}
        current={pastor}
        onConfirm={(name, reason) => {
          setModal(null);
          setPastor(name);
          setReminders(0);
          setEvents([{ label: `Link sent to ${name}`, when: "Just now", icon: Mail }]);
          act({
            log: `Reassigned the Pastor to ${name}`,
            detail: `Previously ${pastor}. Reason: ${reason}`,
            toast: `Reassigned. ${name} has been sent a link.`,
            stages: [{ key: "pastor", patch: { detail: `Link sent to ${name} today` } }],
          });
        }}
      />
    </PanelCard>
  );
}

/* ---------- Pastor unable to confirm ---------- */

function PastorUnconfirmed({ record, panel, act }: { record: CaseRecord; panel: Extract<Panel, { kind: "pastor_unconfirmed" }>; act: Act }) {
  const [modal, setModal] = useState<null | "reassign" | "decline">(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<null | { kind: "reassigned"; name: string } | { kind: "declined" }>(null);

  if (done?.kind === "reassigned")
    return <Resolved tone="wait" icon={<UserRoundCog className="size-5" aria-hidden />} title={`Introduction link sent to ${done.name}`} body={`${record.firstName} stays pending until ${done.name} responds. ${panel.pastor}’s answers stay on the record.`} />;
  if (done?.kind === "declined")
    return <Resolved tone="bad" icon={<RotateCcw className="size-5" aria-hidden />} title="Pastoral review recorded as declined" body={`${record.firstName} isn’t validated and has been told to contact the department office. You can reopen this later with a reason.`} />;

  return (
    <PanelCard status="Further Information Required" tone="bad" meta={<>Submitted <span className="font-semibold text-ink">{panel.submitted}</span></>} title={`${panel.pastor} couldn’t confirm ${record.firstName}`} intro={`${record.firstName} can’t be validated on this introduction. Decide how to follow up.`}>
      {panel.standingInFor && (
        <p className="mt-5 rounded-[14px] bg-wait-soft/70 p-3.5 text-[13.5px] leading-relaxed text-ink-2">
          {panel.pastor} is the Zonal Pastor, standing in for {panel.standingInFor.name}. Reason {record.firstName} gave:{" "}
          {panel.standingInFor.reason.toLowerCase()}.
        </p>
      )}
      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        {panel.answers.map((a) => (
          <div key={a.q}>
            <dt className="text-[12.5px] text-muted">{a.q}</dt>
            <dd className="mt-0.5 text-[14.5px] font-medium">{a.a}</dd>
          </div>
        ))}
      </dl>
      <figure className="mt-5 rounded-[14px] bg-sunken/70 p-3.5">
        <blockquote className="text-[14px] leading-relaxed">“{panel.comments}”</blockquote>
        <figcaption className="mt-2 flex items-center gap-2 text-[12.5px] text-muted">
          <Avatar name={panel.pastor} size={22} />
          {panel.pastor}, for the counsellor only
        </figcaption>
      </figure>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" onClick={() => setModal("reassign")}>
          <UserRoundCog className="size-4" aria-hidden />
          Ask another Pastor
        </Button>
        <Button size="lg" variant="ghost" onClick={() => setModal("decline")}>
          Record as declined
        </Button>
      </div>

      <ReassignPastorModal
        open={modal === "reassign"}
        onClose={() => setModal(null)}
        current={panel.pastor}
        onConfirm={(name, why) => {
          setModal(null);
          setDone({ kind: "reassigned", name });
          act({
            log: `Asked ${name} for an introduction`,
            detail: `After ${panel.pastor} was unable to confirm. Reason: ${why}`,
            toast: `Link sent to ${name}.`,
            stages: [{ key: "pastor", patch: { state: "waiting", status: "Pending Pastor", detail: `Link sent to ${name} today` } }],
            validation: { label: "Pastor Assessment Pending", tone: "wait" },
          });
        }}
      />
      <Modal
        open={modal === "decline"}
        onClose={() => setModal(null)}
        title="Record the pastoral review as declined?"
        description={`${record.firstName} won’t be validated. They’ll be told to contact the department office, without seeing the Pastor’s comments.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (reason.trim().length < 10) return setError("A reason is required for this decision.");
                setModal(null);
                setDone({ kind: "declined" });
                act({
                  log: "Recorded pastoral review as declined",
                  detail: `Reason: ${reason.trim()}`,
                  toast: "Decision recorded.",
                  stages: [{ key: "pastor", patch: { state: "returned", status: "Pastoral Review Declined", detail: "Declined today" } }],
                  validation: { label: "Pastoral Review Declined", tone: "bad" },
                });
              }}
            >
              Record as declined
            </Button>
          </>
        }
      >
        <Field label="Reason" hint="Seen only by counsellors." error={error}>
          <Textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError(null); }} />
        </Field>
      </Modal>
    </PanelCard>
  );
}

/* ---------- Counselling sessions ---------- */

function Counselling({ record, panel, act }: { record: CaseRecord; panel: Extract<Panel, { kind: "counselling" }>; act: Act }) {
  const [sessions, setSessions] = useState<Session[]>(panel.sessions);
  const [recording, setRecording] = useState<string | null>(null);
  const [attendance, setAttendance] = useState("");
  const [signOff, setSignOff] = useState(false);
  const [notes, setNotes] = useState("");
  const [scheduling, setScheduling] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("11:00");
  const [error, setError] = useState<string | null>(null);
  const done = sessions.filter((s) => s.status === "completed").length;

  return (
    <PanelCard status="In Progress" tone="info" meta={<>{done} of {sessions.length} signed off</>} title={`Counselling with ${panel.partner.split(" ")[0]}`} intro={<>Shared with {panel.partner} under case {panel.caseRef}. Record each session and sign it off when both have attended.</>}>
      <ol className="mt-5 space-y-2.5">
        {sessions.map((s, i) => (
          <li key={s.id} className="rounded-[14px] bg-surface ring-1 ring-line/80">
            <div className="flex flex-wrap items-center gap-3 p-3.5">
              <span className={clsx("flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold", s.status === "completed" ? "bg-ink text-white" : s.status === "scheduled" ? "bg-info-soft text-info" : "bg-sunken text-muted")}>
                {s.status === "completed" ? <Check className="size-4" strokeWidth={2.75} aria-hidden /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-medium">{s.title}</p>
                <p className="text-[12.5px] text-muted">
                  {s.status === "completed" ? `${s.when}. ${s.attendance}` : s.status === "scheduled" ? (s.upcoming ? `${s.when}. Record the outcome after the session.` : s.when) : "Not yet scheduled"}
                </p>
              </div>
              {s.status === "scheduled" && !s.upcoming && recording !== s.id && (
                <Button size="sm" onClick={() => { setRecording(s.id); setAttendance(""); setSignOff(false); setNotes(""); setError(null); }}>
                  Record outcome
                </Button>
              )}
              {s.status === "scheduled" && s.upcoming && scheduling !== s.id && (
                <Button size="sm" variant="secondary" onClick={() => { setScheduling(s.id); setDate(""); setError(null); }}>
                  Change date
                </Button>
              )}
              {s.status === "not_scheduled" && sessions[i - 1]?.status === "completed" && scheduling !== s.id && (
                <Button size="sm" variant="secondary" onClick={() => { setScheduling(s.id); setDate(""); setError(null); }}>
                  Schedule
                </Button>
              )}
            </div>
            {recording === s.id && (
              <div className="animate-rise space-y-4 border-t border-line/80 p-4">
                <Field label="Attendance" error={error}>
                  <Select value={attendance} onChange={(e) => { setAttendance(e.target.value); setError(null); }}>
                    <option value="">Choose one</option>
                    <option>Both attended</option>
                    <option>Only {record.journey === "Brother" ? record.firstName : panel.partner.split(" ")[0]} attended</option>
                    <option>Only {record.journey === "Brother" ? panel.partner.split(" ")[0] : record.firstName} attended</option>
                    <option>Neither attended (missed)</option>
                  </Select>
                </Field>
                <Field label="Session notes" optional hint="Restricted: only counsellors can read these.">
                  <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </Field>
                <Checkbox checked={signOff} onChange={setSignOff} label="Sign off this session" description="Only sign off when both have attended." />
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (!attendance) return setError("Choose who attended.");
                      if (signOff && attendance !== "Both attended") return setError("A session can only be signed off when both attended.");
                      const missed = attendance.startsWith("Neither");
                      setSessions((ss) =>
                        ss.map((x) =>
                          x.id === s.id
                            ? signOff
                              ? { ...x, status: "completed", attendance: "Both attended, signed off" }
                              : { ...x, status: missed ? "not_scheduled" : "scheduled", when: missed ? undefined : x.when, attendance }
                            : x,
                        ),
                      );
                      setRecording(null);
                      act({
                        log: signOff ? `Signed off session ${i + 1}` : `Recorded session ${i + 1}`,
                        detail: `${attendance}.`,
                        toast: signOff ? `Session ${i + 1} signed off.` : `Session ${i + 1} recorded.`,
                        stages: signOff ? [{ key: "counselling", patch: { detail: `Session ${i + 1} of ${sessions.length} signed off` } }] : undefined,
                      });
                    }}
                  >
                    Save
                  </Button>
                  <Button variant="ghost" onClick={() => setRecording(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {scheduling === s.id && (
              <div className="animate-rise grid gap-4 border-t border-line/80 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <Field label="Date" error={error}>
                  <Input type="date" min="2026-10-16" value={date} onChange={(e) => { setDate(e.target.value); setError(null); }} />
                </Field>
                <Field label="Time">
                  <Select value={time} onChange={(e) => setTime(e.target.value)}>
                    {["09:00", "10:00", "11:00", "14:00", "16:00"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Select>
                </Field>
                <Button
                  onClick={() => {
                    if (!date) return setError("Choose a date.");
                    const label = new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
                    setSessions((ss) => ss.map((x) => (x.id === s.id ? { ...x, status: "scheduled", upcoming: true, when: `${label}, ${time}` } : x)));
                    setScheduling(null);
                    act({ log: s.status === "scheduled" ? `Moved session ${i + 1}` : `Scheduled session ${i + 1}`, detail: `${label}, ${time}. Both candidates emailed.`, toast: `Session ${i + 1} ${s.status === "scheduled" ? "moved" : "scheduled"}. Both have been emailed.` });
                  }}
                >
                  Schedule
                </Button>
              </div>
            )}
          </li>
        ))}
      </ol>
    </PanelCard>
  );
}

/* ---------- Email not verified ---------- */

function OtpPending({ record, panel, act }: { record: CaseRecord; panel: Extract<Panel, { kind: "otp_pending" }>; act: Act }) {
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState(panel.email);
  const [draft, setDraft] = useState(panel.email.replace("exmaple", "example"));
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const looksMistyped = /exmaple|gmial|yahooo|\.con$/.test(email);

  return (
    <PanelCard status="OTP Pending" tone="wait" meta={<>Registered <span className="font-semibold text-ink">{panel.registered}</span></>} title={`${record.firstName} hasn’t verified their email`} intro={`${panel.codesSent} codes have been sent to ${email}. Nothing else can start until it’s verified, including the Pastor’s introduction link.`}>
      {looksMistyped && (
        <p className="mt-5 rounded-[14px] bg-wait-soft p-3.5 text-[14px] leading-relaxed text-wait">
          The address may be mistyped: <span className="font-semibold">{email}</span>. If {record.firstName} confirms it by phone, you can correct it.
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" onClick={() => act({ log: "Resent verification code", detail: `To ${email}.`, toast: `New code sent to ${email}.` })}>
          <Send className="size-4" aria-hidden />
          Resend code
        </Button>
        <Button size="lg" variant="secondary" onClick={() => setModal(true)}>
          Correct email address
        </Button>
      </div>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Correct the email address"
        description={`${record.firstName} will still need to enter the code we send to the new address. Only change it after confirming with them directly.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.trim())) return setError("Enter a valid email address.");
                if (reason.trim().length < 10) return setError("Say how you confirmed the new address.");
                setModal(false);
                const old = email;
                setEmail(draft.trim());
                act({ log: "Corrected email address and resent code", detail: `From ${old} to ${draft.trim()}. ${reason.trim()}`, toast: `Email corrected. A new code was sent to ${draft.trim()}.` });
              }}
            >
              Save and send code
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Correct email address">
            <Input type="email" value={draft} onChange={(e) => { setDraft(e.target.value); setError(null); }} />
          </Field>
          <Field label="How did you confirm it?" error={error}>
            <Textarea rows={2} value={reason} onChange={(e) => { setReason(e.target.value); setError(null); }} placeholder="For example, phoned Segun on his registered number" />
          </Field>
        </div>
      </Modal>
    </PanelCard>
  );
}

/* ---------- Waiting on someone else ---------- */

function Waiting({ record, panel, act }: { record: CaseRecord; panel: Extract<Panel, { kind: "waiting" }>; act: Act }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(0);
  return (
    <PanelCard status={`Waiting on ${panel.waitingOn.toLowerCase()}`} tone="wait" meta={<>Since <span className="font-semibold text-ink">{panel.since}</span></>} title={panel.title} intro={panel.body}>
      <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-sunken/70 p-3.5 text-[13.5px] text-ink-2">
        <Clock className="size-4 shrink-0 text-muted" aria-hidden />
        {sent > 0 ? `${sent} reminder${sent > 1 ? "s" : ""} sent by you today.` : panel.reminderNote}
      </div>
      {panel.reminderTask && (
        <div className="mt-6">
          <Button size="lg" variant="secondary" onClick={() => setOpen(true)}>
            <BellRing className="size-4" aria-hidden />
            Send a reminder
          </Button>
        </div>
      )}
      {panel.reminderTask && (
        <ReminderModal
          open={open}
          onClose={() => setOpen(false)}
          recipient={record.firstName}
          task={panel.reminderTask}
          onSend={(note) => {
            setOpen(false);
            setSent((n) => n + 1);
            act({ log: `Sent reminder to ${record.firstName}`, detail: note ? `Personal note: “${note}”` : panel.reminderTask, toast: `Reminder sent to ${record.firstName}.` });
          }}
        />
      )}
    </PanelCard>
  );
}

export function DecisionPanel({ record, act }: { record: CaseRecord; act: Act }) {
  const p = record.panel;
  switch (p.kind) {
    case "identity_review":
      return <IdentityReview record={record} panel={p} act={act} />;
    case "consent_review":
      return <ConsentReview record={record} panel={p} act={act} />;
    case "appointment_request":
      return <AppointmentRequest record={record} panel={p} act={act} />;
    case "pastor_pending":
      return <PastorPending record={record} panel={p} act={act} />;
    case "pastor_unconfirmed":
      return <PastorUnconfirmed record={record} panel={p} act={act} />;
    case "counselling":
      return <Counselling record={record} panel={p} act={act} />;
    case "otp_pending":
      return <OtpPending record={record} panel={p} act={act} />;
    case "waiting":
      return <Waiting record={record} panel={p} act={act} />;
  }
}

