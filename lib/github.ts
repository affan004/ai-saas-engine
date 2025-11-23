import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const github = {
  // Helper to get the authenticated user's login
  getCurrentUser: async () => {
    const { data } = await octokit.rest.users.getAuthenticated();
    return data.login;
  },

  createRepo: async (name: string, description: string) => {
    try {
      const response = await octokit.rest.repos.createForAuthenticatedUser({
        name,
        description,
        private: true,
        auto_init: true, // This creates the 'main' branch with a README
      });
      return response.data;
    } catch (error: any) {
      if (error.status === 422 && error.message.includes("name already exists")) {
        console.log(`Repo '${name}' already exists. Fetching existing repo...`);
        const { data: user } = await octokit.rest.users.getAuthenticated();
        const { data: existingRepo } = await octokit.rest.repos.get({
          owner: user.login, 
          repo: name,
        });
        return existingRepo;
      }
      console.error("GitHub Repo Creation Failed:", error.message);
      throw new Error(`Failed to create repo: ${error.message}`);
    }
  },

  pushFile: async (
    repoName: string,
    path: string,
    content: string,
    owner: string
  ) => {
    try {
      // 1. Try to get the file first to see if we are UPDATING or CREATING
      let sha: string | undefined;
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo: repoName,
          path,
        });
        // If file exists, TypeScript needs assurance it's not an array
        if (!Array.isArray(data)) {
          sha = data.sha;
        }
      } catch (e: any) {
        // 404 means file doesn't exist, which is fine. We will create it.
        // If 404 is for the REPO, then the previous step failed badly.
        if (e.status !== 404) {
           console.warn("Error checking file existence:", e.message);
        }
      }

      // 2. Create or Update the file
      // We simply push to 'main'. If 'auto_init' worked, 'main' exists.
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path,
        message: `AI Generation: Updated ${path}`,
        content: Buffer.from(content).toString("base64"),
        sha, // undefined = create, string = update
        branch: "main",
      });
      
      return true;
    } catch (error: any) {
      console.error(`Failed to push file ${path}:`, error.message);
      
      // Specific error handling for "Git Repository is empty"
      if (error.status === 409) {
         throw new Error("Repository is empty. Ensure auto_init is true.");
      }
      
      throw error;
    }
  },
};