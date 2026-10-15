import clsx from "clsx";
import { useId } from "react";

/** Two interlaced rings: covenant and family. */
export function RingsMark({ size = 32, className }: { size?: number; className?: string }) {
  const id = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-a`} x1="2" y1="6" x2="22" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16181d" />
          <stop offset="1" stopColor="#3b3f48" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="10" y1="6" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ee9677" />
          <stop offset="1" stopColor="#ab9ce3" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="16" r="8.5" stroke={`url(#${id}-a)`} strokeWidth="3.2" />
      <circle cx="20" cy="16" r="8.5" stroke={`url(#${id}-b)`} strokeWidth="3.2" />
      {/* Re-draw the left ring's upper arc on top so the rings interlace */}
      <path
        d="M15.9 8.45 A8.5 8.5 0 0 1 20.4 16"
        stroke={`url(#${id}-a)`}
        strokeWidth="3.2"
        strokeLinecap="butt"
      />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <RingsMark size={30} />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-[-0.01em]">Family Development</span>
          <span className="mt-1 text-[11.5px] text-muted">Department portal</span>
        </span>
      )}
    </span>
  );
}
