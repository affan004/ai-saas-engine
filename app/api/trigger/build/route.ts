import { NextResponse } from "next/server";
import { buildSite } from "@/trigger/build-site"; 
import { tasks } from "@trigger.dev/sdk/v3";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { siteName, subdomain, prompt } = body;

    if (!siteName || !subdomain || !prompt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // --- FIX APPLIED HERE ---
    // The Error "23503" happened because '0000...' didn't exist in auth.users.
    // To fix this, replace the UUID below with a REAL User UID from your Supabase Dashboard.
    // Go to Supabase -> Authentication -> Users -> Copy UID.
    const TEST_USER_ID = "0795318f-f96e-42d3-b0aa-c4b49d7c4b95"; 
    
    // Note: Ideally, you should implement real auth check here:
    // const cookieStore = cookies();
    // const { data: { user } } = await supabase.auth.getUser();
    // const userId = user?.id;

    const handle = await tasks.trigger<typeof buildSite>("build-site", {
      userId: TEST_USER_ID, 
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