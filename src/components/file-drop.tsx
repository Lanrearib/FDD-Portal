"use client";

import clsx from "clsx";
import { FileText, UploadCloud, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

const ACCEPT: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export function formatBytes(n: number) {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDrop({
  label,
  hint = "PDF, JPG or PNG, up to 5 MB",
  maxMb = 5,
  file,
  onChange,
  error: externalError,
}: {
  label: string;
  hint?: string;
  maxMb?: number;
  file: File | null;
  onChange: (f: File | null) => void;
  error?: string | null;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- preview tracks the chosen file
    setPreview(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreview(null);
    };
  }, [file]);

  const accept = (f: File | undefined) => {
    if (!f) return;
    const ext = `.${f.name.split(".").pop()?.toLowerCase()}`;
    const okType = Object.entries(ACCEPT).some(([mime, exts]) => f.type === mime || exts.includes(ext));
    if (!okType) return setError(`“${f.name}” isn’t a PDF, JPG or PNG. Choose a different file.`);
    if (f.size > maxMb * 1024 * 1024) return setError(`“${f.name}” is ${formatBytes(f.size)}. Files must be ${maxMb} MB or smaller.`);
    setError(null);
    onChange(f);
  };

  const shownError = error ?? externalError;

  return (
    <div>
      <p id={`${id}-label`} className="text-[14px] font-medium">
        {label}
      </p>
      {file ? (
        <div className="mt-2 flex items-center gap-4 rounded-card bg-surface p-3.5 ring-1 ring-line-strong">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
            <img src={preview} alt="" width={56} height={56} className="size-14 shrink-0 rounded-[10px] object-cover ring-1 ring-line" />
          ) : (
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[10px] bg-bad-soft text-bad">
              <FileText className="size-6" aria-hidden />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-medium">{file.name}</p>
            <p className="text-[12.5px] text-muted">{formatBytes(file.size)}, ready to submit</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink"
            aria-label={`Remove ${file.name}`}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files[0]);
          }}
          className={clsx(
            "mt-2 flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-9 text-center transition-colors has-[:focus-visible]:border-ink",
            dragging ? "border-ink bg-surface" : shownError ? "border-bad/50 bg-bad-soft/30" : "border-line-strong bg-surface/60 hover:border-ink/40 hover:bg-surface",
          )}
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-sunken text-ink-2">
            <UploadCloud className="size-5" aria-hidden />
          </span>
          <span className="mt-3 text-[14.5px] font-medium">
            <span className="underline decoration-line-strong underline-offset-4">Choose a file</span> or drag it here
          </span>
          <span className="mt-1 text-[12.5px] text-muted">{hint}</span>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="sr-only"
            aria-labelledby={`${id}-label`}
            aria-describedby={shownError ? `${id}-error` : undefined}
            onChange={(e) => accept(e.target.files?.[0])}
          />
        </label>
      )}
      {shownError && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] font-medium text-bad">
          {shownError}
        </p>
      )}
    </div>
  );
}
