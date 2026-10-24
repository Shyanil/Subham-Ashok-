import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Sources are the pre-generated 1920px WebP renders (scripts/prepare-images.mjs)
    // and brochure extracts; next/image resizes them and serves AVIF, then WebP.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
    deviceSizes: [360, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: '/(images|brochure|brand)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
    ];
  },
};

export default nextConfig;
