import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          gsap: {
            test: /[\\/]node_modules[\\/]gsap/,
            name: 'gsap',
            priority: 20,
            reuseExistingChunk: true,
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion/,
            name: 'framer-motion',
            priority: 20,
            reuseExistingChunk: true,
          },
          animations: {
            test: /[\\/]src[\\/]lib[\\/](gsapSafety|globalAnimationManager|framerMotionOptimization)/,
            name: 'animations',
            priority: 15,
            reuseExistingChunk: true,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  productionBrowserSourceMaps: true,

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

};

export default nextConfig;