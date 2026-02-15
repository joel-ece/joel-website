import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'output: export' for Vercel (we need server features for auth)
  // basePath is only for GitHub Pages, remove it for Vercel
  images: {
    unoptimized: true,
  },
};

export default nextConfig;