import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Ajoute ici les autres domaines d'où viendront tes URLs d'images
      // (Cloudinary, Unsplash, etc.) au fur et à mesure.
    ],
  },
};

export default nextConfig;
