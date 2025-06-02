
export const metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
    : 'http://localhost:3000'),
  title: 'Products | Abronia Lizards',
  description: 'Discover our collection of captive-bred Abronia lizards and reptile supplies.',
  keywords: 'abronia lizards, reptiles, captive bred, lizard care, reptile supplies',
  openGraph: {
    title: 'Products | Abronia Lizards',
    description: 'Discover our collection of captive-bred Abronia lizards and reptile supplies.',
    type: 'website',
    url: '/product',
    images: [
      {
        url: '/assets/header_abronia_graminea_image.png',
        width: 800,
        height: 600,
        alt: 'Abronia Lizards Collection',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | Abronia Lizards',
    description: 'Discover our collection of captive-bred Abronia lizards and reptile supplies.',
    images: ['/assets/header_abronia_graminea_image.png'],
  },
  alternates: {
    canonical: '/product',
  }
};

export default function ProductLayout({ children }) {
  return children;
}
