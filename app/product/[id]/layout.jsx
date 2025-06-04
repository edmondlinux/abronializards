
import { notFound } from 'next/navigation';



async function getProduct(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ;

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

  return {
    metadataBase: new URL(process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
      : 'http://localhost:3000'),
    title,
    description,
    keywords: `${product.name}, ${category}, abronia lizards, reptile care, captive bred`,
    openGraph: {
      title,
      description: `${description} Price: ${price}`,
      type: 'website',
      url: `/product/${resolvedParams.id}`,
      images: product.image && product.image.length > 0 ? [
        {
          url: product.image[0].startsWith('http') 
            ? product.image[0] 
            : `${process.env.NODE_ENV === 'production' 
                ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
                : 'https://ec59118c-b0dd-400e-a54a-91862eb953e6-00-1tpzcvwzak64a.kirk.replit.dev'}${product.image[0]}`,
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
      images: product.image && product.image.length > 0 ? [
        product.image[0].startsWith('http') 
          ? product.image[0] 
          : `${process.env.NODE_ENV === 'production' 
              ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
              : 'http://localhost:3000'}${product.image[0]}`
      ] : undefined,
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
