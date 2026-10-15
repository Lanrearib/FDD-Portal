import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo, RingsMark } from "./brand";

export function AuthShell({
  children,
  aside,
  back,
  wide = false,
}: {
  children: ReactNode;
  /** Context panel shown beside the form on large screens. */
  aside?: ReactNode;
  back?: { href: string; label: string };
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-dvh">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between px-4 sm:px-8 lg:h-20">
          <Link href="/" aria-label="Family Development home">
            <Logo />
          </Link>
          {back && (
            <Link
              href={back.href}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13.5px] font-medium text-ink-2 hover:text-ink"
            >
              <ChevronLeft className="size-4" aria-hidden />
              {back.label}
            </Link>
          )}
        </header>
        <main
          id="main"
          className={clsx(
            "mx-auto flex w-full flex-1 flex-col px-4 pt-6 pb-16 sm:px-8 lg:justify-center lg:pt-0",
            wide ? "max-w-[640px]" : "max-w-[460px]",
          )}
        >
          {children}
        </main>
      </div>
      {aside && (
        <aside className="sticky top-0 hidden h-dvh w-[44%] max-w-[620px] shrink-0 p-4 lg:block">
          <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-[28px] bg-[#eeeae6] px-10 py-12 xl:px-14">
            <RingsMark size={420} className="absolute -right-24 -bottom-28 opacity-[0.06]" />
            <div className="relative">{aside}</div>
          </div>
        </aside>
      )}
    </div>
  );
}
