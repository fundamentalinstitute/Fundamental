import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Single build worker: prevents out-of-memory crashes when building on
  // low-RAM machines. The site is small, so the build-time cost is minimal.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
