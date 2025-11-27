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
    
    // 1. Sanitization
    const cleanName = payload.siteName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") 
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);

    const finalName = cleanName || "my-saas-project";
    const uniqueSuffix = Date.now().toString().slice(-6);
    const repoName = `${finalName}-${uniqueSuffix}`;
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

    await logger.info("🚀 Starting Build...", { owner, repoName });

    // 2. Generate Content (Mock AI for now)
    await logger.info("🤖 Generating Code...", { prompt: payload.prompt });
    const aiGeneratedCode = await ai.generateLandingPage(payload.prompt);

    // 3. Create Database Record FIRST to get the Tenant ID
    await logger.info("💾 Registering Tenant...");
    const tenantId = await createTenant(
      payload.userId,
      payload.siteName, 
      payload.subdomain 
    );

    // 4. Create GitHub Repo
    await logger.info("📁 Creating GitHub Repo...", { repoName });
    const repo = await github.createRepo(repoName, `AI App: ${payload.prompt}`);
    
    // 5. Push Code
    await logger.info("📝 Pushing Code to GitHub...");
    await github.pushFile(repoName, "app/page.tsx", aiGeneratedCode, owner);

    // 6. Create Vercel Project
    await logger.info("☁️ Creating Vercel Project...");
    const project = await vercel.createProject(repoName, repo.id, `${owner}/${repoName}`);
    
    // 7. INJECT ENVIRONMENT VARIABLES (New Step)
    // This connects the user's app to the "Mothership" Supabase
    await logger.info("Tb️ Injecting Environment Variables...");
    await vercel.addEnvironmentVariables(project.id, [
      { key: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL!, target: ["production", "preview", "development"] },
      { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, target: ["production", "preview", "development"] },
      { key: "NEXT_PUBLIC_TENANT_ID", value: tenantId, target: ["production", "preview", "development"] }, // Critical for RLS
    ]);

    // 8. Assign Domain
    const fullDomain = `${payload.subdomain}-${uniqueSuffix}.${rootDomain}`;
    if (!rootDomain.includes("localhost")) {
      await logger.info("🌐 Adding Custom Domain...", { fullDomain });
      await vercel.addDomain(project.id, fullDomain);
    } else {
      await logger.info("⚠️ Skipping Vercel Domain (Localhost detected)", { fullDomain });
    }

    // 9. Update Tenant Status
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