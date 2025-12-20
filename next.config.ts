import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8055',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.spead.ai',
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;

