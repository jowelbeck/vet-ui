import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "https://web-production-91359.up.railway.app/:path*",
      },
    ];
  },
};

export default nextConfig;