import { Panel } from "@/components/ui/panel";

/* Reusable on-brand placeholder for routes that get their real UI in a later
   phase. Doubles as the empty-state pattern (Phase 3) once data is wired. */
export function PlaceholderScreen({
  title,
  blurb,
  phase,
}: {
  title: string;
  blurb: string;
  phase: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <header>
        <h1 className="font-display text-[30px] leading-none text-ink">{title}</h1>
        <p className="mt-2 max-w-prose text-[15px] text-muted">{blurb}</p>
      </header>
      <Panel className="border-dashed">
        <div className="flex items-center gap-3">
          <span className="font-accent rounded-full bg-surface-sunk px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            {phase}
          </span>
          <span className="text-sm text-faint">Coming in a later build phase.</span>
        </div>
      </Panel>
    </section>
  );
}
