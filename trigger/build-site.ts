import { task } from "@trigger.dev/sdk/v3";
import { github } from "@/lib/github";

// Define the payload this job expects
type BuildPayload = {
  userId: string;
  siteName: string; // e.g. "dentist-crm"
  subdomain: string; // e.g. "dentist-1"
  aiGeneratedCode: string; // The HTML/React code from Claude
};

export const buildSite = task({
  id: "build-site", // Unique job identifier
  // This job can run for up to 1 hour without timing out (Serverless V3)
  run: async (payload: BuildPayload, { ctx }) => {
    const repoName = `${payload.siteName}-${payload.userId}`;
    const owner = process.env.GITHUB_ORG_OR_USER!;

    // Step 1: Create the GitHub Repository
    await ctx.logger.info("Creating GitHub Repo...", { repoName });
    const repo = await github.createRepo(
      repoName,
      `AI Generated App for ${payload.userId}`
    );

    // Step 2: Push the AI Code to the Repo
    await ctx.logger.info("Pushing AI Code...");
    await github.pushFile(
      repoName,
      "app/page.tsx", // Pushing to the Next.js App Router path
      payload.aiGeneratedCode,
      owner
    );

    // Step 3: (Future) Trigger Vercel Deployment
    // We will add the Vercel API call here in the next step.
    await ctx.logger.info("Ready for Deployment", { 
      repoUrl: repo.html_url 
    });

    return {
      status: "success",
      repoUrl: repo.html_url,
      liveUrl: `https://${payload.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    };
  },
});