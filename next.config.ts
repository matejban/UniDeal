import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Slike partnera i ponuda dolaze iz Supabase Storagea (#13).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Server Actioni po zadanom primaju najviše 1 MB, a slika smije imati 2 MB.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
