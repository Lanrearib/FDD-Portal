"use client";

import { RotateCcw } from "lucide-react";
import { RingsMark } from "@/components/brand";
import { Button, ButtonLink } from "@/components/ui";

// Error boundaries must be Client Components. Nothing sensitive is shown; the digest
// lets the department match the error to server logs.
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col justify-center px-4 py-16 sm:px-6">
      <RingsMark size={56} />
      <h1 className="t-h1 mt-6">Something went wrong on our side</h1>
      <p className="mt-3 max-w-[50ch] text-[16px] leading-relaxed text-ink-2">
        This page couldn’t load. Try again, and if it keeps happening, contact the department office with the reference
        below.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </Button>
        <ButtonLink href="/" variant="secondary">
          Go to the home page
        </ButtonLink>
      </div>
      {error.digest && <p className="mt-10 text-[13px] text-muted">Reference: {error.digest}</p>}
    </div>
  );
}
