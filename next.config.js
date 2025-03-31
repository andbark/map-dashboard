/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Enable server-side features for Firebase
  experimental: {
    serverActions: true,
  }
}

module.exports = nextConfig 