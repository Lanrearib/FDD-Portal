"use client";

import clsx from "clsx";
import { Archive, Check, ChevronLeft, Eye, Link2Off, Lock, MessageCircle, Pause, Play, Send, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Field, Select, Textarea } from "@/components/form";
import { Modal } from "@/components/modal";
import { StageBar } from "@/components/stage-bar";
import { useToast } from "@/components/toast";
import { Avatar, Button, ButtonLink, Card, StatusPill } from "@/components/ui";
import { currentStaff } from "@/lib/staff-directory";
import type { Milestone, Party, ProposalCase } from "../data";

function PartyCard({ party, label }: { party: Party | null; label: string }) {
  if (!party)
    return (
      <Card className="flex flex-col items-center justify-center border border-dashed border-line-strong bg-frame/50 p-6 text-center shadow-none ring-0">
        <span className="flex size-12 items-center justify-center rounded-full bg-sunken text-[18px] text-faint">?</span>
        <p className="mt-3 text-[14.5px] font-medium">{label} not linked yet</p>
        <p className="mt-1 max-w-[30ch] text-[13px] text-muted">She links the case by entering the proposal code when she registers or signs in.</p>
      </Card>
    );
  return (
    <Card className="p-5">
      <p className="text-[12.5px] text-muted">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <Avatar name={party.name} size={44} />
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold">{party.name}</p>
          <p className="truncate text-[12.5px] text-muted">{party.zone}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="text-[13px] text-muted">Own validation</span>
        <StatusPill tone={party.validation.tone}>{party.validation.label}</StatusPill>
      </div>
      {party.stages && <StageBar states={party.stages} thin className="mt-3" />}
      {party.candidateId ? (
        <ButtonLink href={`/staff/candidates/${party.candidateId}`} variant="secondary" size="sm" className="mt-4">
          Open {party.name.split(" ")[0]}’s case
        </ButtonLink>
      ) : (
        <p className="mt-4 flex gap-2 text-[12.5px] leading-snug text-muted">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Outside your Zone. Managed by {party.managedBy}; only shared milestones are shown.
        </p>
      )}
    </Card>
  );
}

