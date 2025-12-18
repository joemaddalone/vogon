import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n.ts");

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  serverExternalPackages: ["better-sqlite3"],
  output: "standalone",
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
      {
        protocol: "https",
        hostname: "images.theposterdb.com",
        pathname: "/**",
      }
    ],
  },
  experimental: {
    viewTransition: true,
  },
};

export default withNextIntl(nextConfig);
