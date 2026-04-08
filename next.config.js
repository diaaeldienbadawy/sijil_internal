/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // In production: client and API are on the same domain, no proxy needed.
  // In development: proxy /api/* to the remote API to avoid CORS issues.
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tenderapi.sijilacc.com';
      return [
        {
          source: '/api/:path*',
          destination: `${apiBase}/api/:path*`,
        },
      ];
    },
  }),
};

module.exports = nextConfig;
