import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";
import { PitchBackground } from "@/components/layout/pitch-background";
import { LoginForm } from "@/components/auth/login-form";
import { getUserAndProfile } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Already signed in? Skip straight past the gate.
  const { user, profile } = await getUserAndProfile();
  if (user && profile) redirect("/home");
  if (user && !profile) redirect("/onboarding");

  return (
    <div className="relative min-h-screen">
      <PitchBackground />
      <div className="relative z-[1] flex min-h-screen flex-col items-center justify-center px-6">
        <div className="flex w-full max-w-[400px] flex-col items-center gap-6 rounded-card border-2 border-border-soft bg-surface p-7 shadow-[var(--shadow-raised)]">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-white">
            <Trophy size={24} />
          </span>
          <div className="text-center">
            <h1 className="font-display text-[26px] leading-none text-ink">Sign in</h1>
            <p className="mt-2 text-[14px] text-muted">
              Invite-only league. We&apos;ll email you a magic link — no password needed.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
