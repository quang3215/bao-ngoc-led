import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "baongocled.vn",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "rangdong.com.vn",
      },
      {
        protocol: "https",
        hostname: "static.rangdongstore.vn",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "vcdn.tikicdn.com",
      },
      {
        protocol: "https",
        hostname: "vcdn-tiki.b-cdn.net",
      },
    ],
  },
};

export default nextConfig;
