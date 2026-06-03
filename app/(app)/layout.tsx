import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PitchBackground } from "@/components/layout/pitch-background";
import { ToastProvider } from "@/components/ui/toast";
import { getUserAndProfile } from "@/lib/supabase/server";

// Auth-gated and cookie-dependent — never statically prerender.
export const dynamic = "force-dynamic";

/* Authenticated app surface. Guards every nested route:
   - not signed in        → /login
   - signed in, no profile → /onboarding (must redeem an invite code)
   The client clock is never trusted; this runs on the server. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getUserAndProfile();
  if (!user) redirect("/login");
  if (!profile) redirect("/onboarding");

  const initials = profile.display_name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <ToastProvider>
      <PitchBackground />
      <AppShell user={{ displayName: profile.display_name, initials }}>{children}</AppShell>
    </ToastProvider>
  );
}
