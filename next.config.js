/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Allow SVG files served as images
  webpack(config) {
    return config
  },
}
module.exports = nextConfig
