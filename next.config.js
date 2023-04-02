/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default;
// const runtimeCaching = require('@ducanh2912/next-pwa/cache.js');

const conf = {
  experimental: {
    appDir: true,
  },

  webpack: (config) => {
    config.externals = [...config.externals, 'bcrypt'];
    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // runtimeCaching,
})(conf);

module.exports = nextConfig;
