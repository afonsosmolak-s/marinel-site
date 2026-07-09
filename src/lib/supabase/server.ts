import { createClient } from "@supabase/supabase-js";

// SUPABASE_URL and SUPABASE_ANON_KEY intentionally lack the NEXT_PUBLIC_ prefix
// so that Turbopack does NOT inline them at build time. They are server-only
// and are read from process.env at runtime, when Vercel provides the real values.

// Strip BOM, stray quotes and whitespace that sneak in via dashboard copy-paste.
function clean(value: string | undefined): string {
  return (value ?? "").trim().replace(/^["']+|["']+$/g, "").trim();
}

// Public reads — RLS filters to published content (anon key)
export function createPublicClient() {
  return createClient(clean(process.env.SUPABASE_URL), clean(process.env.SUPABASE_ANON_KEY));
}

// Admin writes — bypasses RLS (service role, server-side only)
export function createAdminClient() {
  return createClient(clean(process.env.SUPABASE_URL), clean(process.env.SUPABASE_SERVICE_ROLE_KEY));
}
