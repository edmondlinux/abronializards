import { notFound } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

async function getProduct(slug) {
  try {
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

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }

  const title = `${product.name} | Abronia Lizards`;
  const description = product.description || `${product.name} - Premium quality reptile from our captive breeding program.`;
  const price = `$${product.offerPrice}`;
  const category = product.category;

  const imageUrl = product.image && product.image.length > 0
    ? (product.image[0].startsWith('http')
        ? product.image[0]
        : `${baseUrl}${product.image[0]}`
      )
    : undefined;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: `${product.name}, ${category}, abronia lizards, reptile care, captive bred`,
    openGraph: {
      title,
      description: `${description} Price: ${price}`,
      type: 'website',
      url: `/product/${resolvedParams.id}`,
      images: imageUrl ? [
        {
          url: imageUrl,
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
      description: `${description} Price: ${price}`,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `/product/${resolvedParams.id}`,
    },
    other: {
      'product:price:amount': product.offerPrice,
      'product:price:currency': 'USD',
      'product:availability': 'in stock',
      'product:category': category,
    }
  };
}

export default function ProductLayout({ children }) {
  return children;
}