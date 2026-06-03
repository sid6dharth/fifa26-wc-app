import { redirect } from "next/navigation";
import { Ticket } from "lucide-react";
import { PitchBackground } from "@/components/layout/pitch-background";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getUserAndProfile } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { user, profile } = await getUserAndProfile();
  if (!user) redirect("/login");
  if (profile) redirect("/home");

  return (
    <div className="relative min-h-screen">
      <PitchBackground />
      <div className="relative z-[1] flex min-h-screen flex-col items-center justify-center px-6">
        <div className="flex w-full max-w-[400px] flex-col items-center gap-6 rounded-card border-2 border-border-soft bg-surface p-7 shadow-[var(--shadow-raised)]">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold text-ink">
            <Ticket size={24} />
          </span>
          <div className="text-center">
            <h1 className="font-display text-[26px] leading-none text-ink">One more step</h1>
            <p className="mt-2 text-[14px] text-muted">
              Enter the invite code you were given to join the league.
            </p>
          </div>
          <OnboardingForm />
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
