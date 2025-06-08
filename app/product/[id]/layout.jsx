import { notFound } from 'next/navigation';

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
    }
  };
}

export default function ProductLayout({ children }) {
  return children;
}