import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  experimental: {
    outputFileTracingIncludes: {
      "/**/*": ["./prisma/dev.db", "./prisma/schema.prisma"],
    },
  },
};

export default nextConfig;
