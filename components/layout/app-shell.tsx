"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ListTree,
  PencilLine,
  Home as HomeIcon,
  Trophy,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/auth/sign-out-button";

export type ShellUser = { displayName: string; initials: string };

type NavItem = { href: string; label: string; icon: LucideIcon; center?: boolean };

const NAV: NavItem[] = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/predict", label: "Predict", icon: PencilLine, center: true },
  { href: "/bracket", label: "Bracket", icon: ListTree },
  { href: "/league", label: "League", icon: Users },
  { href: "/profile", label: "You", icon: User },
];

function useActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children, user }: { children: React.ReactNode; user: ShellUser }) {
  const isActive = useActive();
  const { show } = useToast();
  const pathname = usePathname();
  const title = NAV.find((n) => isActive(n.href))?.label ?? "WC 2026";

  return (
    <div className="relative min-h-screen">
      <div className="relative z-[1] flex min-h-screen">
        {/* ---- desktop sidebar ---- */}
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col gap-1.5 border-r-2 border-border-soft bg-surface px-[18px] py-[26px] lg:flex">
          <Link
            href="/home"
            aria-label="World Cup 2026 home"
            className="mb-[18px] flex items-center gap-2.5 px-1.5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-white">
              <Trophy size={20} />
            </span>
            <span>
              <span className="font-display block text-[17px] leading-none text-ink">WC 2026</span>
              <span className="block text-[11px] font-semibold text-faint">Prediction League</span>
            </span>
          </Link>

          {NAV.map((n) => {
            const active = isActive(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-body flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-[15px] font-bold transition-colors",
                  active ? "bg-accent text-on-accent" : "text-muted hover:bg-surface-sunk",
                )}
              >
                <Icon size={21} />
                {n.label}
              </Link>
            );
          })}

          <div className="mt-auto flex items-center gap-2.5">
            <div className="flex flex-1 items-center gap-2.5 rounded-[14px] bg-surface-sunk px-3.5 py-3">
              <Avatar initials={user.initials} size={38} ring />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-bold text-ink">{user.displayName}</div>
                <SignOutButton className="text-[11.5px]" />
              </div>
            </div>
            <ThemeToggle />
          </div>
        </aside>

        {/* ---- main column ---- */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* mobile top bar */}
          <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 border-border-soft px-[18px] py-[13px] backdrop-blur-md lg:hidden [background:color-mix(in_srgb,var(--bg)_86%,transparent)]">
            <div className="flex items-center gap-2.5">
              <span className="grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-accent text-white">
                <Trophy size={17} />
              </span>
              <span className="font-display text-[19px] text-ink">{title}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-sm text-ink">
                <Trophy size={13} /> 0
              </span>
              <ThemeToggle />
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => show("All caught up!")}
                className="relative grid h-[38px] w-[38px] place-items-center rounded-full border-2 border-border-soft bg-surface text-muted"
              >
                <Bell size={18} />
                <span className="absolute right-[7px] top-[6px] h-2 w-2 rounded-full border-[1.5px] border-surface bg-red" />
              </button>
            </div>
          </header>

          {/* page body */}
          <main className="mx-auto w-full max-w-[880px] flex-1 px-4 pb-28 pt-[18px] lg:px-[30px] lg:pb-[60px] lg:pt-[30px]">
            <div key={pathname} className="wc-page-enter">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* ---- mobile bottom tab bar ---- */}
      <nav className="fixed inset-x-0 bottom-0 z-[60] flex justify-around border-t-2 border-border-soft bg-surface px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_20px_rgba(20,16,31,0.08)] lg:hidden">
        {NAV.map((n) => {
          const active = isActive(n.href);
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-label={n.label}
              aria-current={active ? "page" : undefined}
              className="relative flex max-w-20 flex-1 flex-col items-center gap-0.5 py-1.5"
            >
              <span
                className={cn(
                  "grid h-[30px] w-11 place-items-center rounded-full transition-colors",
                  n.center && active && "bg-gold",
                  active && !n.center && "[background:color-mix(in_srgb,var(--accent)_16%,transparent)]",
                )}
              >
                <Icon
                  size={22}
                  className={cn(
                    n.center && active ? "text-ink" : active ? "text-accent" : "text-faint",
                  )}
                />
              </span>
              <span
                className={cn(
                  "text-[10.5px] font-bold",
                  active ? "text-accent" : "text-faint",
                )}
              >
                {n.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
