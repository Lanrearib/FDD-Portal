"use client";

import clsx from "clsx";
import { ArrowLeft, Check, MailCheck, ShieldCheck } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Checkbox, CodeInput, Field, Select, Textarea } from "@/components/form";
import { Avatar, Button, Card } from "@/components/ui";
import type { AssessmentLink } from "@/lib/assessments";
import { maskEmail } from "@/lib/reference";

type Step = "confirm" | "code" | "questions" | "review" | "done";
type YesNo = "yes" | "no";
type Certify = "yes" | "no" | "unable";

const certifyLabels: Record<Certify, string> = { yes: "Yes", no: "No", unable: "Unable to confirm" };

function Segmented<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  hint?: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  error?: string;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="text-[15px] font-medium">{label}</legend>
      {hint && <p className="mt-0.5 text-[13px] text-muted">{hint}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <label
              key={o.value}
              className={clsx(
                "flex h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-[14.5px] font-medium ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink",
                on ? "bg-ink text-white ring-ink" : error ? "bg-surface ring-bad" : "bg-surface ring-line-strong hover:ring-ink/40",
              )}
            >
              <input type="radio" name={name} className="sr-only" checked={on} onChange={() => onChange(o.value)} />
              {on && <Check className="size-4" strokeWidth={2.5} aria-hidden />}
              {o.label}
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-[13px] font-medium text-bad">{error}</p>}
    </fieldset>
  );
}

