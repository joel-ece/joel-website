import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/joel-website",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;