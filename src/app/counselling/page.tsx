import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { CounsellingForm } from "./counselling-form";

export const metadata: Metadata = { title: "Counselling for married couples" };

export default function CounsellingPage() {
  return (
    <PublicShell>
      <div className="mx-auto grid max-w-[1100px] gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:pt-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="t-h1">Counselling for married couples</h1>
          <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-ink-2">
            Whether you’re going through a hard season or simply want a check-in, a marriage counsellor can walk with you.
            Tell us a little, and someone will be in touch.
          </p>
          <ul className="mt-8 space-y-4 text-[14.5px] leading-relaxed text-ink-2">
            <li>
              <span className="font-semibold text-ink">It takes about three minutes.</span> You don’t need an account.
            </li>
            <li>
              <span className="font-semibold text-ink">It’s confidential.</span> Only the counsellors who help you can see your
              request.
            </li>
            <li>
              <span className="font-semibold text-ink">A counsellor near you replies.</span> Requests go to the counsellors for your
              Area, usually within three working days.
            </li>
          </ul>
        </div>
        <CounsellingForm />
      </div>
    </PublicShell>
  );
}
