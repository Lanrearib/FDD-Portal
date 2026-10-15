"use client";

import { Check, Clock, IdCard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { FileDrop } from "@/components/file-drop";
import { Checkbox, ChoiceCards } from "@/components/form";
import { Button, ButtonLink, Card, StatusPill } from "@/components/ui";
import type { Persona } from "@/lib/portal-data";
import { useStageUpdate } from "@/components/portal/stage-context";

type DocType = "passport" | "national_id" | "drivers_licence" | "voters_card";

const docTypes: { value: DocType; title: string; description: string; twoSided: boolean }[] = [
  { value: "passport", title: "International passport", description: "The photo page", twoSided: false },
  { value: "national_id", title: "National ID card", description: "Front and back", twoSided: true },
  { value: "drivers_licence", title: "Driver’s licence", description: "Front and back", twoSided: true },
  { value: "voters_card", title: "Voter’s card", description: "Front and back", twoSided: true },
];

const tips = [
  "All four corners are visible",
  "Text is sharp, with no glare or shadows",
  "The name matches your profile",
  "The document hasn’t expired",
];

export function IdentityFlow({ persona }: { persona: Persona }) {
  const [status, setStatus] = useState(persona.identity.status);
  const [type, setType] = useState<DocType | null>(null);
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [own, setOwn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const updateStage = useStageUpdate();

  const twoSided = docTypes.find((d) => d.value === type)?.twoSided ?? false;

  if (status === "verified") {
    return (
      <Card className="mt-7 p-6">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ok-soft text-ok">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="t-h2">Your identity is verified</h2>
              <StatusPill tone="ok">Completed</StatusPill>
            </div>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
              {persona.identity.docType}, verified {persona.identity.when}.
              {persona.identity.note ? ` ${persona.identity.note}.` : ""}
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              If your name or other details change, tell your counsellor so they can check them again.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (status === "submitted") {
    return (
      <Card className="animate-rise mt-7 p-6">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-wait-soft text-wait">
            <Clock className="size-5" aria-hidden />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="t-h2">Thanks, your ID is with your counsellor</h2>
              <StatusPill tone="wait">Pending Identity Verification</StatusPill>
            </div>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
              {persona.counsellor.name} will check it, usually within two working days. We’ll email you
              when it’s done, or if anything needs to change.
            </p>
            <ul className="mt-4 space-y-1.5 text-[14px]">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-ok" strokeWidth={2.5} aria-hidden />
                {docTypes.find((d) => d.value === type)?.title ?? "Photo ID"}
              </li>
              {[front, back].filter(Boolean).map((f) => (
                <li key={f!.name} className="flex items-center gap-2 text-ink-2">
                  <Check className="size-4 text-ok" strokeWidth={2.5} aria-hidden />
                  {f!.name}
                </li>
              ))}
            </ul>
            <ButtonLink href="/portal" variant="secondary" className="mt-6">
              Back to Home
            </ButtonLink>
          </div>
        </div>
      </Card>
    );
  }

  const submit = () => {
    const e: Record<string, string> = {};
    if (!type) e.type = "Choose the kind of ID you’re uploading.";
    if (!front) e.front = twoSided ? "Upload a photo of the front." : "Upload a photo of the photo page.";
    if (twoSided && !back) e.back = "Upload a photo of the back.";
    if (!own) e.own = "Confirm that this is your own document.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    setTimeout(() => {
      setStatus("submitted");
      updateStage("identity", { state: "waiting", status: "Pending Identity Verification", detail: "With your counsellor for review" });
    }, 700);
  };

  return (
    <form
      noValidate
      className="mt-7 space-y-7"
      onSubmit={(ev) => {
        ev.preventDefault();
        submit();
      }}
    >
      {status === "rejected" && (
        <p className="rounded-[14px] bg-bad-soft p-4 text-[14px] text-bad">
          Your last upload couldn’t be verified. {persona.identity.note}
        </p>
      )}

      <ChoiceCards<DocType>
        label="Which ID are you using?"
        value={type}
        onChange={(v) => {
          setType(v);
          setErrors((x) => ({ ...x, type: undefined }));
        }}
        error={errors.type}
        options={docTypes.map((d) => ({ value: d.value, title: d.title, description: d.description, icon: <IdCard className="size-5" aria-hidden /> }))}
      />

      {type && (
        <div className="animate-rise grid gap-5 sm:grid-cols-2">
          <FileDrop
            label={twoSided ? "Front" : "Photo page"}
            hint="JPG, PNG or PDF, up to 5 MB"
            file={front}
            onChange={(f) => {
              setFront(f);
              setErrors((x) => ({ ...x, front: undefined }));
            }}
            error={errors.front}
          />
          {twoSided && (
            <FileDrop
              label="Back"
              hint="JPG, PNG or PDF, up to 5 MB"
              file={back}
              onChange={(f) => {
                setBack(f);
                setErrors((x) => ({ ...x, back: undefined }));
              }}
              error={errors.back}
            />
          )}
        </div>
      )}

      <div className="rounded-card bg-surface p-5 ring-1 ring-line/80">
        <p className="text-[14px] font-medium">For a quick check, make sure</p>
        <ul className="mt-3 grid gap-2 text-[14px] text-ink-2 sm:grid-cols-2">
          {tips.map((t) => (
            <li key={t} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <Checkbox
        checked={own}
        onChange={(v) => {
          setOwn(v);
          setErrors((x) => ({ ...x, own: undefined }));
        }}
        error={errors.own}
        label="This is my own document, and the details on it are correct."
        description="Only authorised counsellors can see it. It’s never shown to your Pastor or anyone in a proposal."
      />

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Sending…" : "Submit for verification"}
      </Button>
    </form>
  );
}
