
import { notFound } from 'next/navigation';

async function getBlogPost(slug) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.blogPost : null;
  } catch (error) {
    console.error('Error fetching blog post for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const blogPost = await getBlogPost(resolvedParams.slug);

  if (!blogPost) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  const title = `${blogPost.title} | Reptile Care Blog`;
  const description = blogPost.excerpt || `Read about ${blogPost.title} - expert reptile care advice and tips.`;

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
    : 'http://localhost:3000';

  return {
    title,
    description,
    keywords: blogPost.tags ? blogPost.tags.join(', ') : 'reptile care, expert advice',
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
      title,
      description,
      type: 'article',
      url: `${baseUrl}/blog/${resolvedParams.slug}`,
      images: blogPost.featuredImage ? [
        {
          url: blogPost.featuredImage,
          width: 1200,
          height: 630,
          alt: blogPost.title,
        }
      ] : undefined,
      publishedTime: blogPost.publishDate,
      tags: blogPost.tags,
      locale: 'en_US',
      siteName: 'Abronia Lizards',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blogPost.featuredImage ? [blogPost.featuredImage] : undefined,
      creator: '@abronializards',
    },
    alternates: {
      canonical: `${baseUrl}/blog/${resolvedParams.slug}`,
    }
  };
}

export default function BlogPostLayout({ children }) {
  return children;
}
