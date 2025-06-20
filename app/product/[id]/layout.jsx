import { notFound } from 'next/navigation';
import React from 'react';

async function getProduct(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${baseUrl}/api/product/${slug}`, {
      cache: 'force-cache'
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.product : null;
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return null;
  }
}

// Helper function to truncate text to specific length
function truncateDescription(text, maxLength = 150) {
  if (!text) return '';

  if (text.length <= maxLength) {
    return text;
  }

  // Find the last complete word within the limit
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }

  return truncated + '...';
}

// Helper function to create optimized description
function createOptimizedDescription(product) {
  const maxLength = 155; // Google's typical limit
  const price = `$${product.offerPrice}`;
  const priceText = ` - ${price}`;

  // Strategy 1: If description exists, try to fit it with price
  if (product.description) {
    const availableLength = maxLength - priceText.length;

    if (product.description.length <= availableLength) {
      return `${product.description}${priceText}`;
    } else {
      // Truncate description to fit with price
      const truncatedDesc = truncateDescription(product.description, availableLength);
      return `${truncatedDesc}${priceText}`;
    }
  }

  // Strategy 2: Fallback description with price
  const fallbackDesc = `Premium quality ${product.name} from our captive breeding program`;
  const availableLength = maxLength - priceText.length;

  if (fallbackDesc.length <= availableLength) {
    return `${fallbackDesc}${priceText}`;
  } else {
    return truncateDescription(fallbackDesc, availableLength) + priceText;
  }
}

// Alternative: Create description without price for meta, include price in other places
function createDescriptionWithoutPrice(product) {
  const maxLength = 155;

  if (product.description) {
    return truncateDescription(product.description, maxLength);
  }

  const fallbackDesc = `Premium quality ${product.name} from our captive breeding program. Available now at Abronia Lizards.`;
  return truncateDescription(fallbackDesc, maxLength);
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }

  const title = `Buy ${product.name} | Abronia Lizards`;

  // Option 1: Include price in description (truncated)
  const descriptionWithPrice = createOptimizedDescription(product);

  // Option 2: Exclude price from meta description (recommended)
  const descriptionWithoutPrice = createDescriptionWithoutPrice(product);

  // Use the version without price for better SEO
  const description = descriptionWithoutPrice;

  const price = `$${product.offerPrice}`;
  const category = product.category;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
    title,
    description, // Clean, optimized description without price
    keywords: `${product.name}, ${category}, abronia lizards, reptile care, captive bred`,
    openGraph: {
      title,
      // For social media, you can include price since length limits are different
      description: `${description} Price: ${price}`,
      type: 'website',
      url: `/product/${resolvedParams.id}`,
      images: product.image && product.image.length > 0 ? [
        {
          url: product.image[0].startsWith('http') 
            ? product.image[0] 
            : `${process.env.NEXT_PUBLIC_SITE_URL}${product.image[0]}`,
          width: 800,
          height: 600,
          alt: product.name,
        }
      ] : undefined,
      siteName: 'Abronia Lizards',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      // Twitter has more lenient description limits
      description: `${description} Price: ${price}`,
      images: product.image && product.image.length > 0 ? [
        product.image[0].startsWith('http') 
          ? product.image[0] 
          : `${process.env.NEXT_PUBLIC_SITE_URL}${product.image[0]}`
      ] : undefined,
    },
    alternates: {
      canonical: `/product/${resolvedParams.id}`,
    },
    // Structured data for price - search engines will pick this up
    other: {
      'product:price:amount': product.offerPrice,
      'product:price:currency': 'USD',
      'product:availability': 'in stock',
      'product:category': category,
    },
    robots: 'index, follow',
  };
}

export const productFaqs = [
  {
    question: 'Are Abronia lizards captive bred?',
    answer: 'Yes, all our Abronia lizards are captive bred in ethical, controlled environments.'
  },
  {
    question: 'What is the shipping process for live reptiles?',
    answer: 'We use overnight, temperature-controlled shipping to ensure the safety and health of your lizard.'
  },
  {
    question: 'Do you provide care instructions?',
    answer: 'Yes, every purchase includes a detailed care guide and ongoing support from our experts.'
  }
];

export default async function ProductLayout({ children, params }) {
  const product = await getProduct(params.id);

  let structuredData = null;
  if (product) {
    structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.image && product.image.length > 0 ? product.image.map(img => img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_SITE_URL}${img}`) : [],
      "description": product.description,
      "sku": product._id,
      "brand": {
        "@type": "Brand",
        "name": "Abronia Lizards"
      },
      "offers": {
        "@type": "Offer",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug || product._id}`,
        "priceCurrency": "USD",
        "price": product.offerPrice,
        "availability": "https://schema.org/InStock"
      },
      "category": product.category
    };
  }

  // FAQPage structured data
  const faqStructuredData = productFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": productFaqs.map(faq => ({
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
      {productFaqs.length > 0 && (
        <div className="max-w-2xl mx-auto my-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <dl className="space-y-4">
            {productFaqs.map((faq, idx) => (
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