import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.netanya.muni.il",
        protocol: "https",
      },
    ],
  },
  reactStrictMode: true,
  transpilePackages: ["@sportil/ui", "@sportil/types"],
  typedRoutes: true,
};

export default nextConfig;
