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

    // MOCK USER ID (Must be a valid UUID for Postgres)
    // In the future, this comes from: const { user } = await supabase.auth.getUser();
    const TEST_USER_ID = "00000000-0000-0000-0000-000000000000"; 

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