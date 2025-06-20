export default function robots() {
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
    sitemap: 'https://abronializards.com/sitemap.xml',
  }
} 