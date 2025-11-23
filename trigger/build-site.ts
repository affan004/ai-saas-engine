import { task, logger } from "@trigger.dev/sdk/v3";
import { github } from "../lib/github";
import { vercel } from "../lib/vercel";
import { ai } from "../lib/ai";
import { createTenant, supabaseAdmin } from "../lib/supabase"; 

type BuildPayload = {
  userId: string;
  siteName: string;
  subdomain: string;
  prompt: string;
};

export const buildSite = task({
  id: "build-site",
  run: async (payload: BuildPayload) => {
    const owner = await github.getCurrentUser();
    
    // --- ROBUST SANITIZATION ---
    // 1. Lowercase
    // 2. Replace any non-alphanumeric char with a hyphen
    // 3. Remove multiple consecutive hyphens
    // 4. Trim hyphens from start and end
    // 5. Truncate to 50 chars to leave room for suffix
    const cleanName = payload.siteName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Note the '+' to grab groups of special chars
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);

    // Ensure we don't end up with an empty string
    const finalName = cleanName || "my-saas-project";

    const uniqueSuffix = Date.now().toString().slice(-6);
    const repoName = `${finalName}-${uniqueSuffix}`;
    
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

    // ... rest of the logic (logging, AI, GitHub, Vercel) ...
    
    await logger.info("🚀 Starting Build...", { owner, repoName });

    // 3. AI Generation
    await logger.info("🤖 Generating Code...", { prompt: payload.prompt });
    const aiGeneratedCode = await ai.generateLandingPage(payload.prompt);

    // 4. GitHub Repo
    await logger.info("📁 Creating GitHub Repo...", { repoName });
    const repo = await github.createRepo(repoName, `AI App: ${payload.prompt}`);
    
    // 5. Push Code
    await logger.info("📝 Pushing Code to GitHub...");
    await github.pushFile(repoName, "app/page.tsx", aiGeneratedCode, owner);

    // 6. Vercel Deployment
    await logger.info("☁️ Deploying to Vercel...");
    const project = await vercel.createProject(`${owner}/${repoName}`, repo.id);
    const fullDomain = `${payload.subdomain}-${uniqueSuffix}.${rootDomain}`;
    await vercel.addDomain(project.id, fullDomain);

    // 7. Save to DB
    await logger.info("💾 Saving to Database...");
    const tenantId = await createTenant(
      payload.userId,
      payload.siteName, // We store the original display name in the DB
      payload.subdomain // We keep the original clean subdomain for the record
    );

    await supabaseAdmin
      .from("tenants")
      .update({ 
        custom_domain: fullDomain,
        subscription_status: "active" 
      })
      .eq("id", tenantId);

    await logger.info("✅ Build Complete!", { url: fullDomain });

    return {
      status: "success",
      liveUrl: `https://${fullDomain}`,
      dashboardUrl: `http://app.${rootDomain}`
    };
  },
});