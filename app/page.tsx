import Link from "next/link";
import { Trophy } from "lucide-react";
import { PitchBackground } from "@/components/layout/pitch-background";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

const MODES = ["Score Predictor", "Bracket", "Group Stage", "Daily Pick'em", "Awards"];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <PitchBackground />
      <div className="relative z-[1] flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5">
          <span className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white">
              <Trophy size={20} />
            </span>
            <span className="font-display text-[18px] text-ink">WC 2026</span>
          </span>
          <ThemeToggle />
        </header>

        <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <span className="font-accent rounded-full border-2 border-border-soft bg-surface px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
            Invite-only · Friends &amp; family
          </span>
          <h1 className="font-display text-[clamp(40px,11vw,64px)] leading-[0.95] text-ink">
            Predict the
            <br />
            <span className="text-accent">World Cup.</span>
          </h1>
          <p className="max-w-[440px] text-[16px] text-muted">
            Call the scores, fill your knockout bracket, and climb a live leaderboard with your
            league. Points score themselves the moment matches finish.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {MODES.map((m) => (
              <span
                key={m}
                className="font-accent rounded-full bg-surface-sunk px-3 py-1.5 text-[12px] font-bold text-muted"
              >
                {m}
              </span>
            ))}
          </div>

          <Link href="/home" className="mt-2">
            <Button variant="primary" size="lg">
              <Trophy size={18} /> Enter the league
            </Button>
          </Link>
        </main>

        <footer className="px-6 py-6 text-center text-[12px] text-faint">
          Stadium Summer · No real money, just bragging rights.
        </footer>
      </div>
    </div>
  );
}
