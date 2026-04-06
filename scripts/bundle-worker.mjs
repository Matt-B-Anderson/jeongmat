/**
 * Bundles .open-next/worker.js into .open-next/assets/_worker.js
 * for Cloudflare Pages Advanced Mode deployment.
 *
 * Wrangler (not just esbuild) must be used because worker.js contains
 * Cloudflare-specific imports resolved by wrangler's build pipeline.
 */

import { execSync } from "node:child_process";
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");
const workerSrc = join(root, ".open-next", "worker.js");
const assetsDir = join(root, ".open-next", "assets");
const tempWranglerConfig = join(root, ".wrangler-bundle.json");

if (!existsSync(workerSrc)) {
  console.error("ERROR: .open-next/worker.js not found. Run opennextjs-cloudflare build first.");
  process.exit(1);
}

mkdirSync(assetsDir, { recursive: true });

// Write a temporary wrangler config for bundling only (no pages_build_output_dir)
// This tells wrangler to treat worker.js as a Workers entry point and bundle it.
const tempConfig = {
  name: "jeongmat-bundle",
  main: ".open-next/worker.js",
  compatibility_date: "2024-12-18",
  compatibility_flags: ["nodejs_compat"],
};

writeFileSync(tempWranglerConfig, JSON.stringify(tempConfig, null, 2));

console.log("Bundling .open-next/worker.js -> .open-next/assets/_worker.js ...");

try {
  // --dry-run: don't deploy, just write bundled output
  // --outdir: write bundled file(s) to this directory
  execSync(
    `npx wrangler deploy --dry-run --outdir .open-next/assets -c .wrangler-bundle.json`,
    { cwd: root, stdio: "inherit" }
  );

  // wrangler writes the bundle as worker.js (base name) — rename to _worker.js
  const workerDest = join(assetsDir, "_worker.js");
  const candidates = ["worker.js", "jeongmat-bundle.js", "jeongmat.js"];
  let renamed = false;
  for (const candidate of candidates) {
    const candidatePath = join(assetsDir, candidate);
    if (existsSync(candidatePath) && candidate !== "_worker.js") {
      const { renameSync } = await import("node:fs");
      renameSync(candidatePath, workerDest);
      console.log(`✓ Renamed ${candidate} -> _worker.js in .open-next/assets/`);
      renamed = true;
      break;
    }
  }
  if (!renamed) {
    if (existsSync(workerDest)) {
      console.log("✓ _worker.js already present in .open-next/assets/");
    } else {
      console.error("ERROR: wrangler --dry-run did not produce expected output file.");
      console.log("Contents of .open-next/assets/:", execSync("ls .open-next/assets/", { cwd: root }).toString());
      process.exit(1);
    }
  }
} finally {
  // Clean up temp config
  if (existsSync(tempWranglerConfig)) unlinkSync(tempWranglerConfig);
}
