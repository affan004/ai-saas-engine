import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID!, // Found in Trigger.dev Dashboard
  runtime: "node",
  logLevel: "log",
  // Automatically retry failed jobs (e.g., if GitHub API flickers)
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./trigger"], // Look for jobs in the 'trigger' folder
});