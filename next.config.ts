import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kxawpwftkucyzvccvlyj.supabase.co', // Domain Supabase Anda
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // Untuk avatar inisial
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Untuk gambar placeholder
      }
    ],
  },
};

export default nextConfig;