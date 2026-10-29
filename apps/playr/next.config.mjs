/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
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
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '*.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopifycloud.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@playr/ui'],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/collections',
        permanent: true,
      },
      {
        source: '/entering-street-playR',
        destination: '/',
        permanent: true,
      },
      {
        source: '/entering-street-playr',
        destination: '/',
        permanent: true,
      },
      {
        source: '/track',
        destination: '/track-shipment',
        permanent: true,
      },
      {
        source: '/catalog',
        destination: '/catalogue',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