export function AssessmentFlow({ link }: { link: AssessmentLink }) {
  const { candidate, pastor } = link;
  const [step, setStep] = useState<Step>("confirm");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [knows, setKnows] = useState<YesNo | null>(null);
  const [role, setRole] = useState("");
  const [certify, setCertify] = useState<Certify | null>(null);
  const [duration, setDuration] = useState("");
  const [comments, setComments] = useState("");
  const [declared, setDeclared] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const go = (s: Step) => {
    setStep(s);
    setErrors({});
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0 });
      headingRef.current?.focus();
    });
  };

  const answers = [
    { q: "Do you know this candidate?", a: knows === "yes" ? "Yes" : knows === "no" ? "No" : "" },
    ...(knows === "yes" ? [{ q: "What does the candidate do in the church?", a: role.trim() }] : []),
    { q: "Can you certify that the candidate is a member of this church?", a: certify ? certifyLabels[certify] : "" },
    { q: "How long have you known the candidate?", a: duration || "Not given" },
    { q: "Comments for the counsellor", a: comments.trim() || "None" },
  ];

  const pronoun = candidate.gender === "brother" ? "him" : "her";
  const confirmed = knows === "yes" && certify === "yes";

  const candidateCard = (
    <div className="flex items-center gap-4 rounded-card bg-surface p-4 ring-1 ring-line/80">
      <Avatar name={candidate.name} size={48} />
      <div className="min-w-0">
        <p className="text-[12.5px] text-muted">{candidate.gender === "brother" ? "Brother" : "Sister"}, reference {candidate.ref}</p>
        <p className="text-[18px] font-semibold tracking-[-0.01em]">{candidate.name}</p>
        <p className="text-[13px] text-ink-2">
          {candidate.gender === "brother" ? "Says he attends" : "Says she attends"} {candidate.church}
        </p>
      </div>
    </div>
  );

  if (step === "confirm") {
    return (
      <div>
        <h1 ref={headingRef} tabIndex={-1} className="t-h1 focus:outline-none">
          Will you introduce {candidate.firstName}?
        </h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
          {candidate.name} has started the church’s marriage process and named you as their Pastor. Your
          introduction is how the Family Development Department knows them. It takes about three minutes.
        </p>
        <div className="mt-7 space-y-4">
          {candidateCard}
          <div className="rounded-card bg-sunken/70 p-4 text-[14px] leading-relaxed text-ink-2">
            This request is for <span className="font-medium text-ink">{pastor.name}</span>, {pastor.church}. If that isn’t
            you, please don’t continue; forward the email to the department office instead.
          </div>
        </div>
        <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={() => go("code")}>
          Continue
        </Button>
      </div>
    );
  }

  if (step === "code") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^\d{6}$/.test(code)) return setCodeError("Enter all 6 digits of the code.");
          if (code !== "246810") return setCodeError("That code isn’t right. Check the latest email we sent you.");
          go("questions");
        }}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-sunken text-ink">
          <MailCheck className="size-6" aria-hidden />
        </span>
        <h1 ref={headingRef} tabIndex={-1} className="t-h1 mt-5 focus:outline-none">
          Confirm it’s you
        </h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
          To keep {candidate.firstName}’s details private, we’ve sent a 6-digit code to{" "}
          <span className="font-medium text-ink">{maskEmail(pastor.email)}</span>.
        </p>
        <div className="mt-8">
          <CodeInput value={code} onChange={(v) => { setCode(v); setCodeError(null); }} invalid={!!codeError} />
          {codeError && <p role="alert" className="mt-3 text-[13.5px] font-medium text-bad">{codeError}</p>}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg">
            Continue
          </Button>
          <Button variant="ghost" onClick={() => go("confirm")}>
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Button>
        </div>
        <p className="mt-10 rounded-[12px] bg-info-soft px-3.5 py-2.5 text-[13px] text-info">
          Prototype: use the code <span className="font-semibold tabular-nums">246810</span>.
        </p>
      </form>
    );
  }

  if (step === "questions") {
    return (
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const errs: Record<string, string> = {};
          if (!knows) errs.knows = "Choose Yes or No.";
          if (knows === "yes" && role.trim().length < 3) errs.role = `Tell us briefly what ${candidate.firstName} does in the church.`;
          if (!certify) errs.certify = "Choose one answer.";
          if (!declared) errs.declared = "Please confirm the declaration.";
          setErrors(errs);
          if (Object.keys(errs).length) {
            requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true'], .text-bad")?.scrollIntoView({ block: "center" }));
            return;
          }
          go("review");
        }}
      >
        <h1 ref={headingRef} tabIndex={-1} className="t-h1 focus:outline-none">
          Your introduction of {candidate.firstName}
        </h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
          Answer as you know {pronoun}. There are no wrong answers; if you can’t confirm something, say so.
        </p>

        <div className="mt-8 space-y-8">
          <Segmented<YesNo>
            label={`Do you know ${candidate.name}?`}
            value={knows}
            onChange={(v) => { setKnows(v); setErrors((x) => ({ ...x, knows: undefined })); }}
            options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
            error={errors.knows}
          />

          {knows === "yes" && (
            <Field label={`What does ${candidate.firstName} do in the church?`} hint="For example, a unit or department they serve in." error={errors.role}>
              <Textarea rows={3} value={role} onChange={(e) => { setRole(e.target.value); setErrors((x) => ({ ...x, role: undefined })); }} />
            </Field>
          )}

          <Segmented<Certify>
            label={`Can you certify that ${candidate.firstName} is a member of this church?`}
            value={certify}
            onChange={(v) => { setCertify(v); setErrors((x) => ({ ...x, certify: undefined })); }}
            options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unable", label: "Unable to confirm" }]}
            error={errors.certify}
          />

          <Field label="How long have you known them?" optional>
            <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="">Choose one</option>
              <option>Less than a year</option>
              <option>1 to 2 years</option>
              <option>3 to 5 years</option>
              <option>More than 5 years</option>
            </Select>
          </Field>

          <Field label="Anything the marriage counsellor should know?" optional hint={`Only counsellors see this. ${candidate.firstName} won’t.`}>
            <Textarea rows={4} value={comments} onChange={(e) => setComments(e.target.value)} />
          </Field>

          <div className="rounded-card bg-surface p-5 ring-1 ring-line/80">
            <Checkbox
              checked={declared}
              onChange={(v) => { setDeclared(v); setErrors((x) => ({ ...x, declared: undefined })); }}
              error={errors.declared}
              label={`I am ${pastor.name}, and these answers are accurate to the best of my knowledge.`}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end border-t border-line/80 pt-6">
          <Button type="submit" size="lg">
            Review answers
          </Button>
        </div>
      </form>
    );
  }

  if (step === "review") {
    return (
      <div>
        <h1 ref={headingRef} tabIndex={-1} className="t-h1 focus:outline-none">
          Check and submit
        </h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
          Once submitted, your answers can’t be edited through this link.
        </p>
        <Card className="mt-7 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[15px] font-semibold">{candidate.name}</p>
            <button type="button" onClick={() => go("questions")} className="text-[13.5px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
              Edit answers
            </button>
          </div>
          <dl className="mt-4 space-y-4">
            {answers.map((a) => (
              <div key={a.q}>
                <dt className="text-[13px] text-muted">{a.q}</dt>
                <dd className="mt-0.5 text-[15px]">{a.a}</dd>
              </div>
            ))}
          </dl>
        </Card>
        {!confirmed && (
          <p className="mt-4 rounded-[14px] bg-wait-soft p-4 text-[14px] leading-relaxed text-wait">
            Because you haven’t confirmed {candidate.firstName}’s membership, their counsellor will follow up before they can
            continue. That’s fine; it’s better to be accurate.
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            disabled={submitting}
            onClick={() => {
              setSubmitting(true);
              setTimeout(() => go("done"), 700);
            }}
          >
            {submitting ? "Submitting…" : "Submit introduction"}
          </Button>
          <Button variant="ghost" onClick={() => go("questions")}>
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-rise">
      <span className="flex size-12 items-center justify-center rounded-full bg-ok-soft text-ok">
        <Check className="size-6" strokeWidth={2.5} aria-hidden />
      </span>
      <h1 ref={headingRef} tabIndex={-1} className="t-h1 mt-5 focus:outline-none">
        Thank you, {pastor.name}
      </h1>
      <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
        {confirmed
          ? `Your introduction of ${candidate.firstName} has been sent to ${link.counsellor}, the marriage counsellor responsible for their Zone.`
          : `We’ve passed your answers to ${link.counsellor}. They’ll follow up with ${candidate.firstName}, who won’t be validated without a confirmed introduction.`}
      </p>
      <p className="mt-4 flex gap-2.5 rounded-[14px] bg-sunken/70 p-4 text-[14px] leading-relaxed text-ink-2">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
        This link now only shows your answers. If you need to change something, contact the department office and it will be
        recorded as an amendment.
      </p>
      <p className="mt-8 text-[14px] text-muted">You can close this page.</p>
    </div>
  );
}
