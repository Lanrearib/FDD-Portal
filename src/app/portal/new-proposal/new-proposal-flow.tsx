"use client";

import clsx from "clsx";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PastorPicker } from "@/app/register/register-wizard";
import { Checkbox, Field, Input } from "@/components/form";
import { Avatar, Button, ButtonLink, Card } from "@/components/ui";
import type { Persona } from "@/lib/portal-data";
import { branchById, pastorById, pastors, zoneById, zones } from "@/lib/reference";

export function NewProposalFlow({ persona }: { persona: Persona }) {
  const steps = persona.gender === "sister" ? ["Your details", "Your Pastor", "Proposal code"] : ["Your details", "Your Pastor"];
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const currentPastor = pastors.find((p) => p.name === persona.pastor.name);
  const [pastorId, setPastorId] = useState(currentPastor?.id ?? "");
  const [changing, setChanging] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const zoneId = zones.find((z) => z.name === persona.zone)?.id ?? "ikeja";
  const pastor = pastorById(pastorId);

  const next = () => {
    if (step === 0 && !confirmed) return setError("Confirm your details are correct, or update your profile first.");
    if (step === 1 && !pastorId) return setError("Choose the Pastor who will introduce you.");
    if (step === 2 && code && !/^[A-Z0-9]{3}-?[A-Z0-9]{3}$/i.test(code.trim())) return setError("Proposal codes look like K7Q-4MZ.");
    setError(null);
    if (step === steps.length - 1) setDone(true);
    else setStep(step + 1);
  };

  if (done) {
    return (
      <div className="animate-rise mt-7 space-y-5">
        <Card className="p-6">
          <span className="flex size-11 items-center justify-center rounded-full bg-ok-soft text-ok">
            <Check className="size-5" strokeWidth={2.5} aria-hidden />
          </span>
          <h2 className="t-h2 mt-4">Your new proposal has started</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
            Its reference is <span className="font-semibold text-ink tabular-nums">APP-26-0442</span>. Your profile reference stays{" "}
            <span className="tabular-nums">{persona.profileRef}</span>.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[14px] bg-ok-soft/60 p-4">
              <p className="text-[13.5px] font-semibold text-ok">Carried over</p>
              <ul className="mt-2 space-y-1.5 text-[14px]">
                <li>Your profile and contact details</li>
                <li>Your verified email and identity</li>
              </ul>
            </div>
            <div className="rounded-[14px] bg-sunken/80 p-4">
              <p className="flex items-center gap-1.5 text-[13.5px] font-semibold">
                <RotateCcw className="size-3.5" aria-hidden />
                Starts fresh
              </p>
              <ul className="mt-2 space-y-1.5 text-[14px]">
                <li>{pastor?.name ?? "Your Pastor"}’s introduction</li>
                <li>Your consent letter and appointments</li>
                <li>Messages and decisions</li>
              </ul>
            </div>
          </div>
          <ButtonLink href="/portal" className="mt-6">
            Go to Home
          </ButtonLink>
        </Card>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="mt-7"
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
    >
      <ol className="flex flex-wrap gap-2" aria-label="Steps">
        {steps.map((s, i) => (
          <li
            key={s}
            aria-current={i === step ? "step" : undefined}
            className={clsx(
              "flex h-8 items-center gap-2 rounded-full pr-3.5 pl-1.5 text-[13px] font-medium",
              i === step ? "bg-ink text-white" : i < step ? "bg-surface text-ink ring-1 ring-line" : "text-muted ring-1 ring-line",
            )}
          >
            <span className={clsx("flex size-5 items-center justify-center rounded-full text-[11px]", i === step ? "bg-white/20" : "bg-sunken")}>
              {i < step ? <Check className="size-3" strokeWidth={3} aria-hidden /> : i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-6 space-y-5">
        {step === 0 && (
          <>
            <Card className="p-5 sm:p-6">
              <h2 className="t-h3">Are these still correct?</h2>
              <dl className="mt-3 divide-y divide-line/80 text-[14.5px]">
                {[
                  ["Name", persona.name],
                  ["Email", persona.email],
                  ["Phone", persona.phone],
                  ["Church", `${persona.church}, ${persona.zone}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[13px] text-muted">
                Last confirmed {persona.profileConfirmed}.{" "}
                <Link href="/portal/profile" className="font-medium text-ink underline decoration-line-strong underline-offset-4">
                  Update your profile
                </Link>{" "}
                if anything has changed. A new email address needs a code to confirm it.
              </p>
            </Card>
            <Checkbox
              checked={confirmed}
              onChange={(v) => {
                setConfirmed(v);
                setError(null);
              }}
              error={error}
              label="My details are correct."
            />
          </>
        )}

        {step === 1 && (
          <>
            <p className="rounded-[14px] bg-info-soft px-4 py-3 text-[14px] leading-relaxed text-info">
              Each proposal needs a fresh introduction. Your Pastor will get a new private link.
            </p>
            {pastor && !changing ? (
              <div className="flex flex-wrap items-center gap-4 rounded-card bg-surface p-4 ring-2 ring-ink">
                <Avatar name={pastor.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{pastor.name}</p>
                  <p className="text-[13px] text-muted">
                    {branchById(pastor.branchId)?.name}, {zoneById(pastor.zoneId)?.name}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => { setChanging(true); setPastorId(""); }}>
                  Choose a different Pastor
                </Button>
              </div>
            ) : (
              <PastorPicker
                zoneId={zoneId}
                value={pastorId}
                onChange={(id) => {
                  setPastorId(id);
                  setChanging(false);
                  setError(null);
                }}
                error={error ?? undefined}
              />
            )}
          </>
        )}

        {step === 2 && (
          <Field
            label="Proposal code"
            optional
            hint="If the brother has shared his intention, enter the code he gave you. You can also add it later."
            error={error}
          >
            <Input value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }} placeholder="K7Q-4MZ" autoComplete="off" className="tracking-[0.12em] uppercase" />
          </Field>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line/80 pt-6">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => { setStep(step - 1); setError(null); }}>
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg">
          {step === steps.length - 1 ? "Start new proposal" : "Continue"}
        </Button>
      </div>
    </form>
  );
}
