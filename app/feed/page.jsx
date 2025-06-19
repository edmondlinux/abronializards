import SEO from '@/components/SEO';
import FeedClient from '@/components/feed/FeedClient';

export const metadata = {
    title: 'Community Feed - Share & Connect',
    description: 'Join our vibrant community feed to share your thoughts, connect with others, and stay updated with the latest posts from fellow community members.',
    keywords: 'community, social media, feed, posts, sharing, connect, discussion, social network',
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
        title: 'Community Feed - Share & Connect',
        description: 'Join our vibrant community feed to share your thoughts, connect with others, and stay updated with the latest posts.',
        type: 'website',
        url: '/feed',
        locale: 'en_US',
        siteName: 'Community Platform',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Community Feed - Share & Connect',
        description: 'Join our vibrant community feed to share your thoughts and connect with others.',
        creator: '@yourhandle',
    },
    alternates: {
        canonical: '/feed',
    }
};

export default function FeedPage() {
    return (
      <>
        <SEO
          title="Community Feed - Share & Connect"
          description="Join our vibrant community feed to share your thoughts, connect with others, and stay updated with the latest posts from fellow community members."
          canonical="https://abronializards.com/feed"
          url="https://abronializards.com/feed"
          image="https://ik.imagekit.io/14iir4o77/IMG_9610.png?updatedAt=1748940318208"
          openGraph={{
            type: 'website',
            siteName: 'Abronia Lizards',
          }}
          twitter={{
            card: 'summary_large_image',
            site: '@abronializards',
            creator: '@abronializards',
          }}
        />
        <FeedClient />
      </>
    );
}
