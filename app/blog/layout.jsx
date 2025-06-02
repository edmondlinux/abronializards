
export const metadata = {
  title: 'Reptile Care Blog | Abronia Lizards Expert Guides & Care Tips',
  description: 'Comprehensive reptile care guides for Abronia lizards, bearded dragons, geckos, and snakes. Expert breeding techniques, habitat setup, health care, and feeding guides from professional reptile keepers.',
  keywords: 'abronia lizards, reptile care, bearded dragon care, gecko care, snake care, reptile breeding, reptile habitat setup, reptile health, veterinary care, arboreal lizards, reptile feeding, terrarium setup',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Reptile Care Blog | Abronia Lizards Expert Guides & Care Tips',
    description: 'Comprehensive reptile care guides for Abronia lizards, bearded dragons, geckos, and snakes. Expert breeding techniques and professional care advice.',
    type: 'website',
    url: '/blog',
    siteName: 'Abronia Lizards',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reptile Care Blog | Abronia Lizards Expert Guides & Care Tips',
    description: 'Comprehensive reptile care guides for Abronia lizards, bearded dragons, geckos, and snakes. Expert breeding techniques and professional care advice.',
  },
  alternates: {
    canonical: '/blog',
  }
};

export default function BlogLayout({ children }) {
  return children;
}
