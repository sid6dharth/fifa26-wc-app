import { cn } from "@/lib/utils";

/* Card surface wrapper, ported from the prototype's <Panel>. */
export function Panel({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "rounded-card border-2 border-border-soft bg-surface p-[18px] shadow-[var(--shadow-subtle)]",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
