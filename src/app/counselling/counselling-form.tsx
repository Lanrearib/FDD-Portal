"use client";

import clsx from "clsx";
import { Check, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/form";
import { Button, ButtonLink, Card } from "@/components/ui";
import { areas } from "@/lib/reference";

const reasons = [
  "A routine check-in",
  "Communication",
  "Money and finances",
  "Family and in-laws",
  "Parenting",
  "Rebuilding trust",
  "Something else",
];

const times = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekends"];

export function CounsellingForm() {
  const [f, setF] = useState({
    you: "",
    spouse: "",
    years: "",
    area: "",
    contact: "phone",
    contactValue: "",
    reason: "",
    details: "",
    spouseAware: "",
    privacy: false,
  });
  const [when, setWhen] = useState<string[]>([]);
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
        <span className="flex size-12 items-center justify-center rounded-full bg-ok-soft text-ok">
          <Check className="size-6" strokeWidth={2.5} aria-hidden />
        </span>
        <h2 ref={top} tabIndex={-1} className="t-h1 mt-5 focus:outline-none">
          Thank you, {f.you.split(" ")[0]}
        </h2>
        <p className="mt-3 max-w-[56ch] text-[15.5px] leading-relaxed text-ink-2">
          Your request has reached the department. A counsellor for {areas.find((a) => a.id === f.area)?.name} will contact you by{" "}
          {f.contact === "email" ? "email" : f.contact === "whatsapp" ? "WhatsApp" : "phone"}, usually within three working days.
        </p>
        <p className="mt-4 text-[14px] text-muted">
          Your reference is <span className="font-semibold text-ink tabular-nums">SR-26-032</span>.
        </p>
        <ButtonLink href="/" variant="secondary" className="mt-7">
          Back to the home page
        </ButtonLink>
      </Card>
    );

  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.you.trim()) e.you = "Enter your name.";
    if (!f.spouse.trim()) e.spouse = "Enter your spouse’s name.";
    if (!f.area) e.area = "Choose your Area so the right counsellor can help.";
    if (f.contact === "email" ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contactValue.trim()) : f.contactValue.replace(/\D/g, "").length < 10)
      e.contactValue = f.contact === "email" ? "Enter an email address like name@example.com." : "Enter a phone number with its country code.";
    if (!f.reason) e.reason = "Choose the closest reason. You can explain more below.";
    if (when.length === 0) e.when = "Choose at least one time that suits you.";
    if (!f.privacy) e.privacy = "Please confirm you’ve read how we handle your request.";
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
        <h2 className="t-h2">About you both</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" error={errors.you}>
            <Input autoComplete="name" value={f.you} onChange={(e) => set("you", e.target.value)} />
          </Field>
          <Field label="Your spouse’s name" error={errors.spouse}>
            <Input value={f.spouse} onChange={(e) => set("spouse", e.target.value)} />
          </Field>
          <Field label="How long have you been married?" optional>
            <Select value={f.years} onChange={(e) => set("years", e.target.value)}>
              <option value="">Choose one</option>
              <option>Less than a year</option>
              <option>1 to 5 years</option>
              <option>6 to 15 years</option>
              <option>More than 15 years</option>
            </Select>
          </Field>
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
        </div>
        <fieldset>
          <legend className="text-[14px] font-medium">Does your spouse know you’re asking for counselling?</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {["Yes, we’re asking together", "Not yet", "I’d rather not say"].map((o) => (
              <label key={o} className={clsx("flex h-10 cursor-pointer items-center rounded-full px-4 text-[14px] ring-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink", f.spouseAware === o ? "bg-ink text-white ring-ink" : "bg-surface ring-line-strong hover:ring-ink/40")}>
                <input type="radio" name="aware" className="sr-only" checked={f.spouseAware === o} onChange={() => set("spouseAware", o)} />
                {o}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-muted">This helps the counsellor know how to contact you. Either answer is fine.</p>
        </fieldset>
      </Card>

      <Card className="space-y-5 p-5 sm:p-7">
        <h2 className="t-h2">What would help</h2>
        <Field label="What would you like to talk about?" error={errors.reason}>
          <Select value={f.reason} onChange={(e) => set("reason", e.target.value)}>
            <option value="">Choose the closest</option>
            {reasons.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
        <Field label="Anything you’d like the counsellor to know first?" optional hint="Share as much or as little as you like. Only the counsellor who contacts you will read it.">
          <Textarea rows={4} value={f.details} onChange={(e) => set("details", e.target.value)} />
        </Field>
      </Card>

      <Card className="space-y-5 p-5 sm:p-7">
        <h2 className="t-h2">How to reach you</h2>
        <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
          <Field label="Contact me by">
            <Select value={f.contact} onChange={(e) => set("contact", e.target.value)}>
              <option value="phone">Phone call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </Select>
          </Field>
          <Field label={f.contact === "email" ? "Email address" : "Phone number"} error={errors.contactValue}>
            <Input type={f.contact === "email" ? "email" : "tel"} autoComplete={f.contact === "email" ? "email" : "tel"} value={f.contactValue} onChange={(e) => set("contactValue", e.target.value)} placeholder={f.contact === "email" ? "" : "+234 803 555 0142"} />
          </Field>
        </div>
        <fieldset aria-describedby={errors.when ? "when-error" : undefined}>
          <legend className="text-[14px] font-medium">When is a good time?</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {times.map((t) => (
              <Checkbox key={t} label={t} checked={when.includes(t)} onChange={(v) => { setWhen((w) => (v ? [...w, t] : w.filter((x) => x !== t))); setErrors((e) => ({ ...e, when: undefined })); }} />
            ))}
          </div>
          {errors.when && (
            <p id="when-error" className="mt-2 text-[13px] font-medium text-bad">
              {errors.when}
            </p>
          )}
        </fieldset>
      </Card>

      <div className="space-y-6">
        <Checkbox
          checked={f.privacy}
          onChange={(v) => set("privacy", v)}
          error={errors.privacy}
          label={
            <>
              I understand my request is seen only by the department’s counsellors, as described in the{" "}
              <Link href="/privacy" target="_blank" className="font-medium underline underline-offset-4">
                privacy notice
              </Link>
              .
            </>
          }
        />
        <Button type="submit" size="lg" disabled={sending}>
          <HeartHandshake className="size-4" aria-hidden />
          {sending ? "Sending…" : "Send request"}
        </Button>
      </div>
    </form>
  );
}
