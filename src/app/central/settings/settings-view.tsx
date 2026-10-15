"use client";

import { Pencil } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Field, Input, Select, Switch, Textarea } from "@/components/form";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast";
import { Button, Card, StatusPill } from "@/components/ui";

const defaults = {
  linkExpiryDays: 14,
  pastorEmailCode: true,
  freshIntroduction: true,
  reminderEveryDays: 3,
  maxReminders: 3,
  overdueAfterDays: 7,
  maxFileMb: 5,
  reuseConsent: false,
  reuseIdentity: true,
};

type Settings = typeof defaults;

interface Template {
  id: string;
  name: string;
  audience: string;
  subject: string;
  body: string;
  approved: string;
}

const initialTemplates: Template[] = [
  {
    id: "t1",
    name: "Pastor introduction link",
    audience: "Pastor",
    subject: "Please introduce {candidate_name}",
    body: "Dear {pastor_name},\n\n{candidate_name} has started the church’s marriage process and named you as their Pastor. Please use this private link to introduce them: {link}\n\nThe link expires on {expiry_date}.\n\nFamily Development Department",
    approved: "Approved 2 Sep 2026",
  },
  {
    id: "t2",
    name: "Reminder: outstanding task",
    audience: "Candidate or Pastor",
    subject: "A gentle reminder from the Family Development Department",
    body: "Hello {first_name},\n\nThis is a gentle reminder from the Family Development Department. When you can, please {task}.\n\nThank you.",
    approved: "Approved 2 Sep 2026",
  },
  {
    id: "t3",
    name: "Document returned",
    audience: "Candidate",
    subject: "Your {document} needs a small change",
    body: "Hello {first_name},\n\n{counsellor_message}\n\nYou can upload a new version from your portal.",
    approved: "Approved 2 Sep 2026",
  },
  {
    id: "t4",
    name: "Proposal closed: response received",
    audience: "Brother",
    subject: "An update on your proposal",
    body: "Dear {first_name},\n\nThe sister has given her response, and this proposal is now closed. Your counsellor, {counsellor_name}, will be in touch to talk with you.\n\nYour profile stays open for the future.",
    approved: "Approved 18 Mar 2025",
  },
  {
    id: "t5",
    name: "Appointment confirmed",
    audience: "Candidate",
    subject: "Your appointment is confirmed",
    body: "Hello {first_name},\n\nYour appointment with {counsellor_name} is confirmed for {date} at {time}, {location}.",
    approved: "Approved 2 Sep 2026",
  },
];

const sample: Record<string, string> = {
  candidate_name: "Femi Adeola",
  pastor_name: "Pastor Grace Bello",
  first_name: "Femi",
  link: "https://family.example.org/assess/•••",
  expiry_date: "29 October 2026",
  task: "upload a photo ID",
  document: "consent letter",
  counsellor_message: "Thank you for sending this. The letter needs the date it was written.",
  counsellor_name: "Sis. Ngozi Okafor",
  date: "Thursday 23 October",
  time: "10:00",
  location: "Ikeja Zone Family Office",
};

const fill = (t: string) => t.replace(/\{(\w+)\}/g, (_, k) => sample[k] ?? `{${k}}`);

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="t-h2">{title}</h2>
      <p className="mt-1 max-w-[62ch] text-[14px] text-muted">{description}</p>
      <div className="mt-6 space-y-6">{children}</div>
    </Card>
  );
}

function NumberField({ label, value, onChange, min, max, unit }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; unit: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3">
        <Input id={id} type="number" inputMode="numeric" min={min} max={max} value={value} onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))} className="w-28" />
        <span className="text-[14px] text-muted">{unit}</span>
      </div>
    </div>
  );
}

