await import('./src/shared/config/env/env.mjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: '*' }],
  },
  output: 'standalone',
}

export default nextConfig
