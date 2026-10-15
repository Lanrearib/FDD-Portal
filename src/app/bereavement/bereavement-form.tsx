"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/form";
import { Button, ButtonLink, Card } from "@/components/ui";
import { areas } from "@/lib/reference";

const kinds = [
  "Someone to talk to",
  "Prayer",
  "A visit from a Pastor",
  "Help with funeral arrangements",
  "Support for children in the family",
];

export function BereavementForm() {
  const [f, setF] = useState({ name: "", contact: "phone", contactValue: "", area: "", relationship: "", times: "", more: "", privacy: false });
  const [support, setSupport] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const top = useRef<HTMLHeadingElement>(null);
  const set = (k: keyof typeof f, v: string | boolean) => {
    setF((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  if (done)
    return (
      <Card className="animate-rise p-6 sm:p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-sunken text-ink">
          <Check className="size-6" strokeWidth={2.5} aria-hidden />
        </span>
        <h2 ref={top} tabIndex={-1} className="t-h1 mt-5 focus:outline-none">
          We’ve received your request
        </h2>
        <p className="mt-3 max-w-[56ch] text-[15.5px] leading-relaxed text-ink-2">
          Someone from the department will contact you, usually within two working days. We’re sorry for your loss, and we’re
          praying for you and your family.
        </p>
        <p className="mt-4 text-[14px] text-muted">
          Your reference is <span className="font-semibold text-ink tabular-nums">SR-26-033</span>. If you need to speak to someone
          sooner, contact your Pastor or the department office.
        </p>
        <ButtonLink href="/" variant="secondary" className="mt-7">
          Back to the home page
        </ButtonLink>
      </Card>
    );

  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Enter your name.";
    if (f.contact === "email" ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contactValue.trim()) : f.contactValue.replace(/\D/g, "").length < 10)
      e.contactValue = f.contact === "email" ? "Enter an email address like name@example.com." : "Enter a phone number with its country code.";
    if (!f.area) e.area = "Choose your Area so someone nearby can help.";
    if (!f.privacy) e.privacy = "Please confirm you’ve read how we keep your request private.";
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setSending(true);
    setTimeout(() => {
      setDone(true);
      window.scrollTo({ top: 0 });
      requestAnimationFrame(() => top.current?.focus());
    }, 700);
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-8"
    >
      <Card className="space-y-5 p-5 sm:p-7">
        <h2 className="t-h2">How we can reach you</h2>
        <Field label="Your name" error={errors.name}>
          <Input autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
          <Field label="Contact me by">
            <Select value={f.contact} onChange={(e) => set("contact", e.target.value)}>
              <option value="phone">Phone call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </Select>
          </Field>
          <Field label={f.contact === "email" ? "Email address" : "Phone number"} error={errors.contactValue}>
            <Input type={f.contact === "email" ? "email" : "tel"} autoComplete={f.contact === "email" ? "email" : "tel"} value={f.contactValue} onChange={(e) => set("contactValue", e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Area" error={errors.area}>
            <Select value={f.area} onChange={(e) => set("area", e.target.value)}>
              <option value="">Choose your Area</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Good times to call" optional>
            <Input value={f.times} onChange={(e) => set("times", e.target.value)} placeholder="For example, any morning" />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5 p-5 sm:p-7">
        <h2 className="t-h2">The support you’d like</h2>
        <Field label="Who have you lost?" optional hint="For example, your mother or a child. Only if you’d like to say.">
          <Input value={f.relationship} onChange={(e) => set("relationship", e.target.value)} />
        </Field>
        <fieldset>
          <legend className="text-[14px] font-medium">
            What would help? <span className="font-normal text-muted">Choose any, or none</span>
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {kinds.map((k) => (
              <Checkbox key={k} label={k} checked={support.includes(k)} onChange={(v) => setSupport((s) => (v ? [...s, k] : s.filter((x) => x !== k)))} />
            ))}
          </div>
        </fieldset>
        <Field label="Anything else you’d like us to know?" optional>
          <Textarea rows={4} value={f.more} onChange={(e) => set("more", e.target.value)} />
        </Field>
      </Card>

      <div className="space-y-6">
        <Checkbox
          checked={f.privacy}
          onChange={(v) => set("privacy", v)}
          error={errors.privacy}
          label={
            <>
              I understand this request is confidential and seen only by the people who will help, as described in the{" "}
              <Link href="/privacy" target="_blank" className="font-medium underline underline-offset-4">
                privacy notice
              </Link>
              .
            </>
          }
        />
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? "Sending…" : "Send request"}
        </Button>
      </div>
    </form>
  );
}
