import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();

const sportilCloudflareConfig = {
  ...config,
  buildCommand: "corepack pnpm build",
};

export default sportilCloudflareConfig;
