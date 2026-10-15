import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { BereavementForm } from "./bereavement-form";

export const metadata: Metadata = { title: "Bereavement support" };

export default function BereavementPage() {
  return (
    <PublicShell>
      <div className="mx-auto grid max-w-[1100px] gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:pt-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="t-h1">Bereavement support</h1>
          <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-ink-2">
            If you have lost someone, we would like to stand with you. Tell us how to reach you, and someone from the department
            will be in touch.
          </p>
          <blockquote className="mt-8 border-l-2 border-peach pl-4 text-[16px] leading-relaxed text-ink-2">
            “Blessed are they that mourn: for they shall be comforted.”
            <footer className="mt-1 text-[13px] text-muted">Matthew 5:4</footer>
          </blockquote>
          <p className="mt-8 text-[14px] leading-relaxed text-muted">
            Your request is confidential. Its details are seen only by the people who will help, and never shown on general
            dashboards.
          </p>
        </div>
        <BereavementForm />
      </div>
    </PublicShell>
  );
}
