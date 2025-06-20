/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '**',
      },
    ],
  },
  async headers() {
    const headers = [];
    if (
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ) {
      headers.push({
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index',
          },
          {
            key: 'Link',
            value: ' < https://www.abronializards.com/ >; rel="canonical"',
          },
        ],
        source: '/:path*',
      });
    }
    return headers;
  },
};

export default nextConfig;