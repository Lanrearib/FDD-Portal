"use client";

import clsx from "clsx";
import {
  CalendarDays,
  ChartColumn,
  FileText,
  HeartHandshake,
  History,
  House,
  LayoutGrid,
  LifeBuoy,
  MapPinned,
  ScrollText,
  Settings,
  Church,
  LogOut,
  Menu,
  MessageCircle,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./brand";
import { Avatar } from "./ui";

type NavItem = { href: string; label: string; icon: LucideIcon; badge?: number };

export type ShellVariant = "candidate" | "staff" | "central" | "leadership";

const navSets: Record<ShellVariant, { home: string; label: string; items: NavItem[] }> = {
  candidate: {
    home: "/portal",
    label: "Portal",
    items: [
      { href: "/portal", label: "Home", icon: House },
      { href: "/portal/messages", label: "Messages", icon: MessageCircle },
      { href: "/portal/documents", label: "Documents", icon: FileText },
      { href: "/portal/appointment", label: "Appointments", icon: CalendarDays },
      { href: "/portal/proposal", label: "Proposal", icon: HeartHandshake },
      { href: "/portal/profile", label: "Profile", icon: UserRound },
      { href: "/portal/history", label: "History", icon: History },
    ],
  },
  staff: {
    home: "/staff",
    label: "Counsellor workspace",
    items: [
      { href: "/staff", label: "Overview", icon: LayoutGrid },
      { href: "/staff/candidates", label: "Candidates", icon: Users },
      { href: "/staff/cases", label: "Proposal cases", icon: HeartHandshake },
      { href: "/staff/appointments", label: "Appointments", icon: CalendarDays },
      { href: "/staff/messages", label: "Messages", icon: MessageCircle, badge: 3 },
      { href: "/staff/support", label: "Support requests", icon: LifeBuoy },
      { href: "/staff/reports", label: "Reports", icon: ChartColumn },
    ],
  },
  central: {
    home: "/central",
    label: "Central office",
    items: [
      { href: "/central", label: "Overview", icon: LayoutGrid },
      { href: "/central/counsellors", label: "Counsellors and Zones", icon: MapPinned },
      { href: "/central/pastors", label: "Pastor directory", icon: Church },
      { href: "/central/reports", label: "Reports", icon: ChartColumn },
      { href: "/central/audit", label: "Audit log", icon: ScrollText },
      { href: "/central/settings", label: "Settings", icon: Settings },
    ],
  },
  leadership: {
    home: "/leadership",
    label: "Leadership",
    items: [{ href: "/leadership", label: "Reports", icon: ChartColumn }],
  },
};

export interface ShellUser {
  name: string;
  /** Second line on the user card, e.g. a profile reference or a role. */
  subtitle: string;
}

function SidebarContent({
  user,
  variant,
  badges,
  onNavigate,
}: {
  user: ShellUser;
  variant: ShellVariant;
  badges?: Record<string, number>;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const nav = navSets[variant];
  return (
    <div className="flex h-full flex-col">
      <Link href={nav.home} onClick={onNavigate} className="px-3 pt-1 pb-8" aria-label="Family Development home">
        <Logo />
      </Link>

      <nav aria-label={nav.label}>
        <ul className="space-y-1">
          {nav.items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            const badge = badges?.[item.href] ?? item.badge;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "group flex h-11 items-center gap-3 rounded-full px-4 text-[14.5px] transition-colors",
                    active
                      ? "bg-surface font-semibold text-ink shadow-card ring-1 ring-line/60"
                      : "text-ink-2 hover:bg-surface/60 hover:text-ink",
                  )}
                >
                  <Icon
                    className={clsx("size-[18px]", active ? "text-ink" : "text-muted group-hover:text-ink")}
                    strokeWidth={active ? 2.25 : 1.75}
                    aria-hidden
                  />
                  <span className="flex-1">{item.label}</span>
                  {badge ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-ink text-[11.5px] font-semibold text-white">
                      {badge}
                      <span className="sr-only"> unread</span>
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-8">
        <div className="rounded-[20px] bg-[#aeb3bc] p-3 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]">
          <div className="flex items-center gap-3 px-1 pt-1">
            <Avatar name={user.name} size={38} className="ring-white/70" />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold">{user.name}</p>
              <p className="truncate text-[12.5px] text-white/85">{user.subtitle}</p>
            </div>
          </div>
          <Link
            href="/"
            onClick={onNavigate}
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-full bg-white/20 text-[13.5px] font-medium ring-1 ring-white/40 backdrop-blur transition-colors hover:bg-white/30"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  user,
  variant,
  badges,
  children,
  aside,
}: {
  user: ShellUser;
  variant: ShellVariant;
  /** Per-link badge counts, keyed by href (e.g. unread messages). */
  badges?: Record<string, number>;
  children: ReactNode;
  /** Right-hand context panel (desktop). Rendered below content on smaller screens. */
  aside?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-dvh bg-frame">
      <div className="flex min-h-dvh">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 overflow-y-auto border-r border-line/80 px-3.5 py-7 lg:block xl:w-[260px] xl:px-4">
          <SidebarContent user={user} variant={variant} badges={badges} />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <div className="animate-rise absolute inset-y-0 left-0 w-[290px] max-w-[85vw] overflow-y-auto overscroll-contain bg-frame px-4 py-6 shadow-pop">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-5 right-4 flex size-9 items-center justify-center rounded-full hover:bg-sunken"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden />
              </button>
              <SidebarContent user={user} variant={variant} badges={badges} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-start">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b border-line/80 px-4 py-3 lg:hidden">
            <Link href={navSets[variant].home} aria-label="Family Development home">
              <Logo />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex size-10 items-center justify-center rounded-full bg-surface ring-1 ring-line"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 xl:px-10 xl:py-10 2xl:px-12">{children}</main>

          {aside && (
            <aside className={clsx("scroll-thin border-t border-line/80 px-4 py-6 sm:px-8 lg:sticky lg:top-4 lg:my-4 lg:mr-4 lg:max-h-[calc(100dvh-2rem)] lg:w-[330px] lg:shrink-0 lg:overflow-y-auto lg:rounded-panel lg:border-t-0 lg:bg-surface/70 lg:px-5 lg:py-6 lg:ring-1 lg:ring-white xl:px-6 xl:py-7", variant === "staff" ? "lg:w-[300px] xl:w-[340px]" : "xl:w-[380px]")}>
              {aside}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
