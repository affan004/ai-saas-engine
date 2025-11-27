import { createClient } from "@supabase/supabase-js";

// 1. Validate Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase Environment Variables! Check .env.local");
}

// 2. Standard Client (For Frontend/Auth)
// We use a getter or a safe initialization to prevent immediate crashes if env vars are missing during build time
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);

// 3. Admin Client (For Trigger.dev / Backend Jobs)
// Only initialize this if the service key is present to avoid server-side crashes
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl || "", supabaseServiceKey)
  : (null as any); // Cast to any to avoid TS errors, but be careful using it

// Helper to create a tenant programmatically
export const createTenant = async (
  userId: string,
  siteName: string,
  subdomain: string
) => {
  if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized. Missing Service Role Key.");
  
  const { data, error } = await supabaseAdmin.rpc("create_tenant_for_user", {
    tenant_name: siteName,
    tenant_slug: subdomain,
    user_id: userId,
  });

  if (error) throw error;
  return data; // Returns the new tenant_id
};