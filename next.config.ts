import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Only run in local dev — GitHub Actions sets CI=true which disables this.
// initOpenNextCloudflareForDev has its own check but workerd crashes in CI sandbox.
if (!process.env.CI) {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
