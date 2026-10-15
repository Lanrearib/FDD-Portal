"use client";

import clsx from "clsx";
import { Check, Clock, FileText, Lock, RotateCcw } from "lucide-react";
import { useState } from "react";
import { FileDrop } from "@/components/file-drop";
import { Field, Textarea } from "@/components/form";
import { Avatar, Button, Card, StatusPill, type Tone } from "@/components/ui";
import type { DocVersion, Persona } from "@/lib/portal-data";
import { useStageUpdate } from "@/components/portal/stage-context";

const versionTone: Record<DocVersion["status"], Tone> = {
  Submitted: "wait",
  "Under Review": "wait",
  Accepted: "ok",
  "Re-upload Required": "bad",
};

const statusMeta: Record<Persona["consent"]["status"], { label: string; tone: Tone }> = {
  locked: { label: "Not Started", tone: "neutral" },
  not_uploaded: { label: "Not Uploaded", tone: "action" },
  submitted: { label: "Submitted", tone: "wait" },
  under_review: { label: "Under Review", tone: "wait" },
  accepted: { label: "Accepted", tone: "ok" },
  reupload_required: { label: "Re-upload Required", tone: "bad" },
};

export function ConsentPanel({ persona }: { persona: Persona }) {
  const [status, setStatus] = useState(persona.consent.status);
  const [versions, setVersions] = useState(persona.consent.versions);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const updateStage = useStageUpdate();
  const meta = statusMeta[status];
  const canUpload = status === "not_uploaded" || status === "reupload_required";

  const submit = () => {
    if (!file) return setError("Choose your consent letter to upload.");
    setSending(true);
    setTimeout(() => {
      setVersions((v) => [
        ...v,
        { version: v.length + 1, fileName: file.name, uploaded: "Just now", status: "Submitted", note: note.trim() || undefined },
      ]);
      setStatus("submitted");
      updateStage("consent", { state: "waiting", status: "Pending Counsellor Review", detail: "New version uploaded just now" });
      setFile(null);
      setNote("");
      setSending(false);
    }, 700);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div>
          <h2 className="t-h2">Parental consent letter</h2>
          <p className="mt-1 max-w-[56ch] text-[14px] leading-relaxed text-ink-2">
            A letter from your parents or guardians giving their consent, signed and dated. You upload it
            yourself; your Pastor and counsellor don’t.
          </p>
        </div>
        <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
      </div>

      <div className="px-5 pt-5 pb-6 sm:px-6">
        {status === "locked" && (
          <p className="flex gap-3 rounded-[14px] bg-sunken/70 p-4 text-[14px] text-ink-2">
            <Lock className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            {persona.consent.lockReason}
          </p>
        )}

        {status === "reupload_required" && persona.consent.returnNote && (
          <figure className="rounded-[14px] bg-bad-soft/60 p-4">
            <p className="text-[13px] font-medium text-bad">
              Returned on {persona.consent.returnNote.when}
              {persona.consent.due ? `. Please upload a new letter by ${persona.consent.due}.` : "."}
            </p>
            <blockquote className="mt-2 text-[14.5px] leading-relaxed">“{persona.consent.returnNote.text}”</blockquote>
            <figcaption className="mt-3 flex items-center gap-2 text-[12.5px] text-muted">
              <Avatar name={persona.consent.returnNote.author} size={22} />
              {persona.consent.returnNote.author}, your counsellor
            </figcaption>
          </figure>
        )}

        {(status === "submitted" || status === "under_review") && (
          <p className="animate-rise flex gap-3 rounded-[14px] bg-wait-soft/70 p-4 text-[14px] text-ink-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-wait" aria-hidden />
            Thanks. {persona.counsellor.name} will review your letter, usually within two working days.
            We’ll email you when it’s accepted, or if anything needs to change.
          </p>
        )}

        {status === "accepted" && (
          <p className="flex gap-3 rounded-[14px] bg-ok-soft/70 p-4 text-[14px] text-ink-2">
            <Check className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={2.5} aria-hidden />
            Your letter has been accepted. There’s nothing more to do here.
          </p>
        )}

        {canUpload && (
          <form
            noValidate
            className="mt-6 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <FileDrop
              label={status === "reupload_required" ? "Upload a corrected letter" : "Upload your letter"}
              file={file}
              onChange={(f) => {
                setFile(f);
                setError(null);
              }}
              error={error}
            />
            <Field label="Note for your counsellor" optional>
              <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="For example, which parent signed it" />
            </Field>
            <Button type="submit" size="lg" disabled={sending}>
              {sending ? "Uploading…" : "Submit letter"}
            </Button>
          </form>
        )}
      </div>

      {versions.length > 0 && (
        <div className="border-t border-line/80 bg-frame/50 px-5 py-5 sm:px-6">
          <h3 className="text-[13.5px] font-medium">Versions</h3>
          <ol className="mt-3 space-y-2">
            {[...versions].reverse().map((v) => (
              <li key={v.version} className="flex flex-wrap items-center gap-3 rounded-[12px] bg-surface p-3 ring-1 ring-line/70">
                <span className={clsx("flex size-9 shrink-0 items-center justify-center rounded-full", v.status === "Re-upload Required" ? "bg-bad-soft text-bad" : "bg-sunken text-ink-2")}>
                  {v.status === "Re-upload Required" ? <RotateCcw className="size-4" aria-hidden /> : <FileText className="size-4" aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">
                    Version {v.version}: {v.fileName}
                  </p>
                  <p className="text-[12.5px] text-muted">
                    Uploaded {v.uploaded}
                    {v.note ? `. ${v.note}` : ""}
                  </p>
                </div>
                <StatusPill tone={versionTone[v.status]}>{v.status}</StatusPill>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}

