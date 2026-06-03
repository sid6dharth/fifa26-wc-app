import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env";

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
};

/** Server Supabase client bound to the request's cookies (Server Components,
 *  Route Handlers, Server Actions). In a Server Component the cookie store is
 *  read-only, so writes are wrapped in try/catch — session refresh happens in
 *  middleware instead. */
export async function createClient() {
  const env = getPublicEnv();
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* called from a Server Component — safe to ignore (middleware refreshes) */
        }
      },
    },
  });
}

/** The authenticated user, verified against the auth server (not just the cookie). */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** User + their league profile. `profile` is null until they redeem an invite. */
export async function getUserAndProfile(): Promise<{ user: User | null; profile: Profile | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, is_admin, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (profile as Profile) ?? null };
}
