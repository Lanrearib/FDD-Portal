"use client";

import clsx from "clsx";
import { Check, Copy, HeartHandshake, Lock, MessageCircle, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Checkbox, Field, Textarea } from "@/components/form";
import { Button, ButtonLink, Card, StatusPill } from "@/components/ui";
import type { Persona } from "@/lib/portal-data";
import { useStageUpdate } from "@/components/portal/stage-context";

function CodeDisplay({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-card bg-ink p-5 text-white sm:p-6">
      <div className="flex-1">
        <p className="text-[13px] text-white/70">Your proposal code</p>
        <p className="mt-1 text-[34px] leading-none font-semibold tracking-[0.12em] tabular-nums">{code}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* clipboard unavailable */
          }
        }}
        className="flex h-10 items-center gap-2 rounded-full bg-white/15 px-4 text-[14px] font-medium ring-1 ring-white/30 hover:bg-white/25"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        <span aria-live="polite">{copied ? "Copied" : "Copy code"}</span>
      </button>
    </div>
  );
}

function ShareIntention({ code, firstName }: { code: string; firstName: string }) {
  const updateStage = useStageUpdate();
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <div className="animate-rise mt-7 space-y-5">
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="t-h2">Waiting for the sister</h2>
            <StatusPill tone="wait">Awaiting Sister</StatusPill>
          </div>
          <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">
            Thank you, {firstName}. The sister now goes through her own steps: she registers or signs in,
            her own Pastor introduces her, and she uploads her consent letter. When she has responded,
            we’ll tell you here and by email.
          </p>
        </Card>
        <CodeDisplay code={code} />
        <p className="text-[13.5px] leading-relaxed text-muted">
          Her progress and details stay private to her and the counsellors. You’ll only see her response.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7 space-y-6">
      <ol className="space-y-4">
        {[
          { title: "Speak with the sister", body: "Formally share your intention with her in person, as the church guides." },
          { title: "Give her your proposal code", body: "She enters it when she registers or signs in. It links her proposal to yours, without revealing your details." },
          { title: "Confirm here", body: "Let the department know you’ve shared your intention, so her side can begin." },
        ].map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sunken text-[13px] font-semibold">{i + 1}</span>
            <div>
              <p className="text-[15px] font-semibold">{s.title}</p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-ink-2">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <CodeDisplay code={code} />

      <form
        noValidate
        className="space-y-5 rounded-card bg-surface p-5 ring-1 ring-line/80 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!confirmed) return setError("Tick the box once you have shared your intention.");
          updateStage("intention", { state: "done", status: "Completed", detail: "Confirmed just now" });
          updateStage("response", { state: "waiting", status: "Awaiting Sister", detail: "She completes her own steps first" });
          setDone(true);
        }}
      >
        <Checkbox
          checked={confirmed}
          onChange={(v) => {
            setConfirmed(v);
            setError(null);
          }}
          error={error}
          label="I have formally communicated my intention to the sister and given her my proposal code."
        />
        <Button type="submit" size="lg">
          Confirm I’ve shared my intention
        </Button>
      </form>
    </div>
  );
}

