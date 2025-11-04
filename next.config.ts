import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    HF: process.env.HF ?? "",
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    BLOB_SECRET_READ_WRITE_TOKEN:
      process.env.BLOB_SECRET_READ_WRITE_TOKEN ?? "",
  },
};

export default nextConfig;
