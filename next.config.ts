import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    mdxRs: true,
  },
  serverExternalPackages: ["mongoose"],

};

export default nextConfig;