function Respond({ partner, sharedOn, caseRef, code }: { partner: string; sharedOn: string; caseRef: string; code: string }) {
  const updateStage = useStageUpdate();
  const [choice, setChoice] = useState<"accept" | "decline" | null>(null);
  const [sure, setSure] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<"accepted" | "declined" | null>(null);

  if (result === "accepted") {
    return (
      <Card className="animate-rise mt-7 p-6">
        <span className="flex size-11 items-center justify-center rounded-full bg-ok-soft text-ok">
          <HeartHandshake className="size-5" aria-hidden />
        </span>
        <h2 className="t-h2 mt-4">You’ve accepted {partner}’s proposal</h2>
        <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">
          {partner} and your counsellors have been told. Counselling is the next stage; your counsellor will
          confirm your first session with you both.
        </p>
        <ButtonLink href="/portal" variant="secondary" className="mt-6">
          Back to Home
        </ButtonLink>
      </Card>
    );
  }

  if (result === "declined") {
    return (
      <Card className="animate-rise mt-7 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="t-h2">This proposal is closed</h2>
          <StatusPill tone="neutral">Rejected by Sister</StatusPill>
        </div>
        <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">
          {partner} has been told, using the department’s wording. Reminders and tasks for this proposal have
          stopped, and it stays in your history.
        </p>
        <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">
          Your profile isn’t affected. If you take part in a future proposal, you’ll sign in and start fresh with a
          new reference.
        </p>
        <ButtonLink href="/portal/history" variant="secondary" className="mt-6">
          View your history
        </ButtonLink>
      </Card>
    );
  }

  return (
    <div className="mt-7 space-y-6">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[13px] text-muted">Proposal from</p>
            <p className="text-[22px] font-semibold tracking-[-0.015em]">{partner}</p>
          </div>
          <StatusPill tone="action">Awaiting your response</StatusPill>
        </div>
        <dl className="mt-4 grid gap-3 text-[14px] sm:grid-cols-3">
          <div>
            <dt className="text-[12.5px] text-muted">Shared his intention</dt>
            <dd>{sharedOn}</dd>
          </div>
          <div>
            <dt className="text-[12.5px] text-muted">Proposal code</dt>
            <dd className="tabular-nums">{code}</dd>
          </div>
          <div>
            <dt className="text-[12.5px] text-muted">Case reference</dt>
            <dd className="tabular-nums">{caseRef}</dd>
          </div>
        </dl>
        <p className="mt-5 flex gap-2.5 rounded-[14px] bg-sunken/70 p-3.5 text-[13.5px] leading-relaxed text-ink-2">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
          {partner} can’t see your documents or details, and you can’t see his. Only your response is shared.
        </p>
      </Card>

      <fieldset>
        <legend className="t-h3">Your response</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              { key: "accept", title: "Accept the proposal", body: "Counselling begins for you both.", icon: Check },
              { key: "decline", title: "Decline the proposal", body: "This proposal closes. Your profile isn’t affected.", icon: X },
            ] as const
          ).map((o) => {
            const Icon = o.icon;
            const on = choice === o.key;
            return (
              <label
                key={o.key}
                className={clsx(
                  "flex cursor-pointer gap-3 rounded-card bg-surface p-4 ring-1 transition-shadow has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink",
                  on ? "ring-2 ring-ink" : "ring-line-strong hover:ring-ink/40",
                )}
              >
                <input
                  type="radio"
                  name="response"
                  className="sr-only"
                  checked={on}
                  onChange={() => {
                    setChoice(o.key);
                    setSure(false);
                    setError(null);
                  }}
                />
                <span className={clsx("flex size-10 shrink-0 items-center justify-center rounded-full", on ? "bg-ink text-white" : "bg-sunken text-ink-2")}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">{o.title}</span>
                  <span className="mt-0.5 block text-[13px] text-muted">{o.body}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {choice && (
        <form
          noValidate
          className="animate-rise space-y-5 rounded-card bg-surface p-5 ring-1 ring-line/80 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!sure) return setError("Tick the box to confirm your response.");
            if (choice === "accept") {
              updateStage("response", { state: "done", status: "Completed", detail: "You accepted just now" });
              updateStage("counselling", { state: "waiting", status: "Pending Counsellor", detail: "Your counsellor will schedule session 1" });
            } else {
              updateStage("response", { state: "done", status: "Closed", tone: "neutral", detail: "You declined. This proposal is closed." });
              updateStage("counselling", { lockReason: "Not needed: this proposal is closed." });
            }
            setResult(choice === "accept" ? "accepted" : "declined");
          }}
        >
          {choice === "decline" && (
            <Field label="Anything you’d like your counsellor to know?" optional hint={`Only counsellors see this. ${partner} won’t.`}>
              <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
          )}
          <Checkbox
            checked={sure}
            onChange={(v) => {
              setSure(v);
              setError(null);
            }}
            error={error}
            label={
              choice === "accept"
                ? `I have prayed about this and I accept ${partner}’s proposal.`
                : `I have prayed about this and I decline ${partner}’s proposal.`
            }
            description="Your response is final for this proposal."
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" variant={choice === "decline" ? "danger" : "primary"}>
              {choice === "accept" ? "Accept the proposal" : "Decline the proposal"}
            </Button>
            <ButtonLink href="/portal/messages" variant="ghost" size="lg">
              <MessageCircle className="size-4" aria-hidden />
              Talk to my counsellor first
            </ButtonLink>
          </div>
        </form>
      )}
    </div>
  );
}

export function ProposalPanel({ persona }: { persona: Persona }) {
  const p = persona.proposal;

  if (p.kind === "locked") {
    const remaining = persona.stages.filter((s) => s.state !== "done" && ["identity", "pastor", "appointment", "consent"].includes(s.key));
    return (
      <Card className="mt-7 p-6">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed border-line-strong text-faint">
            <Lock className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="t-h2">Not open yet</h2>
            <p className="mt-2 max-w-[56ch] text-[14.5px] leading-relaxed text-ink-2">{p.reason}</p>
            {remaining.length > 0 && (
              <>
                <p className="mt-5 text-[13.5px] font-medium">Still to complete</p>
                <ul className="mt-2 space-y-1.5 text-[14px]">
                  {remaining.map((s) => (
                    <li key={s.key} className="flex items-center gap-2.5">
                      <span className="size-1.5 rounded-full bg-faint" aria-hidden />
                      {s.title}
                      <span className="text-muted">({s.status})</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (p.kind === "share_intention") return <ShareIntention code={p.code} firstName={persona.firstName} />;

  if (p.kind === "awaiting_sister")
    return (
      <div className="mt-7 space-y-5">
        <CodeDisplay code={p.code} />
      </div>
    );

  if (p.kind === "respond") return <Respond partner={p.partnerFirstName} sharedOn={p.sharedOn} caseRef={p.caseRef} code={p.code} />;

  return (
    <Card className="mt-7 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="t-h2">Your proposal with {p.partnerFirstName}</h2>
        <StatusPill tone="info">In Progress</StatusPill>
      </div>
      <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">
        {p.partnerFirstName} accepted on {p.acceptedOn}. You’re now in counselling together, under the church’s
        guidelines. Case reference <span className="tabular-nums">{p.caseRef}</span>.
      </p>
      <ButtonLink href="/portal/counselling" className="mt-6">
        View your counselling plan
      </ButtonLink>
    </Card>
  );
}
