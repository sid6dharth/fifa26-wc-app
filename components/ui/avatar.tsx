import { cn } from "@/lib/utils";

/* On-brand initials avatar, ported from the prototype. Colour is derived
   deterministically from the initials so a given member is always the same hue. */
const AV_COLORS = [
  "var(--c-purple)",
  "var(--c-teal)",
  "var(--c-coral)",
  "var(--c-blue)",
  "var(--c-green)",
  "var(--c-sky)",
];

export function Avatar({
  initials,
  size = 38,
  you = false,
  ring = false,
  className,
}: {
  initials: string;
  size?: number;
  you?: boolean;
  ring?: boolean;
  className?: string;
}) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % AV_COLORS.length;
  return (
    <span
      className={cn("font-display inline-flex shrink-0 items-center justify-center text-white", className)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: you ? "var(--accent)" : AV_COLORS[idx],
        fontSize: size * 0.4,
        letterSpacing: "0.02em",
        border: ring ? "2.5px solid var(--c-gold)" : "2px solid var(--surface)",
        boxShadow: "0 2px 5px rgba(20,16,31,.18)",
      }}
    >
      {initials}
    </span>
  );
}
