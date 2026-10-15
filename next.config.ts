import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Demo profile photos (see src/lib/people.ts). Pinned to our exact crop params.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
        search: "?fit=crop&crop=faces&w=256&h=256",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
