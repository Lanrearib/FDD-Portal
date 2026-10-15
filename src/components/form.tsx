"use client";

import clsx from "clsx";
import { Check, ChevronDown, Eye, EyeOff } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

/* ---------- Field: label + hint + error, wired for screen readers ---------- */

export function Field({
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  children: ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>;
  className?: string;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control = isValidElement(children)
    ? cloneElement(children, { id, "aria-describedby": describedBy, "aria-invalid": !!error || undefined })
    : children;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[14px] font-medium">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">Optional</span>}
      </label>
      {hint && (
        <p id={hintId} className="mt-0.5 text-[12.5px] leading-snug text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{control}</div>
      {error && (
        <p id={errorId} className="mt-1.5 text-[13px] font-medium text-bad">
          {error}
        </p>
      )}
    </div>
  );
}

const controlBase =
  "w-full rounded-field bg-surface text-[15px] text-ink ring-1 ring-line-strong transition-shadow placeholder:text-faint hover:ring-ink/30 focus:ring-2 focus:ring-ink focus:outline-none aria-invalid:ring-2 aria-invalid:ring-bad disabled:bg-sunken disabled:text-muted";

export function Input({ className, ...props }: ComponentProps<"input">) {
  // Email addresses, phone numbers and codes aren't words; don't spellcheck them.
  const noSpell = props.type === "email" || props.type === "tel" || props.autoComplete === "off";
  return <input spellCheck={noSpell ? false : undefined} className={clsx(controlBase, "h-12 px-4", className)} {...props} />;
}

export function PasswordInput({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? "text" : "password"} className={clsx(controlBase, "h-12 pr-12 pl-4", className)} {...props} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={clsx(controlBase, "h-12 appearance-none pr-10 pl-4", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={clsx(controlBase, "min-h-28 resize-y px-4 py-3 leading-relaxed", className)} {...props} />;
}

/* ---------- Checkbox ---------- */

export function Checkbox({
  label,
  description,
  checked,
  onChange,
  error,
}: {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string | null;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="group flex cursor-pointer gap-3">
        <span className="relative mt-0.5 flex size-5 shrink-0">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={!!error || undefined}
            className="peer size-5 cursor-pointer appearance-none rounded-[6px] bg-surface ring-1 ring-line-strong checked:bg-ink checked:ring-ink focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:outline-none aria-invalid:ring-bad"
          />
          <Check className="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} aria-hidden />
        </span>
        <span className="text-[14px] leading-relaxed">
          {label}
          {description && <span className="block text-[13px] text-muted">{description}</span>}
        </span>
      </label>
      {error && <p className="mt-1.5 pl-8 text-[13px] font-medium text-bad">{error}</p>}
    </div>
  );
}

/* ---------- Choice cards (radio group) ---------- */

export function ChoiceCards<T extends string>({
  label,
  value,
  onChange,
  options,
  columns = 2,
  error,
}: {
  label: string;
  value: T | null;
  onChange: (v: T) => void;
  options: { value: T; title: string; description?: string; icon?: ReactNode }[];
  columns?: 1 | 2 | 3;
  error?: string | null;
}) {
  const id = useId();
  return (
    <fieldset aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="text-[14px] font-medium">{label}</legend>
      <div
        className={clsx(
          "mt-2 grid gap-3",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-3",
        )}
      >
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <label
              key={o.value}
              className={clsx(
                "relative flex cursor-pointer gap-3 rounded-card bg-surface p-4 ring-1 transition-shadow has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink",
                selected ? "ring-2 ring-ink" : "ring-line-strong hover:ring-ink/40",
              )}
            >
              <input
                type="radio"
                name={id}
                value={o.value}
                checked={selected}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.icon && (
                <span className={clsx("flex size-10 shrink-0 items-center justify-center rounded-full", selected ? "bg-ink text-white" : "bg-sunken text-ink-2")}>
                  {o.icon}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{o.title}</span>
                {o.description && <span className="mt-0.5 block text-[13px] leading-snug text-muted">{o.description}</span>}
              </span>
              <span
                aria-hidden
                className={clsx(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ring-1",
                  selected ? "bg-ink ring-ink" : "ring-line-strong",
                )}
              >
                {selected && <span className="size-2 rounded-full bg-white" />}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[13px] font-medium text-bad">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/* ---------- One-time code input ---------- */

export function CodeInput({
  length = 6,
  value,
  onChange,
  invalid,
  label = "Verification code",
}: {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  label?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  // Blank cells are stored as spaces so a gap never shifts later digits.
  const toCells = (v: string) => Array.from({ length }, (_, i) => (v[i] ?? " ").trim());
  const digits = toCells(value);
  // Keystrokes can arrive faster than re-renders; always build on the latest value.
  const latest = useRef(value);
  useEffect(() => {
    // When the code is cleared (e.g. after a wrong attempt), start again from the first box.
    if (value === "" && latest.current !== "") refs.current[0]?.focus();
    latest.current = value;
  }, [value]);

  const emit = (cells: string[]) => {
    const next = cells.map((c) => c || " ").join("").trimEnd();
    latest.current = next;
    onChange(next);
  };

  const setAt = (i: number, d: string) => {
    const cells = toCells(latest.current);
    cells[i] = d;
    emit(cells);
  };

  return (
    <div role="group" aria-label={label} className="flex gap-2 sm:gap-2.5">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          spellCheck={false}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          value={d}
          onChange={(e) => {
            let chars = e.target.value.replace(/\D/g, "");
            if (!chars) return setAt(i, "");
            // Typing over an existing digit: keep only the new one.
            if (digits[i] && chars.length === 2) chars = chars.slice(-1);
            // Spread pasted or autofilled codes across the boxes from here.
            const cells = toCells(latest.current);
            for (let k = 0; k < chars.length && i + k < length; k++) cells[i + k] = chars[k];
            emit(cells);
            refs.current[Math.min(i + chars.length, length - 1)]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onFocus={(e) => e.target.select()}
          className={clsx(
            "h-14 w-11 rounded-field bg-surface text-center text-[22px] font-semibold tabular-nums ring-1 transition-shadow focus:ring-2 focus:ring-ink focus:outline-none sm:w-12",
            invalid ? "ring-2 ring-bad" : "ring-line-strong",
          )}
        />
      ))}
    </div>
  );
}

/* ---------- Switch ---------- */

export function Switch({
  label,
  description,
  checked,
  onChange,
}: {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <label htmlFor={id} className="block cursor-pointer text-[14.5px] font-medium">
          {label}
        </label>
        {description && <p className="mt-0.5 max-w-[56ch] text-[13px] leading-relaxed text-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx("relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-ink" : "bg-line-strong")}
      >
        <span className={clsx("absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
      </button>
    </div>
  );
}
