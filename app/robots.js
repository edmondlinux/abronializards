export default function robots() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
    : 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/seller/',
        '/my-orders',
        '/order-placed',
        '/cart',
        '/add-address',
      ],
    },
    sitemap: `/sitemap.xml`,
  };
}
