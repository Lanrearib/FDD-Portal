"use client";

import { Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ToastAction = { label: string; onClick: () => void };
type ToastState = { message: string; action?: ToastAction } | null;

/** One-line confirmation that slides up after an action, with an optional undo. */
export function Toast({ toast, onDone }: { toast: ToastState; onDone: () => void }) {
  useEffect(() => {
    if (!toast) return;
    // Give people longer to reach an Undo button.
    const t = setTimeout(onDone, toast.action ? 7000 : 4200);
    return () => clearTimeout(t);
  }, [toast, onDone]);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
      {toast && (
        <div className="animate-rise pointer-events-auto flex items-center gap-2.5 rounded-full bg-ink py-2 pr-2 pl-3 text-[14px] text-white shadow-pop">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Check className="size-3.5" strokeWidth={3} aria-hidden />
          </span>
          <span className={toast.action ? "" : "pr-3"}>{toast.message}</span>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action!.onClick();
                onDone();
              }}
              className="h-8 rounded-full bg-white/15 px-3.5 text-[13px] font-semibold hover:bg-white/25"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function useToast() {
  const [state, setState] = useState<ToastState>(null);
  const clear = useCallback(() => setState(null), []);
  const toast = useCallback((message: string, action?: ToastAction) => setState({ message, action }), []);
  return { toast, toastNode: <Toast toast={state} onDone={clear} /> };
}
