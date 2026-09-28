import type { NextConfig } from "next";

// Static export served by Workers Static Assets (docs/runbooks/adopt-static-next-site.md).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
