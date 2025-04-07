import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.WP_IMAGES_URL || ""],
  },
};

export default nextConfig;
