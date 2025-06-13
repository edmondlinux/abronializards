export const metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
    : 'http://localhost:3000'),

  title: 'Shop Abronia Lizards & Reptile Supplies | Captive-Bred, Healthy & Shipped Safely',

  description: 'Explore our premium collection of captive-bred Abronia lizards—including Graminea, Taeniata & Mixteca—starting as low as $99. Ethically bred, healthy reptiles with fast shipping and expert support.',

  keywords: [
    'abronia lizards for sale', 'buy abronia graminea', 'captive bred reptiles',
    'arboreal lizards', 'healthy lizards shipped', 'reptile supplies',
    'abronia taeniata', 'abronia mixteca', 'lizard care products', 
    'exotic pets under $100', 'reptiles starting at $99'
  ],

  openGraph: {
    title: 'Shop Captive-Bred Abronia Lizards & Reptile Supplies',
    description: 'Captive-bred Abronia lizards from $99. Premium quality, ethical breeding, fast shipping, and expert reptile care products.',
    type: 'website',
    url: '/product',
    siteName: 'Abronia Lizards',
    images: [
      {
        url: 'https://ik.imagekit.io/14iir4o77/IMG_9616.png?updatedAt=1748941911769',
        width: 1200,
        height: 630,
        alt: 'Captive-Bred Abronia Lizards and Reptile Supplies',
      }
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Captive-Bred Abronia Lizards from $99 | Shop Reptile Supplies',
    description: 'Get healthy captive-bred Abronia lizards starting at $99. Fast shipping and trusted care from experienced breeders.',
    images: ['https://ik.imagekit.io/14iir4o77/IMG_9616.png?updatedAt=1748941911769'],
  },

  alternates: {
    canonical: '/product',
  }
};

export default function ProductLayout({ children }) {
  return children;
}