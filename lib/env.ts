import { z } from "zod";

/**
 * Typed, validated environment access.
 *
 * Validation runs lazily (on first getter call) rather than at import time so
 * that `next build` succeeds before the Supabase project keys are filled in.
 * Once keys are present, a missing/blank value throws a clear error at the
 * point of use instead of failing somewhere deep in the Supabase client.
 *
 * Only `NEXT_PUBLIC_*` values are available in the browser bundle; the service
 * role key is server-only and must never be imported into client code.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

let publicEnv: z.infer<typeof publicSchema> | null = null;
let serverEnv: z.infer<typeof serverSchema> | null = null;

export function getPublicEnv() {
  if (publicEnv) return publicEnv;
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!parsed.success) {
    throw new Error(
      `Missing/invalid public env. Copy .env.example to .env.local and fill it in.\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`,
    );
  }
  publicEnv = parsed.data;
  return publicEnv;
}

export function getServerEnv() {
  if (serverEnv) return serverEnv;
  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  if (!parsed.success) {
    throw new Error(
      `Missing/invalid server env.\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`,
    );
  }
  serverEnv = parsed.data;
  return serverEnv;
}
