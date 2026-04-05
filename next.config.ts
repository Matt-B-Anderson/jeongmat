import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Initialize Cloudflare bindings (D1, KV, etc.) for local `next dev`
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages deployment via OpenNext
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
