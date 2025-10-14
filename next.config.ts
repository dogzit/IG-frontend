import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: { HF: process.env.HF ?? "" },
};

export default nextConfig;
