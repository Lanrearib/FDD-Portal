"use client";

import clsx from "clsx";
import { ArrowLeft, Check, Church, MapPin, Search, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Checkbox, ChoiceCards, Field, Input, PasswordInput, Select, Textarea } from "@/components/form";
import { JourneyPath, type StageView } from "@/components/journey-path";
import { Avatar, Button } from "@/components/ui";
import {
  activePastors,
  areaById,
  areas,
  branchById,
  branchesIn,
  pastorById,
  zoneById,
  zonalPastorFor,
  zonesIn,
} from "@/lib/reference";

type Journey = "brother" | "sister";

interface Draft {
  journey: Journey | null;
  ready: { prayed: boolean; id: boolean; pastor: boolean };
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  areaId: string;
  zoneId: string;
  branchId: string;
  pastorId: string;
  pastorUnavailable: boolean;
  fallbackReason: string;
  fallbackNote: string;
  proposalCode: string;
  privacy: boolean;
  terms: boolean;
}

const emptyDraft: Draft = {
  journey: null,
  ready: { prayed: false, id: false, pastor: false },
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  phone: "",
  areaId: "",
  zoneId: "",
  branchId: "",
  pastorId: "",
  pastorUnavailable: false,
  fallbackReason: "",
  fallbackNote: "",
  proposalCode: "",
  privacy: false,
  terms: false,
};

const steps = ["Your journey", "About you", "Your church", "Your Pastor", "Your account", "Check and submit"] as const;
const DRAFT_KEY = "fd-register-draft";

const fallbackReasons = [
  "Travelling or away for a long period",
  "On leave",
  "Recently transferred",
  "Can't be reached",
  "Another reason",
];

type Errors = Partial<Record<string, string>>;

function age(dob: string) {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return -1;
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
}

function validate(step: number, d: Draft, password: string, confirm: string): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!d.journey) e.journey = "Choose whether you are registering as a brother or a sister.";
    if (!d.ready.prayed || !d.ready.id || !d.ready.pastor) e.ready = "Tick each item when it is true for you.";
  }
  if (step === 1) {
    if (!d.firstName.trim()) e.firstName = "Enter your first name.";
    if (!d.lastName.trim()) e.lastName = "Enter your last name.";
    if (!d.dob) e.dob = "Enter your date of birth.";
    else if (age(d.dob) < 18) e.dob = "You must be 18 or older to register.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "Enter an email address like name@example.com.";
    if (d.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a phone number with its country code, like +234 803 555 0142.";
  }
  if (step === 2) {
    if (!d.areaId) e.areaId = "Choose your Area.";
    if (!d.zoneId) e.zoneId = "Choose your Zone.";
    if (!d.branchId) e.branchId = "Choose the church you attend.";
  }
  if (step === 3) {
    if (!d.pastorId) e.pastorId = "Search for your Pastor and select them.";
    if (d.pastorUnavailable) {
      if (!zonalPastorFor(d.zoneId)) e.fallback = "No Zonal Pastor is set up for your Zone yet.";
      if (!d.fallbackReason) e.fallbackReason = "Tell us why your Pastor is unavailable.";
    }
  }
  if (step === 4) {
    if (password.length < 10) e.password = "Use at least 10 characters.";
    else if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) e.password = "Use a mix of letters and numbers.";
    if (confirm !== password) e.confirm = "The two passwords don't match.";
    if (d.proposalCode && !/^[A-Z0-9]{3}-?[A-Z0-9]{3}$/i.test(d.proposalCode.trim()))
      e.proposalCode = "Proposal codes look like K7Q-4MZ. Check the code and try again.";
    if (!d.privacy) e.privacy = "Please read and accept the privacy notice.";
    if (!d.terms) e.terms = "Please accept the process terms.";
  }
  return e;
}

/* ---------- Pastor search ---------- */

