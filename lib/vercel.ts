const VERCEL_API_URL = "https://api.vercel.com";

// Helper to make authenticated requests to Vercel
async function fetchVercel(endpoint: string, options: RequestInit = {}) {
  const token = process.env.VERCEL_TOKEN;
  let teamId = process.env.VERCEL_TEAM_ID;

  if (!teamId || teamId.trim() === "" || teamId.includes("...") || teamId === "undefined") {
    teamId = undefined;
  }

  if (!token || token.includes("...")) {
    console.error("❌ CRITICAL ERROR: VERCEL_TOKEN is missing or invalid.");
    throw new Error("Vercel Token is invalid or not loaded.");
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${VERCEL_API_URL}${endpoint}${
    teamId ? `${separator}teamId=${teamId}` : ""
  }`;

  constVercelResponse = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!constVercelResponse.ok) {
    const error = await constVercelResponse.json();
    console.error("❌ Vercel Request Failed:", JSON.stringify(error, null, 2));
    const errorMessage = error.error?.message || error.message || "Not authorized";
    throw new Error(`Vercel API Error: ${errorMessage}`);
  }

  return constVercelResponse.json();
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
   * 3. Add Environment Variables (CRITICAL FOR DB CONNECTION)
   * This allows the user's app to connect to YOUR Supabase instance.
   */
  addEnvironmentVariables: async (projectId: string, variables: { key: string; value: string; target: string[] }[]) => {
    // Vercel accepts an array of env vars in a single call
    return fetchVercel(`/v9/projects/${projectId}/env`, {
      method: "POST",
      body: JSON.stringify(variables),
    });
  },

  /**
   * 4. Get Deployment Status
   */
  getDeployment: async (deploymentId: string) => {
    return fetchVercel(`/v13/deployments/${deploymentId}`);
  },
};