"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Modal built on the native <dialog>: focus is trapped, Escape closes it,
 * and focus returns to the opener when it closes.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop closes the dialog.
        if (e.target === ref.current) onClose();
      }}
      className={`m-auto w-[calc(100%-2rem)] rounded-panel bg-surface p-0 text-ink shadow-pop backdrop:bg-ink/30 backdrop:backdrop-blur-[2px] open:animate-rise ${size === "lg" ? "max-w-[640px]" : "max-w-[480px]"}`}
    >
      {open && (
        <div className="flex max-h-[85dvh] flex-col">
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              <h2 id={titleId} className="t-h2">
                {title}
              </h2>
              {description && <div className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{description}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mt-1 -mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink"
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <div className="scroll-thin overflow-y-auto overscroll-contain px-6 pt-5 pb-6">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line/80 bg-frame/60 px-6 py-4">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