export function PastorPicker({
  zoneId,
  value,
  onChange,
  error,
}: {
  zoneId: string;
  value: string;
  onChange: (id: string) => void;
  error?: string;
}) {
  const [q, setQ] = useState("");
  const selected = value ? pastorById(value) : undefined;
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = activePastors().filter((p) => {
      if (!query) return p.zoneId === zoneId;
      const branch = branchById(p.branchId)?.name.toLowerCase() ?? "";
      return p.name.toLowerCase().includes(query) || branch.includes(query);
    });
    // Pastors in the candidate's own zone first
    return list.sort((a, b) => Number(b.zoneId === zoneId) - Number(a.zoneId === zoneId));
  }, [q, zoneId]);

  if (selected) {
    return (
      <div className="flex items-center gap-4 rounded-card bg-surface p-4 ring-2 ring-ink">
        <Avatar name={selected.name} size={44} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold">{selected.name}</p>
          <p className="text-[13px] text-muted">
            {branchById(selected.branchId)?.name}, {zoneById(selected.zoneId)?.name}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => onChange("")}>
          Change
        </Button>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="pastor-search" className="block text-[14px] font-medium">
        Search the Pastor directory
      </label>
      <p className="mt-0.5 text-[12.5px] text-muted">
        Search by name or church. Only Pastors in the approved directory can be chosen.
      </p>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          id="pastor-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="For example, Adeyemi or Ikeja Central…"
          aria-invalid={!!error || undefined}
          aria-describedby={error ? "pastor-error" : undefined}
          className="h-12 w-full rounded-field bg-surface pr-4 pl-11 text-[15px] ring-1 ring-line-strong placeholder:text-faint focus:ring-2 focus:ring-ink focus:outline-none aria-invalid:ring-2 aria-invalid:ring-bad"
        />
      </div>
      <p className="mt-3 text-[12.5px] text-muted" aria-live="polite">
        {q.trim()
          ? `${results.length} ${results.length === 1 ? "Pastor" : "Pastors"} found`
          : `Pastors in ${zoneById(zoneId)?.name ?? "your Zone"}`}
      </p>
      <ul className="mt-2 max-h-[300px] space-y-1.5 overflow-y-auto scroll-thin pr-1">
        {results.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onChange(p.id)}
              className="flex w-full items-center gap-3 rounded-[14px] bg-surface p-3 text-left ring-1 ring-line transition-shadow hover:ring-ink/40"
            >
              <Avatar name={p.name} size={36} />
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-medium">{p.name}</span>
                <span className="block text-[12.5px] text-muted">
                  {branchById(p.branchId)?.name}, {zoneById(p.zoneId)?.name}
                  {p.isZonalPastor && ", Zonal Pastor"}
                </span>
              </span>
              <span className="text-[13px] font-medium text-ink-2">Select</span>
            </button>
          </li>
        ))}
      </ul>
      {results.length === 0 && (
        <div className="mt-2 rounded-[14px] bg-sunken/70 p-4 text-[13.5px] leading-relaxed text-ink-2">
          No Pastor matches “{q}”. Check the spelling, or search by church name. If your Pastor
          isn’t listed, contact the department office so they can be added.
        </div>
      )}
      {error && (
        <p id="pastor-error" className="mt-2 text-[13px] font-medium text-bad">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Review row ---------- */

function ReviewGroup({
  title,
  onEdit,
  rows,
}: {
  title: string;
  onEdit: () => void;
  rows: { label: string; value: ReactNode }[];
}) {
  return (
    <section className="rounded-card bg-surface p-5 ring-1 ring-line/80">
      <div className="flex items-center justify-between">
        <h3 className="text-[14.5px] font-semibold">{title}</h3>
        <button type="button" onClick={onEdit} className="text-[13px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
          Edit<span className="sr-only"> {title.toLowerCase()}</span>
        </button>
      </div>
      <dl className="mt-3 space-y-2 text-[14px]">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4">
            <dt className="shrink-0 text-muted">{r.label}</dt>
            <dd className="min-w-0 text-right break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- Wizard ---------- */

export function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>(emptyDraft);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Restore a saved draft (never the password) so a dropped connection doesn't lose work.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      const saved = raw ? (JSON.parse(raw) as { draft: Draft; step: number }) : null;
      // Only restore a draft that holds real answers.
      if (saved?.draft?.journey) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
        setD({ ...emptyDraft, ...saved.draft });
        setStep(Math.min(saved.step ?? 0, 4));
        setRestored(true);
      }
    } catch {
      /* storage unavailable: start fresh */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ draft: d, step }));
    } catch {
      /* ignore */
    }
  }, [d, step]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setD((prev) => ({ ...prev, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const goTo = (n: number) => {
    setStep(n);
    setErrors({});
    setRestored(false);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      window.scrollTo({ top: 0 });
    });
  };

  const next = () => {
    const e = validate(step, d, password, confirm);
    setErrors(e);
    if (Object.values(e).some(Boolean)) {
      requestAnimationFrame(() => {
        const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
        first?.focus();
      });
      return;
    }
    goTo(step + 1);
  };

  const submit = () => {
    setSubmitting(true);
    try {
      localStorage.removeItem(DRAFT_KEY);
      sessionStorage.setItem("fd-registered", JSON.stringify({ email: d.email, firstName: d.firstName, pastorId: d.pastorUnavailable ? zonalPastorFor(d.zoneId)?.id : d.pastorId }));
    } catch {
      /* ignore */
    }
    setTimeout(() => router.push(`/verify-email?email=${encodeURIComponent(d.email.trim())}`), 600);
  };

  const zonal = d.zoneId ? zonalPastorFor(d.zoneId) : undefined;
  const pastor = d.pastorId ? pastorById(d.pastorId) : undefined;
  const introducer = d.pastorUnavailable ? zonal : pastor;

  const previewStages: StageView[] = [
    { key: "email", title: "Verify your email", state: step === 5 ? "action" : "locked", status: "Awaiting Candidate", detail: "We’ll send a 6-digit code", lockReason: "Right after you submit." },
    { key: "id", title: "Verify your identity", state: "locked", status: "Not Started", lockReason: "Upload a photo ID after your email is verified." },
    {
      key: "pastor",
      title: "Pastor’s introduction",
      state: "locked",
      status: "Not Started",
      lockReason: introducer
        ? `${introducer.name} will be emailed a private link once your email is verified.`
        : "Your Pastor is emailed a private link once your email is verified.",
    },
    { key: "appt", title: "Meet your counsellor", state: "locked", status: "Not Started", lockReason: "Booked once your checks are complete." },
  ];

  return (
    <AuthShell
      wide
      back={{ href: "/start", label: "Back" }}
      aside={
        <div>
          <h2 className="t-h2">What happens after you register</h2>
          <p className="mt-2 max-w-[42ch] text-[14.5px] leading-relaxed text-ink-2">
            Registering opens your record. You’re validated once your email, your identity and your
            Pastor’s introduction are all confirmed.
          </p>
          <div className="mt-6 rounded-card bg-surface/80 p-5 ring-1 ring-white">
            <JourneyPath stages={previewStages} title="Next steps" />
          </div>
        </div>
      }
    >
      {/* Progress */}
      <div>
        <p className="text-[13px] text-muted">
          Step {step + 1} of {steps.length}
        </p>
        <div className="mt-2 flex gap-1" aria-hidden>
          {steps.map((s, i) => (
            <span key={s} className={clsx("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-ink" : "bg-line")} />
          ))}
        </div>
      </div>

      <h1 ref={headingRef} tabIndex={-1} className="t-h1 mt-6 focus:outline-none">
        {
          [
            "Begin your marriage journey",
            "Tell us about yourself",
            "Where do you worship?",
            "Who will introduce you?",
            "Secure your account",
            "Check your details",
          ][step]
        }
      </h1>

      {restored && step > 0 && (
        <p className="mt-3 rounded-[12px] bg-info-soft px-3.5 py-2.5 text-[13px] text-info">
          We restored the answers you saved on this device.
        </p>
      )}

      <form
        noValidate
        className="mt-7 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === steps.length - 1) submit();
          else next();
        }}
      >
        {step === 0 && (
          <>
            <ChoiceCards<Journey>
              label="I am registering as a"
              value={d.journey}
              onChange={(v) => set("journey", v)}
              error={errors.journey}
              options={[
                { value: "brother", title: "Brother", description: "You will propose, after your Pastor’s introduction.", icon: <UserRound className="size-5" aria-hidden /> },
                { value: "sister", title: "Sister", description: "You will respond, after your own Pastor’s introduction.", icon: <UsersRound className="size-5" aria-hidden /> },
              ]}
            />
            <fieldset className="rounded-card bg-surface p-5 ring-1 ring-line/80">
              <legend className="sr-only">Before you begin</legend>
              <p className="text-[14px] font-medium">Before you begin</p>
              <div className="mt-4 space-y-3.5">
                <Checkbox
                  checked={d.ready.prayed}
                  onChange={(v) => set("ready", { ...d.ready, prayed: v })}
                  label="I have prayed through this decision."
                />
                <Checkbox
                  checked={d.ready.id}
                  onChange={(v) => set("ready", { ...d.ready, id: v })}
                  label="I have a valid photo ID to hand."
                  description="A passport, national ID card, driver’s licence or voter’s card."
                />
                <Checkbox
                  checked={d.ready.pastor}
                  onChange={(v) => set("ready", { ...d.ready, pastor: v })}
                  label="I have spoken to my Pastor about this."
                />
              </div>
              {errors.ready && <p className="mt-3 text-[13px] font-medium text-bad">{errors.ready}</p>}
            </fieldset>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" error={errors.firstName}>
                <Input autoComplete="given-name" value={d.firstName} onChange={(e) => set("firstName", e.target.value)} />
              </Field>
              <Field label="Last name" error={errors.lastName}>
                <Input autoComplete="family-name" value={d.lastName} onChange={(e) => set("lastName", e.target.value)} />
              </Field>
            </div>
            <Field label="Date of birth" hint="You must be 18 or older." error={errors.dob}>
              <Input type="date" autoComplete="bday" value={d.dob} max="2008-10-15" onChange={(e) => set("dob", e.target.value)} />
            </Field>
            <Field label="Email address" hint="We’ll send a code here to verify it. This is also how you’ll sign in." error={errors.email}>
              <Input type="email" autoComplete="email" inputMode="email" value={d.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Phone number" hint="Include your country code." error={errors.phone}>
              <Input type="tel" autoComplete="tel" placeholder="+234 803 555 0142" value={d.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Area" error={errors.areaId}>
              <Select
                value={d.areaId}
                onChange={(e) => {
                  setD((p) => ({ ...p, areaId: e.target.value, zoneId: "", branchId: "", pastorId: "", pastorUnavailable: false }));
                  setErrors((x) => ({ ...x, areaId: undefined }));
                }}
              >
                <option value="">Choose your Area</option>
                {["West Africa", "Central Africa"].map((region) => (
                  <optgroup key={region} label={region}>
                    {areas.filter((a) => a.region === region).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </Field>
            <Field label="Zone" error={errors.zoneId}>
              <Select
                value={d.zoneId}
                disabled={!d.areaId}
                onChange={(e) => {
                  setD((p) => ({ ...p, zoneId: e.target.value, branchId: "", pastorId: "", pastorUnavailable: false }));
                  setErrors((x) => ({ ...x, zoneId: undefined }));
                }}
              >
                <option value="">{d.areaId ? "Choose your Zone" : "Choose an Area first"}</option>
                {zonesIn(d.areaId).map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Church" error={errors.branchId}>
              <Select value={d.branchId} disabled={!d.zoneId} onChange={(e) => set("branchId", e.target.value)}>
                <option value="">{d.zoneId ? "Choose the church you attend" : "Choose a Zone first"}</option>
                {branchesIn(d.zoneId).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </Field>
            <p className="flex gap-2.5 rounded-[14px] bg-sunken/70 p-4 text-[13.5px] leading-relaxed text-ink-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
              Your Area and Zone decide which marriage counsellor looks after your case.
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <PastorPicker zoneId={d.zoneId} value={d.pastorId} onChange={(id) => set("pastorId", id)} error={errors.pastorId} />

            {d.pastorId && (
              <div className="rounded-card bg-surface p-5 ring-1 ring-line/80">
                <Checkbox
                  checked={d.pastorUnavailable}
                  onChange={(v) => set("pastorUnavailable", v)}
                  label="My Pastor is unavailable to introduce me"
                  description="Your Zonal Pastor can stand in. Your own Pastor stays on your record."
                />
                {d.pastorUnavailable && (
                  <div className="animate-rise mt-5 space-y-5 border-t border-line/80 pt-5">
                    {zonal ? (
                      <div className="flex items-center gap-3">
                        <Avatar name={zonal.name} size={40} />
                        <div>
                          <p className="text-[12.5px] text-muted">Zonal Pastor for {zoneById(d.zoneId)?.name}</p>
                          <p className="text-[15px] font-semibold">{zonal.name}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[13.5px] font-medium text-bad">{errors.fallback ?? "No Zonal Pastor is set up for your Zone yet. Please contact the department office."}</p>
                    )}
                    <Field label="Why is your Pastor unavailable?" error={errors.fallbackReason}>
                      <Select value={d.fallbackReason} onChange={(e) => set("fallbackReason", e.target.value)}>
                        <option value="">Choose a reason</option>
                        {fallbackReasons.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Anything the counsellor should know?" optional>
                      <Textarea rows={3} value={d.fallbackNote} onChange={(e) => set("fallbackNote", e.target.value)} />
                    </Field>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <Field label="Create a password" hint="At least 10 characters, with letters and numbers." error={errors.password}>
              <PasswordInput autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: undefined })); }} />
            </Field>
            <Field label="Confirm your password" error={errors.confirm}>
              <PasswordInput autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setErrors((x) => ({ ...x, confirm: undefined })); }} />
            </Field>
            {d.journey === "sister" && (
              <Field
                label="Proposal code"
                optional
                hint="If a brother has formally shared his intention, he can give you a code that links your proposal. You can also add it later."
                error={errors.proposalCode}
              >
                <Input
                  value={d.proposalCode}
                  onChange={(e) => set("proposalCode", e.target.value.toUpperCase())}
                  placeholder="K7Q-4MZ"
                  autoComplete="off"
                  className="tracking-[0.12em] uppercase"
                />
              </Field>
            )}
            <div className="space-y-3.5 rounded-card bg-surface p-5 ring-1 ring-line/80">
              <Checkbox
                checked={d.privacy}
                onChange={(v) => set("privacy", v)}
                error={errors.privacy}
                label={
                  <>
                    I have read the{" "}
                    <Link href="/privacy" target="_blank" className="font-medium underline underline-offset-4">
                      privacy notice
                    </Link>{" "}
                    and understand how my information is used.
                  </>
                }
              />
              <Checkbox
                checked={d.terms}
                onChange={(v) => set("terms", v)}
                error={errors.terms}
                label="I understand that registering doesn’t approve me to proceed, and that each stage is reviewed by the church."
              />
            </div>
          </>
        )}

        {step === 5 && (
          <div className="space-y-4">
            {introducer && (
              <div className="rounded-card bg-ink p-5 text-white">
                <p className="text-[13px] text-white/70">Your introduction will be sent to</p>
                <div className="mt-3 flex items-center gap-3">
                  <Avatar name={introducer.name} size={44} className="ring-white/30" />
                  <div>
                    <p className="text-[16px] font-semibold">{introducer.name}</p>
                    <p className="text-[13px] text-white/75">
                      {branchById(introducer.branchId)?.name}, {zoneById(introducer.zoneId)?.name}
                    </p>
                  </div>
                </div>
                {d.pastorUnavailable && pastor && (
                  <p className="mt-4 border-t border-white/15 pt-3 text-[13px] text-white/75">
                    Standing in for {pastor.name}. Reason: {d.fallbackReason.toLowerCase()}.
                  </p>
                )}
              </div>
            )}
            <ReviewGroup
              title="About you"
              onEdit={() => goTo(1)}
              rows={[
                { label: "Registering as", value: d.journey === "brother" ? "Brother" : "Sister" },
                { label: "Name", value: `${d.firstName} ${d.lastName}` },
                { label: "Date of birth", value: d.dob && new Date(d.dob).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                { label: "Email", value: d.email },
                { label: "Phone", value: d.phone },
              ]}
            />
            <ReviewGroup
              title="Your church"
              onEdit={() => goTo(2)}
              rows={[
                { label: "Church", value: branchById(d.branchId)?.name },
                { label: "Zone", value: zoneById(d.zoneId)?.name },
                { label: "Area", value: areaById(d.areaId)?.name },
              ]}
            />
            <ReviewGroup
              title="Your Pastor"
              onEdit={() => goTo(3)}
              rows={[
                { label: "Your Pastor", value: pastor?.name },
                ...(d.pastorUnavailable ? [{ label: "Standing in", value: zonal?.name }] : []),
                ...(d.proposalCode ? [{ label: "Proposal code", value: d.proposalCode }] : []),
              ]}
            />
            <p className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
              Your details are seen only by the counsellors responsible for your case. Your Pastor sees
              your name and reference, not your documents.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line/80 pt-6">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => goTo(step - 1)}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" size="lg" disabled={submitting}>
            {step === steps.length - 1 ? (
              submitting ? "Creating your profile…" : (
                <>
                  <Check className="size-4" strokeWidth={2.5} aria-hidden />
                  Create my profile
                </>
              )
            ) : (
              "Continue"
            )}
          </Button>
        </div>
        {step < 5 && (
          <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
            <Church className="size-3.5" aria-hidden />
            Your answers are saved on this device as you go. Your password is never saved.
          </p>
        )}
      </form>
    </AuthShell>
  );
}
