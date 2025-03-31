/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure Next.js uses relative paths for assets
  assetPrefix: './',
  // Enable server-side features for Firebase
  trailingSlash: true,
}

module.exports = nextConfig 