import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@supabase/ssr", "@supabase/supabase-js"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
