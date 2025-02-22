import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**", // Use "**" to allow all image paths under the hostname
      },
      {
        protocol: "https",
        hostname: "maps.geoapify.com",
        port: "",
        pathname: "**", // Use "**" to allow all image paths under the hostname
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "**", // Use "**" to allow all image paths under the hostname
      },
    ],
  },
};

export default nextConfig;
