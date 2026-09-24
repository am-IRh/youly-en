import "@youly-en/env/web";

import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "@youly-en/env/web";
import type { NextConfig } from "next";

const appDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(appDir, "../..");
const turbopackRoot = existsSync(join(workspaceRoot, "packages")) ? workspaceRoot : appDir;

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  turbopack: {
    root: turbopackRoot,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${env.API_INTERNAL_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
