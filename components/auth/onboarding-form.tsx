"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function OnboardingForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "redeeming" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("redeeming");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.rpc("redeem_invite", { p_code: code.trim() });
    if (error) {
      setError(
        error.message.includes("invalid_or_expired_code")
          ? "That invite code isn't valid (or has been used up). Double-check with whoever invited you."
          : error.message,
      );
      setStatus("error");
      return;
    }
    // Profile now exists — server guards will let us into the app.
    router.replace("/home");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      <label htmlFor="invite" className="text-[13px] font-bold text-muted">
        Invite code
      </label>
      <input
        id="invite"
        type="text"
        required
        autoCapitalize="characters"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="FAMILY-2026"
        className="rounded-input border-2 border-border-soft bg-surface px-4 py-3 text-[15px] uppercase tracking-wide text-ink outline-none placeholder:text-faint focus:border-accent"
      />
      {error && <p className="text-[13px] font-semibold text-red">{error}</p>}
      <Button type="submit" variant="primary" full disabled={status === "redeeming"}>
        <Ticket size={17} />
        {status === "redeeming" ? "Checking…" : "Join the league"}
      </Button>
    </form>
  );
}
