import { NextResponse } from "next/server";
import { buildSite } from "@/trigger/build-site"; 
import { tasks } from "@trigger.dev/sdk/v3";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1. Initialize Supabase Client for Server
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
          remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }); },
        },
      }
    );

    // 2. Check Authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const { siteName, subdomain, prompt } = body;

    if (!siteName || !subdomain || !prompt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Trigger the job with REAL user ID
    const handle = await tasks.trigger<typeof buildSite>("build-site", {
      userId: user.id, 
      siteName,
      subdomain,
      prompt,
    });

    return NextResponse.json({ success: true, jobId: handle.id });
  } catch (error: any) {
    console.error("Trigger Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}