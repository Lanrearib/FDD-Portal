"use client";

import clsx from "clsx";
import {
  ArrowUpRight,
  ChevronLeft,
  CircleCheck,
  Cog,
  Ellipsis,
  Lock,
  MessageCircle,
  Pause,
  Play,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { Field, Select, Textarea } from "@/components/form";
import { JourneyPath } from "@/components/journey-path";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast";
import { Avatar, Button, Card, StatusPill, type Tone } from "@/components/ui";
import { counsellors, currentStaff } from "@/lib/staff-directory";
import type { CaseEvent, CaseRecord } from "./case-data";
import { DecisionPanel, ReassignPastorModal, type Action } from "./panels";

/* ---------- More menu with consequential actions (reason required) ---------- */

type MenuAction = "hold" | "escalate" | "reassign" | "pastor";

function MoreMenu({ onPick, onHold }: { onPick: (a: MenuAction) => void; onHold: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const items: { key: MenuAction; label: string; hint: string }[] = [
    onHold
      ? { key: "hold", label: "Resume case", hint: "Restarts reminders and tasks." }
      : { key: "hold", label: "Place on hold", hint: "Pauses reminders. A reason is required." },
    { key: "escalate", label: "Escalate to central office", hint: "Hands the case to the Central Marriage Counsellor." },
    { key: "reassign", label: "Reassign counsellor", hint: "Keeps every decision, document and message." },
    { key: "pastor", label: "Reassign Pastor", hint: "Sends a new introduction link." },
  ];
  return (
    <div ref={ref} className="relative">
      <Button variant="secondary" size="icon" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((o) => !o)}>
        <Ellipsis className="size-4" aria-hidden />
        <span className="sr-only">More actions</span>
      </Button>
      {open && (
        <div id={menuId} role="menu" className="animate-rise absolute right-0 z-30 mt-2 w-72 rounded-card bg-surface p-1.5 shadow-pop ring-1 ring-line">
          {items.map((it) => (
            <button
              key={it.key}
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                onPick(it.key);
              }}
              className="block w-full rounded-[10px] px-3 py-2.5 text-left hover:bg-sunken focus-visible:bg-sunken"
            >
              <span className="block text-[14px] font-medium">{it.label}</span>
              <span className="block text-[12.5px] text-muted">{it.hint}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReasonModal({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  extra,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  extra?: { label: string; options: string[] };
  onConfirm: (reason: string, choice?: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [choice, setChoice] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (extra && !choice) return setError(`Choose ${extra.label.toLowerCase()}.`);
              if (reason.trim().length < 10) return setError("A reason is required. Write a sentence or two.");
              onConfirm(reason.trim(), choice || undefined);
              setReason("");
              setChoice("");
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {extra && (
          <Field label={extra.label}>
            <Select value={choice} onChange={(e) => { setChoice(e.target.value); setError(null); }}>
              <option value="">Choose one</option>
              {extra.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          </Field>
        )}
        <Field label="Reason" hint="Recorded in the case history with your name." error={error}>
          <Textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError(null); }} />
        </Field>
      </div>
    </Modal>
  );
}

/* ---------- Tabs ---------- */

const actorIcon: Record<CaseEvent["actorType"], { icon: typeof UserRound; cls: string }> = {
  candidate: { icon: UserRound, cls: "bg-sunken text-ink-2" },
  staff: { icon: ShieldCheck, cls: "bg-info-soft text-info" },
  pastor: { icon: CircleCheck, cls: "bg-ok-soft text-ok" },
  system: { icon: Cog, cls: "bg-sunken text-muted" },
};

function Section({ title, pill, children, className }: { title: string; pill?: { tone: Tone; label: string }; children: ReactNode; className?: string }) {
  return (
    <Card className={clsx("p-5 sm:p-6", className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="t-h3">{title}</h3>
        {pill && <StatusPill tone={pill.tone}>{pill.label}</StatusPill>}
      </div>
      {children}
    </Card>
  );
}

function Overview({ record }: { record: CaseRecord }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {record.pastorIntro && (
        <Section title="Pastor’s introduction" pill={{ tone: "ok", label: "Membership confirmed" }} className="md:col-span-2">
          <p className="mt-1 text-[13px] text-muted">
            {record.pastorIntro.name}, {record.pastorIntro.branch}. Submitted {record.pastorIntro.submitted}.
          </p>
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {record.pastorIntro.answers.map((a) => (
              <div key={a.q}>
                <dt className="text-[12.5px] text-muted">{a.q}</dt>
                <dd className="mt-0.5 text-[14px]">{a.a}</dd>
              </div>
            ))}
          </dl>
          {record.pastorIntro.comments && (
            <div className="mt-4 rounded-[14px] bg-sunken/70 p-3.5">
              <p className="text-[12.5px] text-muted">For the counsellor</p>
              <p className="mt-1 text-[14px] leading-relaxed">{record.pastorIntro.comments}</p>
            </div>
          )}
        </Section>
      )}
      {record.appointment && (
        <Section title="First appointment" pill={{ tone: record.appointment.tone, label: record.appointment.status }}>
          <dl className="mt-4 space-y-3 text-[14px]">
            <div>
              <dt className="text-[12.5px] text-muted">When</dt>
              <dd>{record.appointment.when}</dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-muted">Where</dt>
              <dd>{record.appointment.where}</dd>
            </div>
            {record.appointment.note && (
              <div>
                <dt className="text-[12.5px] text-muted">Outcome</dt>
                <dd>{record.appointment.note}</dd>
              </div>
            )}
          </dl>
        </Section>
      )}
      <Section title="Profile" className={record.appointment ? "" : "md:col-span-2"}>
        <dl className="mt-4 space-y-3 text-[14px]">
          {record.profile.map((p) => (
            <div key={p.label} className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted">{p.label}</dt>
              <dd className="min-w-0 text-right break-words">{p.value}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-muted">Pastor</dt>
            <dd className="min-w-0 text-right">{record.pastor}</dd>
          </div>
        </dl>
      </Section>
    </div>
  );
}

function Messages({ record, messages, onSend }: { record: CaseRecord; messages: CaseRecord["messages"]; onSend: (body: string) => void }) {
  const [draft, setDraft] = useState("");
  const id = useId();
  return (
    <Card className="p-5 sm:p-6">
      {messages.length === 0 && <p className="text-[14px] text-muted">No messages yet. Anything you send appears in {record.firstName}’s portal and by email.</p>}
      <ol className="space-y-4">
        {messages.map((m) => (
          <li key={m.id} className={clsx("flex gap-3", m.from === "staff" && "flex-row-reverse")}>
            <Avatar name={m.author} size={30} />
            <div className={clsx("max-w-[80%]", m.from === "staff" && "text-right")}>
              <div className={clsx("inline-block rounded-[16px] px-4 py-2.5 text-left text-[14px] leading-relaxed", m.from === "staff" ? "rounded-tr-[6px] bg-ink text-white" : "rounded-tl-[6px] bg-sunken")}>{m.body}</div>
              <p className="mt-1 text-[12px] text-muted">
                {m.from === "staff" ? (m.author === currentStaff.name ? "You" : m.author) : m.author}, {m.when}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <form
        className="mt-6 rounded-[14px] ring-1 ring-line focus-within:ring-ink"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          onSend(draft.trim());
          setDraft("");
        }}
      >
        <label htmlFor={id} className="sr-only">
          Message to {record.firstName}
        </label>
        <textarea id={id} rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Write to ${record.firstName}. They’ll get an email and see it in their portal.`} className="w-full resize-none rounded-t-[14px] bg-transparent px-4 py-3 text-[14px] placeholder:text-faint focus:outline-none" />
        <div className="flex items-center justify-between gap-2 border-t border-line/80 px-3 py-2">
          <select
            aria-label="Insert a standard instruction"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) setDraft(e.target.value);
              e.target.value = "";
            }}
            className="h-8 max-w-[55%] rounded-full bg-frame px-3 text-[13px] text-ink-2 ring-1 ring-line focus:outline-none"
          >
            <option value="">Use a standard instruction</option>
            <option value={`Hello ${record.firstName}, your next step is ready in the portal. Please sign in to continue.`}>Next step is ready</option>
            <option value={`Hello ${record.firstName}, please bring a printed copy of your ID to your appointment.`}>Bring ID to appointment</option>
            <option value={`Hello ${record.firstName}, we haven’t heard from you in a while. Is there anything we can help with?`}>Check in</option>
          </select>
          <Button type="submit" size="sm" disabled={!draft.trim()}>
            <Send className="size-3.5" aria-hidden />
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Notes({ notes, onAdd }: { notes: CaseRecord["notes"]; onAdd: (body: string) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <Card className="p-5 sm:p-6">
      <p className="flex w-fit items-center gap-2 rounded-full bg-sunken/80 px-3 py-1.5 text-[12.5px] text-ink-2">
        <Lock className="size-3.5" aria-hidden />
        Only counsellors can see notes. Candidates and Pastors never do.
      </p>
      {notes.length === 0 && <p className="mt-5 text-[14px] text-muted">No notes yet.</p>}
      <ol className="mt-5 space-y-4">
        {notes.map((n) => (
          <li key={n.id} className="flex gap-3">
            <Avatar name={n.author} size={30} />
            <div>
              <p className="text-[13px]">
                <span className="font-medium">{n.author}</span> <span className="text-muted">{n.when}</span>
              </p>
              <p className="mt-1 text-[14px] leading-relaxed">{n.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <form
        className="mt-5 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          onAdd(draft.trim());
          setDraft("");
        }}
      >
        <label className="sr-only" htmlFor="note-input">
          Add a note
        </label>
        <input id="note-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a note for the team" className="h-10 flex-1 rounded-full bg-frame px-4 text-[14px] ring-1 ring-line placeholder:text-faint focus:bg-surface focus:ring-ink focus:outline-none" />
        <Button type="submit" variant="secondary" disabled={!draft.trim()}>
          Add note
        </Button>
      </form>
    </Card>
  );
}

function History({ events }: { events: CaseEvent[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <ol className="relative">
        {events.map((e, i) => {
          const a = actorIcon[e.actorType];
          const Icon = a.icon;
          return (
            <li key={e.id} className="relative flex gap-3.5 pb-5 last:pb-0">
              {i < events.length - 1 && <span aria-hidden className="absolute top-9 bottom-1 left-[15.5px] w-px bg-line" />}
              <span className={clsx("relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full", a.cls)}>
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 pt-1">
                <p className="text-[14px]">
                  <span className="font-medium">{e.actor}</span> <span className="text-ink-2">{e.action.charAt(0).toLowerCase() + e.action.slice(1)}</span>
                </p>
                {e.detail && <p className="mt-0.5 text-[13px] text-muted">{e.detail}</p>}
                <p className="mt-0.5 text-[12.5px] text-faint tabular-nums">{e.when}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/* ---------- Page ---------- */

type TabKey = "overview" | "messages" | "notes" | "history";

export function CaseView({ record, initialTab = "overview" }: { record: CaseRecord; initialTab?: TabKey }) {
  const [stages, setStages] = useState(record.stages);
  const [validation, setValidation] = useState(record.validation);
  const [onHold, setOnHold] = useState<string | null>(null);
  const [owner, setOwner] = useState(currentStaff.name);
  const [pastor, setPastor] = useState(record.pastor);
  const [routing, setRouting] = useState(record.routing);
  const [tab, setTabState] = useState<TabKey>(initialTab);
  // Keep the open tab in the URL so it can be shared and survives a reload.
  const setTab = (t: TabKey) => {
    setTabState(t);
    const url = new URL(window.location.href);
    if (t === "overview") url.searchParams.delete("tab");
    else url.searchParams.set("tab", t);
    window.history.replaceState(null, "", url);
  };
  const [history, setHistory] = useState(record.history);
  const [messages, setMessages] = useState(record.messages);
  const [notes, setNotes] = useState(record.notes);
  const [modal, setModal] = useState<MenuAction | null>(null);
  const { toast, toastNode } = useToast();

  const log = (action: string, detail?: string) =>
    setHistory((h) => [{ id: `h${Date.now()}${Math.random()}`, when: "Just now", actor: currentStaff.name, actorType: "staff", action, detail }, ...h]);

  const act = (a: Action) => {
    log(a.log, a.detail);
    if (a.stages) setStages((s) => s.map((st) => ({ ...st, ...(a.stages!.find((x) => x.key === st.key)?.patch ?? {}) })));
    if (a.message) setMessages((m) => [...m, { id: `m${Date.now()}`, from: "staff", author: currentStaff.name, when: "Just now", body: a.message! }]);
    if (a.validation) setValidation(a.validation);
    toast(a.toast);
  };

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "messages", label: "Messages", count: messages.length },
    { key: "notes", label: "Notes", count: notes.length },
    { key: "history", label: "History", count: history.length },
  ];

  const aside = (
    <div className="space-y-6">
      <JourneyPath stages={stages} title="Journey" />
      {record.proposalCase && (
        <Link href={record.proposalCase.href} className="group block rounded-card bg-surface p-4 ring-1 ring-line/70 hover:ring-ink/30">
          <p className="text-[12.5px] text-muted">Proposal case {record.proposalCase.ref}</p>
          <p className="mt-0.5 flex items-center justify-between gap-2 text-[14px] font-medium">
            {record.proposalCase.label}
            <ArrowUpRight className="size-4 shrink-0 text-faint group-hover:text-ink" aria-hidden />
          </p>
        </Link>
      )}
      <div className="rounded-card bg-sunken/70 p-4">
        <h2 className="text-[13.5px] font-medium">Routing</h2>
        <dl className="mt-3 space-y-2 text-[13px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Owner</dt>
            <dd className="text-right font-medium">{owner}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Zone</dt>
            <dd className="text-right">
              {record.zone}, {record.area}
            </dd>
          </div>
        </dl>
        <ol className="mt-3 space-y-1 border-t border-line pt-3 text-[12.5px] text-muted">
          {routing.map((r, i) => (
            <li key={i}>
              <span className="tabular-nums">{r.when}</span>: {r.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  return (
    <AppShell user={currentStaff} variant="staff" aside={aside}>
      <div className="mx-auto max-w-[880px]">
        <Link href="/staff/candidates" className="inline-flex items-center gap-1 rounded-full py-1 pr-2 text-[13px] font-medium text-ink-2 hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden />
          Candidates
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={record.name} size={64} />
            <div className="min-w-0">
              <h1 className="t-h1">{record.name}</h1>
              <p className="mt-1 text-[13.5px] text-muted">
                {record.journey}, profile <span className="tabular-nums">{record.profileRef}</span>, proposal <span className="tabular-nums">{record.proposalRef}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <StatusPill tone={validation.tone}>{validation.label}</StatusPill>
                {onHold && <StatusPill tone="wait">On Hold</StatusPill>}
                <StatusPill tone="neutral">Registered {record.registered}</StatusPill>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setTab("messages")}>
              <MessageCircle className="size-4" aria-hidden />
              Message
            </Button>
            <MoreMenu
              onHold={!!onHold}
              onPick={(a) => {
                if (a === "hold" && onHold) {
                  setOnHold(null);
                  log("Resumed the case");
                  toast("Case resumed. Reminders have restarted.");
                } else setModal(a);
              }}
            />
          </div>
        </div>

        {onHold && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card bg-wait-soft/70 px-4 py-3 text-[14px] text-ink-2">
            <Pause className="size-4 text-wait" aria-hidden />
            <span className="flex-1">
              On hold: {onHold} Reminders are paused and {record.firstName} sees the case as on hold.
            </span>
            <Button size="sm" variant="secondary" onClick={() => { setOnHold(null); log("Resumed the case"); toast("Case resumed. Reminders have restarted."); }}>
              <Play className="size-3.5" aria-hidden />
              Resume
            </Button>
          </div>
        )}

        <DecisionPanel record={{ ...record, pastor }} act={act} />

        <div role="tablist" aria-label="Case sections" className="mt-10 flex gap-6 overflow-x-auto border-b border-line">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              id={`tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls={`panel-${t.key}`}
              onClick={() => setTab(t.key)}
              className={clsx("-mb-px flex shrink-0 items-center gap-1.5 border-b-2 pb-3 text-[14px] transition-colors", tab === t.key ? "border-ink font-semibold text-ink" : "border-transparent text-muted hover:text-ink")}
            >
              {t.label}
              {t.count !== undefined && <span className="text-[12px] font-normal text-faint tabular-nums">{t.count}</span>}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-5">
          {tab === "overview" && <Overview record={{ ...record, pastor }} />}
          {tab === "messages" && (
            <Messages
              record={record}
              messages={messages}
              onSend={(body) => {
                setMessages((m) => [...m, { id: `m${Date.now()}`, from: "staff", author: currentStaff.name, when: "Just now", body }]);
                log("Sent a message");
                toast(`Message sent to ${record.firstName}.`);
              }}
            />
          )}
          {tab === "notes" && (
            <Notes
              notes={notes}
              onAdd={(body) => {
                setNotes((n) => [...n, { id: `n${Date.now()}`, author: currentStaff.name, when: "Just now", body }]);
                log("Added an internal note");
              }}
            />
          )}
          {tab === "history" && <History events={history} />}
        </div>
      </div>

      <ReasonModal
        open={modal === "hold"}
        onClose={() => setModal(null)}
        title="Place this case on hold?"
        description="Reminders and automatic tasks pause until you resume. Nothing is deleted."
        confirmLabel="Place on hold"
        onConfirm={(reason) => {
          setModal(null);
          setOnHold(reason.endsWith(".") ? reason : `${reason}.`);
          log("Placed the case on hold", `Reason: ${reason}`);
          toast("Case placed on hold.");
        }}
      />
      <ReasonModal
        open={modal === "escalate"}
        onClose={() => setModal(null)}
        title="Escalate to the central office?"
        description="Pastor Mrs. Funmi Adeyemi, the Central Marriage Counsellor, becomes the owner. You’ll keep read access, and the full history moves with the case."
        confirmLabel="Escalate case"
        onConfirm={(reason) => {
          setModal(null);
          setOwner("Pastor Mrs. Funmi Adeyemi");
          setRouting((r) => [...r, { when: "Today", text: "Escalated to the central office" }]);
          log("Escalated the case to the central office", `Reason: ${reason}`);
          toast("Case escalated to the central office.");
        }}
      />
      <ReasonModal
        open={modal === "reassign"}
        onClose={() => setModal(null)}
        title="Reassign to another counsellor"
        description="Every decision, document and message stays with the case."
        confirmLabel="Reassign"
        extra={{ label: "New counsellor", options: counsellors.filter((c) => c.name !== owner).map((c) => `${c.name} (${c.scope})`) }}
        onConfirm={(reason, choice) => {
          setModal(null);
          const name = choice!.split(" (")[0];
          setOwner(name);
          setRouting((r) => [...r, { when: "Today", text: `Reassigned to ${name}` }]);
          log(`Reassigned the case to ${name}`, `Reason: ${reason}`);
          toast(`Case reassigned to ${name}.`);
        }}
      />
      <ReassignPastorModal
        open={modal === "pastor"}
        onClose={() => setModal(null)}
        current={pastor}
        onConfirm={(name, reason) => {
          setModal(null);
          setPastor(name);
          log(`Reassigned the Pastor to ${name}`, `Previously ${pastor}. Reason: ${reason}`);
          setStages((s) => s.map((st) => (st.key === "pastor" && st.state !== "done" ? { ...st, state: "waiting", status: "Pending Pastor", detail: `Link sent to ${name} today` } : st)));
          toast(`Reassigned. ${name} has been sent a link.`);
        }}
      />
      {toastNode}
    </AppShell>
  );
}
