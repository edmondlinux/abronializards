
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

  return {
    title,
    description,
    keywords: blogPost.tags ? blogPost.tags.join(', ') : 'reptile care, expert advice',
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/blog/${resolvedParams.slug}`,
      images: blogPost.featuredImage ? [
        {
          url: blogPost.featuredImage,
          width: 800,
          height: 600,
          alt: blogPost.title,
        }
      ] : undefined,
      publishedTime: blogPost.publishDate,
      tags: blogPost.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blogPost.featuredImage ? [blogPost.featuredImage] : undefined,
    },
    alternates: {
      canonical: `/blog/${resolvedParams.slug}`,
    }
  };
}

export default function BlogPostLayout({ children }) {
  return children;
}
