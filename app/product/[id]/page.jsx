import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Loading from "@/components/Loading";
import React from "react";
import ProductReviews from "@/components/ProductReviews";
import ProductClient from "./ProductClient";
import SEO from '@/components/SEO';

// Generate static params for better performance
export async function generateStaticParams() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
                       (process.env.NODE_ENV === 'production' ? 'https://abronializards.com' : 'http://0.0.0.0:3000');

        const response = await fetch(`${baseUrl}/api/product/list`);
        
        if (!response.ok) {
            console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
            return [];
        }
        
        const data = await response.json();

        if (data.success) {
            return data.products.map((product) => ({
                id: product.slug,
            }));
        }
    } catch (error) {
        console.error("Error generating static params:", error);
    }

    return [];
}

// Server-side data fetching
async function getProduct(id) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
                       (process.env.NODE_ENV === 'production' ? 'https://abronializards.com' : 'http://0.0.0.0:3000');

        const response = await fetch(`${baseUrl}/api/product/${id}`, {
            cache: 'force-cache' // Enable caching for better performance
        });
        const data = await response.json();
        if (data.success) {
            return data.product;
        }
    } catch (error) {
        console.error("Error fetching product:", error);
    }
    return null;
}

async function getProducts() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
                       (process.env.NODE_ENV === 'production' ? 'https://abronializards.com' : 'http://0.0.0.0:3000');

        const response = await fetch(`${baseUrl}/api/product/list`, {
            cache: 'force-cache'
        });
        const data = await response.json();
        if (data.success) {
            return data.products;
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
    return [];
}

const Product = async ({ params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const productData = await getProduct(id);
    const products = await getProducts();

    if (!productData) {
        return (
            <>
                <SEO
                  title="Product Not Found | Abronia Lizards"
                  description="Sorry, this product could not be found. Browse our healthy captive-bred Abronia lizards and supplies."
                  canonical={`https://abronializards.com/product/${id}`}
                  url={`https://abronializards.com/product/${id}`}
                />
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-xl text-gray-500">Product not found</p>
                </div>
                <Footer />
            </>
        );
    }

    // SEO values
    const productUrl = `https://abronializards.com/product/${productData.slug || id}`;
    const productImage = productData.images && productData.images.length > 0 ? productData.images[0] : 'https://abronializards.com/default-product-image.png';
    const productTitle = `${productData.name} | Abronia Lizards`;
    const productDescription = productData.description || 'Healthy captive-bred Abronia lizards for sale. Expert care, safe shipping, and guaranteed health.';
    const productJsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productData.name,
      "image": productData.images || [productImage],
      "description": productDescription,
      "sku": productData.sku || productData._id,
      "mpn": productData._id,
      "brand": {
        "@type": "Brand",
        "name": "Abronia Lizards"
      },
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "USD",
        "price": productData.price || '0.00',
        "availability": productData.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    };

    return (
        <>
            <SEO
              title={productTitle}
              description={productDescription}
              canonical={productUrl}
              url={productUrl}
              image={productImage}
              openGraph={{
                type: 'product',
                siteName: 'Abronia Lizards',
              }}
              twitter={{
                card: 'summary_large_image',
                site: '@abronializards',
                creator: '@abronializards',
              }}
              jsonLd={productJsonLd}
            />
            <Navbar />
            <ProductClient productData={productData} products={products} />
            <Footer />
        </>
    );
};

export default Product;