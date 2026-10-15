import type { Metadata } from "next";
import Link from "next/link";
import { RingsMark } from "@/components/brand";
import { PublicShell } from "@/components/public-shell";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <PublicShell>
      <div className="mx-auto flex max-w-[640px] flex-col items-start px-4 pt-20 sm:px-6">
        <RingsMark size={56} />
        <h1 className="t-h1 mt-6">We can’t find that page</h1>
        <p className="mt-3 max-w-[50ch] text-[16px] leading-relaxed text-ink-2">
          The link may be old, or the address may have a typo. If you followed a link from an email, it may have been replaced
          by a newer one.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Go to the home page</ButtonLink>
          <ButtonLink href="/login" variant="secondary">
            Sign in to your portal
          </ButtonLink>
        </div>
        <p className="mt-10 text-[14px] text-muted">
          Still stuck? Write to{" "}
          <Link href="mailto:family@example.org" className="underline underline-offset-4">
            family@example.org
          </Link>
          .
        </p>
      </div>
    </PublicShell>
  );
}
