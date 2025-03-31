/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure Next.js uses relative paths for assets
  assetPrefix: './',
  // Disable server-side features when exporting
  trailingSlash: true,
}

module.exports = nextConfig 