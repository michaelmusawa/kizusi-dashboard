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
        hostname: "cdn.3dmodels.org",
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
  webpack: (config) => {
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
    };
    return config;
  },
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
  },
};

export default nextConfig;
