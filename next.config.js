/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Enable server-side features for Firebase
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    // Enable web worker support
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        inline: 'no-fallback'
      }
    });

    return config;
  }
}

module.exports = nextConfig 