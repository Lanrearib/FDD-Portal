"use client";

import { Check, MailCheck, Pencil } from "lucide-react";
import { useState } from "react";
import { CodeInput, Field, Input, Select } from "@/components/form";
import { Button, Card, StatusPill } from "@/components/ui";
import type { Persona } from "@/lib/portal-data";
import { branches, zoneById, zones } from "@/lib/reference";

type Editing = null | "contact" | "church";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-[13.5px] text-muted">{label}</dt>
      <dd className="text-[14.5px] break-words">{value}</dd>
    </div>
  );
}

export function ProfileEditor({ persona }: { persona: Persona }) {
  const [editing, setEditing] = useState<Editing>(null);
  const [email, setEmail] = useState(persona.email);
  const [phone, setPhone] = useState(persona.phone);
  const [draftEmail, setDraftEmail] = useState(persona.email);
  const [draftPhone, setDraftPhone] = useState(persona.phone);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [church, setChurch] = useState(persona.church);
  const [draftBranch, setDraftBranch] = useState(branches.find((b) => b.name === persona.church)?.id ?? "");
  const [version, setVersion] = useState(3);
  const [saved, setSaved] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const [zone, setZone] = useState(persona.zone);
  const draftZone = zoneById(branches.find((b) => b.id === draftBranch)?.zoneId ?? "")?.name;
  const zoneChanges = !!draftZone && draftZone !== zone;

  const saveContact = () => {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draftEmail.trim())) e.email = "Enter an email address like name@example.com.";
    if (draftPhone.replace(/\D/g, "").length < 10) e.phone = "Enter a phone number with its country code.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setPhone(draftPhone);
    if (draftEmail.trim() !== email) {
      setPendingEmail(draftEmail.trim());
      setSaved(null);
    } else {
      setVersion((v) => v + 1);
      setSaved("Contact details saved.");
    }
    setEditing(null);
  };

  return (
    <div className="mt-7 space-y-5">
      {saved && (
        <p role="status" className="animate-rise flex items-center gap-2 rounded-[14px] bg-ok-soft px-4 py-3 text-[14px] text-ok">
          <Check className="size-4" strokeWidth={2.5} aria-hidden />
          {saved}
        </p>
      )}

      {pendingEmail && (
        <Card className="animate-rise p-5 sm:p-6">
          <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-wait-soft text-wait">
              <MailCheck className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="t-h3">Confirm your new email address</h2>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                We sent a code to <span className="font-medium text-ink">{pendingEmail}</span>. Until you enter it, we’ll keep
                using {email}.
              </p>
              <form
                className="mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (code !== "246810") return setCodeError("That code isn’t right. Prototype: use 246810.");
                  setEmail(pendingEmail);
                  setDraftEmail(pendingEmail);
                  setPendingEmail(null);
                  setCode("");
                  setVersion((v) => v + 1);
                  setSaved("Your new email address is verified and saved.");
                }}
              >
                <CodeInput value={code} onChange={(v) => { setCode(v); setCodeError(null); }} invalid={!!codeError} />
                {codeError && <p role="alert" className="mt-2 text-[13px] font-medium text-bad">{codeError}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="submit">Verify new email</Button>
                  <Button variant="ghost" onClick={() => { setPendingEmail(null); setDraftEmail(email); }}>
                    Keep my current email
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="t-h2">About you</h2>
          <StatusPill tone="ok">Verified</StatusPill>
        </div>
        <dl className="mt-2 divide-y divide-line/80">
          <Row label="Name" value={persona.name} />
          <Row label="Date of birth" value={persona.dob} />
          <Row label="Registering as" value={persona.gender === "brother" ? "Brother" : "Sister"} />
          <Row label="Profile reference" value={persona.profileRef} />
        </dl>
        <p className="mt-3 text-[13px] text-muted">Your name and date of birth are checked against your ID. To change them, message your counsellor.</p>
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="t-h2">Contact details</h2>
          {editing !== "contact" && (
            <Button variant="secondary" size="sm" onClick={() => { setEditing("contact"); setSaved(null); }}>
              <Pencil className="size-3.5" aria-hidden />
              Edit
            </Button>
          )}
        </div>
        {editing === "contact" ? (
          <form noValidate className="mt-5 space-y-5" onSubmit={(e) => { e.preventDefault(); saveContact(); }}>
            <Field label="Email address" hint="If you change it, we’ll send a code to the new address to confirm it." error={errors.email}>
              <Input type="email" value={draftEmail} onChange={(e) => setDraftEmail(e.target.value)} />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <Input type="tel" value={draftPhone} onChange={(e) => setDraftPhone(e.target.value)} />
            </Field>
            <div className="flex gap-2">
              <Button type="submit">Save changes</Button>
              <Button variant="ghost" onClick={() => { setEditing(null); setDraftEmail(email); setDraftPhone(phone); setErrors({}); }}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="mt-2 divide-y divide-line/80">
            <Row label="Email" value={email} />
            <Row label="Phone" value={phone} />
          </dl>
        )}
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="t-h2">Your church</h2>
          {editing !== "church" && (
            <Button variant="secondary" size="sm" onClick={() => { setEditing("church"); setSaved(null); }}>
              <Pencil className="size-3.5" aria-hidden />
              Edit
            </Button>
          )}
        </div>
        {editing === "church" ? (
          <form
            noValidate
            className="mt-5 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setChurch(branches.find((b) => b.id === draftBranch)?.name ?? church);
              if (draftZone) setZone(draftZone);
              setVersion((v) => v + 1);
              setEditing(null);
              setSaved(zoneChanges ? `Saved. Your case will be routed to the ${draftZone} counsellor.` : "Church details saved.");
            }}
          >
            <Field label="Church">
              <Select value={draftBranch} onChange={(e) => setDraftBranch(e.target.value)}>
                {zones.map((z) => (
                  <optgroup key={z.id} label={z.name}>
                    {branches.filter((b) => b.zoneId === z.id).map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </Field>
            {zoneChanges && (
              <p className="rounded-[14px] bg-wait-soft p-4 text-[14px] leading-relaxed text-wait">
                This church is in {draftZone}. Saving moves your case to that Zone’s counsellor. Your history and documents
                move with it.
              </p>
            )}
            <div className="flex gap-2">
              <Button type="submit">Save changes</Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="mt-2 divide-y divide-line/80">
            <Row label="Church" value={church} />
            <Row label="Zone" value={zone} />
            <Row label="Area" value={persona.area} />
            <Row label="Pastor" value={persona.pastor.name} />
          </dl>
        )}
      </Card>

      <p className="text-[13px] text-muted">
        Profile version {version}, last confirmed {persona.profileConfirmed}. Changes are recorded, and your counsellor can see
        what changed.
      </p>
    </div>
  );
}
