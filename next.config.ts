/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
    // Alternatively, you can use remotePatterns for more specific control
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // This disables ESLint during the build process
  },
}

module.exports = nextConfig

