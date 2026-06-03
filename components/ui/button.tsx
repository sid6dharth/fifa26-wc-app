import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Brand button, ported from the prototype's <Button> (World Cup 2026/ui.jsx).
 * `primary` is GOLD — reserved for reward/headline actions per DESIGN_SYSTEM.md.
 * For ordinary primary actions use `accent`.
 */
const buttonVariants = cva(
  "wc-btn inline-flex items-center justify-center gap-2 rounded-btn font-body font-bold tracking-[0.01em] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary: "bg-gold text-ink shadow-[0_3px_0_rgba(20,16,31,0.22)]",
        accent: "bg-accent text-on-accent shadow-[0_3px_0_rgba(20,16,31,0.18)]",
        ghost: "border-2 border-accent bg-transparent text-accent",
        soft: "border-2 border-border-soft bg-surface-sunk text-ink",
        dark: "bg-ink text-white shadow-[0_3px_0_rgba(0,0,0,0.25)]",
      },
      size: {
        sm: "px-3.5 py-2 text-[13.5px]",
        md: "px-5 py-3 text-[15px]",
        lg: "px-6 py-4 text-[17px]",
      },
      full: { true: "w-full" },
    },
    defaultVariants: { variant: "accent", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, full, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, full }), className)} {...props} />
  );
}

export { buttonVariants };
