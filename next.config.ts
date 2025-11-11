import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ["better-sqlite3"],

  devIndicators: {

  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.fanart.tv",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "theposterdb.com",
        pathname: "/api/assets/**",
      },
    ],
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