function Milestones({ items }: { items: Milestone[] }) {
  return (
    <ol className="relative">
      {items.map((m, i) => (
        <li key={m.label} className="relative flex gap-3.5 pb-5 last:pb-0">
          {i < items.length - 1 && <span aria-hidden className={clsx("absolute top-7 bottom-0 left-[11.5px] w-px", m.state === "done" ? "bg-ink" : "border-l border-dashed border-line-strong")} />}
          <span
            className={clsx(
              "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
              m.state === "done" && "bg-ink text-white",
              m.state === "current" && "pulse-ring bg-peach",
              m.state === "upcoming" && "border border-dashed border-line-strong bg-frame",
              m.state === "stopped" && "bg-sunken text-faint",
            )}
          >
            {m.state === "done" && <Check className="size-3" strokeWidth={3} aria-hidden />}
            {m.state === "stopped" && <X className="size-3" strokeWidth={3} aria-hidden />}
          </span>
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 pt-0.5">
            <p className={clsx("text-[14px]", m.state === "upcoming" || m.state === "stopped" ? "text-muted" : "font-medium", m.state === "stopped" && "line-through")}>{m.label}</p>
            {m.when && <p className="text-[12.5px] text-muted tabular-nums">{m.when}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

type ModalKey = "message" | "hold" | "unlink" | "close";

export function CaseDetail({ c }: { c: ProposalCase }) {
  const [status, setStatus] = useState(c.status);
  const [sister, setSister] = useState(c.sister);
  const [hold, setHold] = useState<string | null>(null);
  const [closure, setClosure] = useState(c.closure);
  const [modal, setModal] = useState<ModalKey | null>(null);
  const [text, setText] = useState("");
  const [choice, setChoice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showNote, setShowNote] = useState(false);
  const [log, setLog] = useState<{ when: string; text: string }[]>([]);
  const { toast, toastNode } = useToast();
  const closed = !!closure || status.label === "Completed";

  const open = (m: ModalKey) => {
    setText("");
    setChoice("");
    setError(null);
    setModal(m);
  };
  const record = (t: string) => setLog((l) => [{ when: "Just now", text: t }, ...l]);

  return (
    <AppShell user={currentStaff} variant="staff">
      <div className="mx-auto max-w-[1000px]">
        <Link href="/staff/cases" className="inline-flex items-center gap-1 rounded-full py-1 pr-2 text-[13px] font-medium text-ink-2 hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden />
          Proposal cases
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[13px] text-muted tabular-nums">
              {c.ref}, created {c.created}
            </p>
            <h1 className="t-h1 mt-1">
              {c.brother.name} and {sister?.name ?? "a sister yet to link"}
            </h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <StatusPill tone={status.tone}>{status.label}</StatusPill>
              {hold && <StatusPill tone="wait">On Hold</StatusPill>}
              <StatusPill tone="neutral">Proposal code {c.code}</StatusPill>
            </div>
          </div>
          {!closed && (
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => open("message")}>
                <MessageCircle className="size-4" aria-hidden />
                Message {sister ? "both" : c.brother.name.split(" ")[0]}
              </Button>
              <Button variant="ghost" onClick={() => (hold ? (setHold(null), record("Resumed the case"), toast("Case resumed.")) : open("hold"))}>
                {hold ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
                {hold ? "Resume" : "Place on hold"}
              </Button>
            </div>
          )}
        </div>

        {closure && (
          <Card className="mt-7 p-5 sm:p-6">
            <div className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunken text-ink-2">
                <Archive className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="t-h2">Closed on {closure.on}: {closure.outcome.toLowerCase()}</h2>
                <ul className="mt-3 space-y-1.5 text-[14px] text-ink-2">
                  {closure.stopped.map((s) => (
                    <li key={s} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
                      {s}
                    </li>
                  ))}
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
                    The record is kept for history and can’t be deleted
                  </li>
                </ul>
                <div className="mt-4 rounded-[14px] bg-sunken/70 p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-[13px] font-medium">
                      <Lock className="size-3.5" aria-hidden />
                      Reason (restricted to counsellors)
                    </p>
                    <button type="button" onClick={() => { setShowNote((s) => !s); if (!showNote) record("Viewed the restricted closure reason"); }} className="flex items-center gap-1 text-[13px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
                      <Eye className="size-3.5" aria-hidden />
                      {showNote ? "Hide" : "Show"}
                    </button>
                  </div>
                  {showNote ? (
                    <p className="mt-2 text-[14px] leading-relaxed">{closure.restrictedNote}</p>
                  ) : (
                    <p className="mt-2 text-[13px] text-muted">Hidden. Viewing it is recorded in the audit log.</p>
                  )}
                </div>
                {closure.laterCase && (
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
                    {sister?.name.split(" ")[0]}’s profile wasn’t affected. She has since joined a separate case,{" "}
                    <Link href={closure.laterCase.href} className="font-medium text-ink underline decoration-line-strong underline-offset-4">
                      {closure.laterCase.ref}
                    </Link>
                    , which inherits nothing from this one.
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {hold && (
          <p className="mt-6 flex items-center gap-3 rounded-card bg-wait-soft/70 px-4 py-3 text-[14px] text-ink-2">
            <Pause className="size-4 shrink-0 text-wait" aria-hidden />
            On hold: {hold} Reminders for both candidates are paused.
          </p>
        )}

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <PartyCard party={c.brother} label="Brother" />
          <PartyCard party={sister} label="Sister" />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-5 sm:p-6">
            <h2 className="t-h3">Shared milestones</h2>
            <p className="mt-1 text-[13px] text-muted">Only steps that involve both candidates. Each person’s private steps stay on their own case.</p>
            <div className="mt-5">
              <Milestones items={c.milestones} />
            </div>
          </Card>
          <div className="space-y-5">
            <Card className="p-5">
              <h2 className="t-h3">Case details</h2>
              <dl className="mt-3 space-y-2.5 text-[13.5px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Owner</dt>
                  <dd className="text-right font-medium">{c.owner}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Current stage</dt>
                  <dd className="text-right">{closed ? "Closed" : c.stage}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">How linked</dt>
                  <dd className="text-right">{sister ? c.linkedBy : "Not linked yet"}</dd>
                </div>
              </dl>
              {!closed && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-line/80 pt-4">
                  {sister && (
                    <Button size="sm" variant="secondary" onClick={() => open("unlink")}>
                      <Link2Off className="size-3.5" aria-hidden />
                      Correct the link
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => open("close")}>
                    Close case
                  </Button>
                </div>
              )}
            </Card>
            {log.length > 0 && (
              <Card className="p-5">
                <h2 className="t-h3">Your recent actions</h2>
                <ul className="mt-3 space-y-2 text-[13.5px]">
                  {log.map((l, i) => (
                    <li key={i}>
                      {l.text} <span className="text-muted">{l.when}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={modal === "message"}
        onClose={() => setModal(null)}
        title={sister ? "Message both candidates" : `Message ${c.brother.name.split(" ")[0]}`}
        description={sister ? "Each gets their own copy by email and in their portal. Neither sees the other’s contact details." : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (text.trim().length < 5) return setError("Write a message first.");
                setModal(null);
                record("Sent a message to both candidates");
                toast(sister ? "Message sent to both candidates." : "Message sent.");
              }}
            >
              <Send className="size-4" aria-hidden />
              Send
            </Button>
          </>
        }
      >
        <Field label="Message" error={error}>
          <Textarea rows={5} value={text} onChange={(e) => { setText(e.target.value); setError(null); }} />
        </Field>
      </Modal>

      <Modal
        open={modal === "hold"}
        onClose={() => setModal(null)}
        title="Place this case on hold?"
        description="Reminders and tasks for both candidates pause until you resume."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (text.trim().length < 10) return setError("A reason is required.");
                setModal(null);
                setHold(text.trim().endsWith(".") ? text.trim() : `${text.trim()}.`);
                record("Placed the case on hold");
                toast("Case placed on hold.");
              }}
            >
              Place on hold
            </Button>
          </>
        }
      >
        <Field label="Reason" hint="Recorded in the case history with your name." error={error}>
          <Textarea rows={3} value={text} onChange={(e) => { setText(e.target.value); setError(null); }} />
        </Field>
      </Modal>

      <Modal
        open={modal === "unlink"}
        onClose={() => setModal(null)}
        title="Correct the link?"
        description={`${sister?.name} is removed from this case and her own case is unaffected. The brother’s case goes back to waiting for a sister to link.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (text.trim().length < 10) return setError("A reason is required.");
                setModal(null);
                setSister(null);
                setStatus({ label: "Awaiting Sister", tone: "neutral" });
                record("Removed an incorrect link");
                toast("Link corrected. The case is waiting for the right sister to link.");
              }}
            >
              Remove link
            </Button>
          </>
        }
      >
        <Field label="What was wrong?" hint="Recorded in the audit history." error={error}>
          <Textarea rows={3} value={text} onChange={(e) => { setText(e.target.value); setError(null); }} placeholder="For example, the code was entered by the wrong person" />
        </Field>
      </Modal>

      <Modal
        open={modal === "close"}
        onClose={() => setModal(null)}
        title="Close this case?"
        description="Open tasks and reminders stop. The record is kept and can’t be deleted. A sister’s rejection is recorded from her own response, not here."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!choice) return setError("Choose an outcome.");
                if (text.trim().length < 10) return setError("A reason is required.");
                setModal(null);
                setClosure({ on: "today", outcome: choice, stopped: ["All open tasks for this case were cancelled", "Scheduled reminders were stopped"], restrictedNote: text.trim() });
                setStatus({ label: choice, tone: "neutral" });
                setHold(null);
                record(`Closed the case: ${choice.toLowerCase()}`);
                toast("Case closed.");
              }}
            >
              Close case
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Outcome">
            <Select value={choice} onChange={(e) => { setChoice(e.target.value); setError(null); }}>
              <option value="">Choose one</option>
              <option>Withdrawn by brother</option>
              <option>Withdrawn by sister</option>
              <option>Closed by counsellor</option>
            </Select>
          </Field>
          <Field label="Reason" hint="Restricted to counsellors." error={error}>
            <Textarea rows={3} value={text} onChange={(e) => { setText(e.target.value); setError(null); }} />
          </Field>
        </div>
      </Modal>
      {toastNode}
    </AppShell>
  );
}
