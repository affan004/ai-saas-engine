import { NextResponse } from "next/server";
import { buildSite } from "@/trigger/build-site"; // Import the Trigger.dev job
import { tasks } from "@trigger.dev/sdk/v3";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { siteName, subdomain, prompt } = body;

    // Basic validation
    if (!siteName || !subdomain || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // MOCK USER ID: In a real app, get this from Supabase Auth
    // const supabase = createClient(cookies());
    // const { data: { user } } = await supabase.auth.getUser();
    const mockUserId = "user_123"; 

    // Trigger the background job
    const handle = await tasks.trigger<typeof buildSite>("build-site", {
      userId: mockUserId,
      siteName,
      subdomain,
      prompt,
    });

    return NextResponse.json({
      success: true,
      jobId: handle.id,
    });
  } catch (error: any) {
    console.error("Failed to trigger build:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}