export function SettingsView() {
  const [saved, setSaved] = useState<Settings>(defaults);
  const [s, setS] = useState<Settings>(defaults);
  const [templates, setTemplates] = useState(initialTemplates);
  const [editing, setEditing] = useState<Template | null>(null);
  const [draft, setDraft] = useState({ subject: "", body: "" });
  const { toast, toastNode } = useToast();
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((x) => ({ ...x, [k]: v }));

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  return (
    <div className="mx-auto max-w-[860px] pb-24">
      <h1 className="t-h1">Settings</h1>
      <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
        Rules that apply across every Area. Changes take effect for new tasks; anything already sent keeps its original
        terms. Every change is recorded in the audit log.
      </p>

      <div className="mt-8 space-y-5">
        <Section title="Pastor introductions" description="How the private introduction link behaves.">
          <NumberField label="Links expire after" value={s.linkExpiryDays} onChange={(n) => set("linkExpiryDays", n)} min={3} max={60} unit="days" />
          <Switch checked={s.pastorEmailCode} onChange={(v) => set("pastorEmailCode", v)} label="Ask Pastors for an email code" description="The Pastor enters a code sent to their email before seeing the questionnaire." />
          <Switch checked={s.freshIntroduction} onChange={(v) => set("freshIntroduction", v)} label="Require a fresh introduction for each proposal" description="When a returning candidate starts a new proposal, their Pastor is asked again." />
        </Section>

        <Section title="Reminders and overdue tasks" description="Automatic reminders stop as soon as a task is done.">
          <div className="grid gap-6 sm:grid-cols-3">
            <NumberField label="Remind every" value={s.reminderEveryDays} onChange={(n) => set("reminderEveryDays", n)} min={1} max={14} unit="days" />
            <NumberField label="At most" value={s.maxReminders} onChange={(n) => set("maxReminders", n)} min={1} max={6} unit="reminders" />
            <NumberField label="Overdue after" value={s.overdueAfterDays} onChange={(n) => set("overdueAfterDays", n)} min={2} max={30} unit="days" />
          </div>
          <p className="rounded-[14px] bg-sunken/70 p-3.5 text-[13.5px] text-ink-2">
            With these settings, an unanswered Pastor link gets reminders on days {Array.from({ length: s.maxReminders }, (_, i) => (i + 1) * s.reminderEveryDays).join(", ")}, and
            shows as overdue from day {s.overdueAfterDays}.
          </p>
        </Section>

        <Section title="Documents and later proposals" description="What candidates can upload, and what carries into a new proposal.">
          <Field label="Largest file allowed">
            <Select value={String(s.maxFileMb)} onChange={(e) => set("maxFileMb", Number(e.target.value))} className="w-40">
              {[2, 5, 10].map((n) => (
                <option key={n} value={n}>
                  {n} MB
                </option>
              ))}
            </Select>
          </Field>
          <p className="text-[13.5px] text-muted">Accepted types: PDF, JPG and PNG.</p>
          <Switch checked={s.reuseIdentity} onChange={(v) => set("reuseIdentity", v)} label="Carry a verified identity into new proposals" description="Returning candidates don’t need to upload their ID again." />
          <Switch checked={s.reuseConsent} onChange={(v) => set("reuseConsent", v)} label="Carry an accepted consent letter into new proposals" description="Off by default: a new proposal usually needs a new letter. The church has yet to confirm this." />
        </Section>

        <Card className="overflow-hidden">
          <div className="p-5 sm:p-6">
            <h2 className="t-h2">Message templates</h2>
            <p className="mt-1 max-w-[62ch] text-[14px] text-muted">The approved wording for emails. Words in braces are filled in for each person.</p>
          </div>
          <ul className="divide-y divide-line/80 border-t border-line/80">
            {templates.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 sm:px-6">
                <div className="min-w-[220px] flex-1">
                  <p className="text-[14.5px] font-medium">{t.name}</p>
                  <p className="text-[12.5px] text-muted">To: {t.audience}</p>
                </div>
                <StatusPill tone={t.approved.startsWith("Edited") ? "wait" : "ok"}>{t.approved}</StatusPill>
                <Button size="sm" variant="ghost" onClick={() => { setDraft({ subject: t.subject, body: t.body }); setEditing(t); }}>
                  <Pencil className="size-3.5" aria-hidden />
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {dirty && (
        <div className="animate-rise fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-5 text-[14px] text-white shadow-pop">
            You have unsaved changes
            <Button size="sm" variant="ghost" className="text-white/80 hover:bg-white/10 hover:text-white" onClick={() => setS(saved)}>
              Discard
            </Button>
            <Button size="sm" variant="secondary" onClick={() => { setSaved(s); toast("Settings saved."); }}>
              Save changes
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        size="lg"
        title={editing?.name ?? ""}
        description="Edited templates need approval by the department before they’re used."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setTemplates((ts) => ts.map((t) => (t.id === editing!.id ? { ...t, ...draft, approved: "Edited, awaiting approval" } : t)));
                toast("Template saved and sent for approval.");
                setEditing(null);
              }}
            >
              Save and send for approval
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Subject">
            <Input value={draft.subject} onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))} />
          </Field>
          <Field label="Message">
            <Textarea rows={7} value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} />
          </Field>
          <div>
            <p className="text-[13px] font-medium text-muted">Preview with sample details</p>
            <div className="mt-2 rounded-[14px] bg-sunken/70 p-4 text-[14px] leading-relaxed">
              <p className="font-semibold">{fill(draft.subject)}</p>
              <p className="mt-2 whitespace-pre-line">{fill(draft.body)}</p>
            </div>
          </div>
        </div>
      </Modal>
      {toastNode}
    </div>
  );
}
