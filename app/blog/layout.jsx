
export const metadata = {
  title: 'Reptile Care Blog | Expert Guides for Abronia, Bearded Dragons, Geckos & Snakes',
  description: 'Explore professional reptile care guides for Abronia lizards, bearded dragons, geckos, and snakes. Learn breeding tips, terrarium setup, health advice, and feeding techniques from expert herpetologists.',
  keywords: [
    'abronia lizards', 'reptile care', 'bearded dragon care', 'gecko care',
    'snake care', 'reptile husbandry', 'captive reptile breeding',
    'reptile terrarium setup', 'lizard feeding guide', 'arboreal lizard care',
    'reptile health care', 'reptile blog', 'herpetology tips'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: 'large',
      maxVideoPreview: -1,
    },
  },
  openGraph: {
    title: 'Reptile Care Blog | Tips for Healthy Lizards & Snakes',
    description: 'In-depth reptile care blog featuring Abronia, geckos, bearded dragons, and snakes. Written by expert breeders and reptile keepers.',
    type: 'website',
    url: '/blog',
    siteName: 'Abronia Lizards',
    locale: 'en_US',
    images: [
      {
        url: 'https://ik.imagekit.io/14iir4o77/IMG_9614.png?updatedAt=1748941215499',
        width: 1200,
        height: 630,
        alt: 'Reptile Care Blog Cover – Abronia Graminea & Exotic Lizards'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reptile Care Blog | Expert Tips on Lizards, Snakes & Terrariums',
    description: 'Get the best reptile care advice for lizards and snakes. Expert tips on breeding, feeding, and habitat setup from seasoned herpetologists.',
    images: ['https://ik.imagekit.io/14iir4o77/IMG_9614.png?updatedAt=1748941215499']
  },
  alternates: {
    canonical: '/blog',
  }
};

export default function BlogLayout({ children }) {
  return children;
}
