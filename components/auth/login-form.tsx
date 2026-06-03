"use client";

import { useState } from "react";
import { MailCheck, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-lime/20 text-green">
          <MailCheck size={26} />
        </span>
        <h2 className="font-display text-[22px] text-ink">Check your inbox</h2>
        <p className="max-w-[320px] text-[15px] text-muted">
          We sent a magic sign-in link to <span className="font-bold text-ink">{email}</span>. Open
          it on this device to continue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      <label htmlFor="email" className="text-[13px] font-bold text-muted">
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-input border-2 border-border-soft bg-surface px-4 py-3 text-[15px] text-ink outline-none placeholder:text-faint focus:border-accent"
      />
      {error && <p className="text-[13px] font-semibold text-red">{error}</p>}
      <Button type="submit" variant="accent" full disabled={status === "sending"}>
        <Send size={17} />
        {status === "sending" ? "Sending…" : "Send magic link"}
      </Button>
    </form>
  );
}
