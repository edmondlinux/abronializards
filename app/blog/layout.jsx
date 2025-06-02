
export const metadata = {
  title: 'Reptile Care Blog | Expert Guides and Tips',
  description: 'Expert guides and tips for reptile care, from beginner basics to advanced breeding techniques. Learn about bearded dragons, geckos, snakes, and more.',
  keywords: 'reptile care, bearded dragon, gecko, snake care, reptile breeding, reptile habitat, reptile health, veterinary care',
  openGraph: {
    title: 'Reptile Care Blog | Expert Guides and Tips',
    description: 'Expert guides and tips for reptile care, from beginner basics to advanced breeding techniques.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reptile Care Blog | Expert Guides and Tips',
    description: 'Expert guides and tips for reptile care, from beginner basics to advanced breeding techniques.',
  }
};

export default function BlogLayout({ children }) {
  return children;
}
