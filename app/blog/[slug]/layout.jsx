import { notFound } from 'next/navigation';
import React from 'react';

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
    robots: 'index, follow',
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}/blog/${resolvedParams.slug}`,
      images: blogPost.featuredImage ? [blogPost.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blogPost.featuredImage ? [blogPost.featuredImage] : [],
    },
    alternates: {
      canonical: `/blog/${resolvedParams.slug}`,
    }
  };

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

export const blogFaqs = [
  {
    question: 'What is the best way to care for Abronia lizards?',
    answer: 'Provide a humid, well-ventilated enclosure with plenty of climbing branches and a varied diet.'
  },
  {
    question: 'Are Abronia lizards good for beginners?',
    answer: 'They are best suited for keepers with some reptile experience due to their specific care needs.'
  },
  {
    question: 'Where can I find more reptile care tips?',
    answer: 'Explore our blog for expert guides, care tips, and the latest news on Abronia lizards.'
  }
];

export default async function BlogPostLayout({ children, params }) {
  const blogPost = await getBlogPost(params.slug);

  let structuredData = null;
  if (blogPost) {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": blogPost.title,
      "description": blogPost.excerpt || blogPost.description,
      "image": blogPost.featuredImage ? [blogPost.featuredImage] : [],
      "datePublished": blogPost.publishDate,
      "dateModified": blogPost.updatedAt || blogPost.publishDate,
      "author": {
        "@type": "Organization",
        "name": "Abronia Lizards",
        "url": "https://abronializards.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Abronia Lizards",
        "logo": {
          "@type": "ImageObject",
          "url": "https://abronializards.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://abronializards.com/blog/${params.slug}`
      },
      "keywords": blogPost.tags ? blogPost.tags.join(', ') : 'reptile care, abronia lizards',
      "articleSection": blogPost.category,
      "about": {
        "@type": "Thing",
        "name": blogPost.reptileSpecies || "Reptile Care"
      }
    };
  }

  // FAQPage structured data
  const faqStructuredData = blogFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blogFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}
      {children}
      {/* FAQ Section */}
      {blogFaqs.length > 0 && (
        <div className="max-w-2xl mx-auto my-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <dl className="space-y-4">
            {blogFaqs.map((faq, idx) => (
              <div key={idx}>
                <dt className="font-semibold text-gray-800">{faq.question}</dt>
                <dd className="text-gray-600 ml-2">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </>
  );
}
