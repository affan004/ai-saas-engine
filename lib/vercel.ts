const VERCEL_API_URL = "https://api.vercel.com";

// Helper to make authenticated requests to Vercel
async function fetchVercel(endpoint: string, options: RequestInit = {}) {
  const teamId = process.env.VERCEL_TEAM_ID; // Required for teams
  const url = `${VERCEL_API_URL}${endpoint}${
    teamId ? `?teamId=${teamId}` : ""
  }`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Vercel API Error: ${error.error?.message || "Unknown"}`);
  }

  return response.json();
}

export const vercel = {
  /**
   * 1. Create a new Vercel Project linked to a GitHub Repo
   * This automatically triggers the first deployment.
   */
  createProject: async (repoName: string, repoId: number) => {
    return fetchVercel("/v9/projects", {
      method: "POST",
      body: JSON.stringify({
        name: repoName, // e.g. "dentist-crm-user-123"
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: repoName, // The full repo name "org/repo" is handled by the connection usually, but ID is safer
          repoId: repoId.toString(),
        },
        // Important: Ensure we use the correct build settings for Next.js App Router
        buildCommand: "npm run build",
        devCommand: "npm run dev",
        outputDirectory: ".next",
      }),
    });
  },

  /**
   * 2. Assign a Custom Domain (Subdomain) to the Project
   * e.g. "dentist-1.yoursite.com"
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
   * 3. (Optional) Get Deployment Status
   */
  getDeployment: async (deploymentId: string) => {
    return fetchVercel(`/v13/deployments/${deploymentId}`);
  },
};