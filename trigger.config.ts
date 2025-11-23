import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  // REPLACE THIS STRING WITH YOUR ACTUAL PROJECT REF
  project: "proj_djqfrixwcnmbnoneybxq", 
  
  runtime: "node",
  logLevel: "log",
  maxDuration: 60, 
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
  dirs: ["./trigger"], 
});