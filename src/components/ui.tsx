import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { photoFor } from "@/lib/people";
import type { ComponentProps, ReactNode } from "react";

/* ---------- Button ---------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap [&_svg]:shrink-0 transition-[background-color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-45";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_6px_16px_-6px_rgb(22_24_29/0.6)] hover:bg-[#2a2d34]",
  secondary:
    "bg-surface text-ink ring-1 ring-line-strong hover:bg-sunken",
  ghost: "text-ink-2 hover:bg-sunken hover:text-ink",
  danger: "bg-bad text-white hover:bg-[#a33626]",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
  icon: "size-10 text-[14px]",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return clsx(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      type="button"
      className={buttonClass(variant, size, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/* ---------- Status pill ---------- */

export type Tone = "ok" | "wait" | "bad" | "info" | "action" | "neutral";

const toneClasses: Record<Tone, string> = {
  ok: "bg-ok-soft text-ok",
  wait: "bg-wait-soft text-wait",
  bad: "bg-bad-soft text-bad",
  info: "bg-info-soft text-info",
  action: "bg-peach-soft text-[#a4472a]",
  neutral: "bg-sunken text-ink-2",
};

const toneDots: Record<Tone, string> = {
  ok: "bg-ok",
  wait: "bg-wait",
  bad: "bg-bad",
  info: "bg-info",
  action: "bg-peach",
  neutral: "bg-faint",
};

export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium leading-none whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
    >
      <span aria-hidden className={clsx("size-1.5 rounded-full", toneDots[tone])} />
      {children}
    </span>
  );
}

/* ---------- Card ---------- */

export function Card({
  className,
  children,
  as: Tag = "section",
  ...props
}: Omit<ComponentProps<"section">, "ref"> & { as?: "section" | "div" | "article" | "aside" }) {
  return (
    <Tag
      className={clsx("rounded-card bg-surface shadow-card ring-1 ring-line/70", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ---------- Avatar ---------- */

/** Profile photo. Every person resolves to a photo (see src/lib/people.ts). */
export function Avatar({
  name,
  size = 36,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={photoFor(name)}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      // Large avatars sit in page headers, above the fold.
      loading={size >= 56 ? "eager" : "lazy"}
      className={clsx("inline-block shrink-0 rounded-full bg-sunken object-cover ring-2 ring-surface", className)}
      style={{ width: size, height: size }}
    />
  );
}
