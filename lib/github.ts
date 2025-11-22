import { Octokit } from "octokit";

// Initialize Octokit with your Personal Access Token (PAT) or GitHub App Token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const github = {
  // 1. Create a new empty repository
  createRepo: async (name: string, description: string) => {
    try {
      const response = await octokit.rest.repos.createForAuthenticatedUser({
        name, // e.g., "dentist-crm-user-123"
        description,
        private: true, // Always default to private for user apps
        auto_init: true, // Creates a README so we can push immediately
      });
      return response.data;
    } catch (error: any) {
      console.error("GitHub Repo Creation Failed:", error.message);
      throw new Error(`Failed to create repo: ${error.message}`);
    }
  },

  // 2. Push a file (e.g., the AI-generated page.tsx)
  pushFile: async (
    repoName: string,
    path: string,
    content: string,
    owner: string
  ) => {
    try {
      // A. Get the repository's main branch ref to find the latest commit SHA
      const { data: refData } = await octokit.rest.git.getRef({
        owner,
        repo: repoName,
        ref: "heads/main",
      });

      // B. Create a file in the repo
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path,
        message: `AI Generation: Updated ${path}`,
        content: Buffer.from(content).toString("base64"), // Content must be Base64 encoded
        sha: undefined, // For new files, SHA is undefined. For updates, fetch it first.
        branch: "main",
      });
      
      return true;
    } catch (error: any) {
      console.error(`Failed to push file ${path}:`, error.message);
      throw error;
    }
  },
};