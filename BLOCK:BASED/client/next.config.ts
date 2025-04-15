import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.WP_IMAGES_URL || "",
      },
    ],
  },
};

export default nextConfig;
