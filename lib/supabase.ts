import { createClient } from "@supabase/supabase-js";

// 1. Standard Client (For Frontend/Auth)
// Uses the public anon key. Safe for browser use.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2. Admin Client (For Trigger.dev / Backend Jobs)
// Uses the SERVICE_ROLE_KEY. Bypasses RLS.
// WARNING: Never expose this to the client-side.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to create a tenant programmatically
export const createTenant = async (
  userId: string,
  siteName: string,
  subdomain: string
) => {
  const { data, error } = await supabaseAdmin.rpc("create_tenant_for_user", {
    tenant_name: siteName,
    tenant_slug: subdomain,
    user_id: userId,
  });

  if (error) throw error;
  return data; // Returns the new tenant_id
};