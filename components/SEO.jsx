import Head from 'next/head';
import PropTypes from 'prop-types';

/**
 * SEO component for dynamic meta tags and structured data
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.canonical - Canonical URL
 * @param {string} props.image - Image URL for social sharing
 * @param {string} props.url - Page URL
 * @param {Object} props.openGraph - Open Graph extra fields
 * @param {Object} props.twitter - Twitter Card extra fields
 * @param {Object|Array} props.jsonLd - JSON-LD structured data (object or array)
 */
export default function SEO({
  title,
  description,
  canonical,
  image,
  url,
  openGraph = {},
  twitter = {},
  jsonLd,
}) {
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {/* Open Graph */}
      {url && <meta property="og:url" content={url} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {openGraph.type && <meta property="og:type" content={openGraph.type} />}
      {openGraph.siteName && <meta property="og:site_name" content={openGraph.siteName} />}
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitter.card || 'summary_large_image'} />
      {twitter.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter.creator && <meta name="twitter:creator" content={twitter.creator} />}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonical: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  openGraph: PropTypes.object,
  twitter: PropTypes.object,
  jsonLd: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
}; 