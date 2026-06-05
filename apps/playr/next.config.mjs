/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@playr/ui", "@playr/nectar-core"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.nectar.internal',
      },
      {
        protocol: 'https',
        hostname: 'playr.in',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@playr/ui'],
  },
};

export default nextConfig;
