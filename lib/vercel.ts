const VERCEL_API_URL = "https://api.vercel.com";

// Helper to make authenticated requests to Vercel
async function fetchVercel(endpoint: string, options: RequestInit = {}) {
  // 1. Retrieve Environment Variables
  const token = process.env.VERCEL_TOKEN;
  let teamId = process.env.VERCEL_TEAM_ID;

  // 2. Sanitize Team ID
  if (!teamId || teamId.trim() === "" || teamId.includes("...") || teamId === "undefined") {
    teamId = undefined;
  }

  // 3. Debugging Checks
  if (!token || token.includes("...")) {
    console.error("❌ CRITICAL ERROR: VERCEL_TOKEN is missing or invalid.");
    throw new Error("Vercel Token is invalid or not loaded. Check your .env file.");
  }

  // --- DEBUG LOGGING (Safe) ---
  const tokenPreview = token.slice(0, 4) + "...";
  console.log(`🔌 [Vercel] Token: ${tokenPreview} | Team ID: ${teamId || "None (Personal Account)"}`);
  // ----------------------------

  // 4. Construct URL properly handling existing query params
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${VERCEL_API_URL}${endpoint}${
    teamId ? `${separator}teamId=${teamId}` : ""
  }`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("❌ Vercel Request Failed:", JSON.stringify(error, null, 2));
    // Fallback error message if Vercel doesn't return a structured error
    const errorMessage = error.error?.message || error.message || "Not authorized";
    throw new Error(`Vercel API Error: ${errorMessage}`);
  }

  return response.json();
}

export const vercel = {
  /**
   * 1. Create a new Vercel Project linked to a GitHub Repo
   */
  createProject: async (projectName: string, repoId: number, repoFullName?: string) => {
    const body: any = {
      name: projectName,
      framework: "nextjs",
      buildCommand: "npm run build",
      devCommand: "npm run dev",
      outputDirectory: ".next",
    };

    if (repoId) {
      body.gitRepository = {
        type: "github",
        repo: repoFullName || projectName,
        repoId: repoId.toString(),
      };
    }

    return fetchVercel("/v9/projects", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * 2. Assign a Custom Domain (Subdomain)
   */
  addDomain: async (projectId: string, domain: string) => {
    return fetchVercel(`/v9/projects/${projectId}/domains`, {
      method: "POST",
      body: JSON.stringify({
        name: domain,
      }),
    });
  },

  /**
   * 3. Get Deployment Status
   */
  getDeployment: async (deploymentId: string) => {
    return fetchVercel(`/v13/deployments/${deploymentId}`);
  },
};