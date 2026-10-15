import clsx from "clsx";

/** Two interlaced rings: covenant and family. */
export function RingsMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="16" r="8.5" stroke="#16181d" strokeWidth="3.2" />
      <circle cx="20" cy="16" r="8.5" stroke="#ee9677" strokeWidth="3.2" />
      {/* Re-draw the left ring's upper arc on top so the rings interlace */}
      <path d="M15.9 8.45 A8.5 8.5 0 0 1 20.4 16" stroke="#16181d" strokeWidth="3.2" strokeLinecap="butt" />
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
