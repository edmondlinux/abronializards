import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Loading from "@/components/Loading";
import React from "react";
import ProductReviews from "@/components/ProductReviews";
import ProductClient from "./ProductClient";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Generate static params for better performance
export async function generateStaticParams() {
    try {
        const response = await fetch(`${baseUrl}/api/product/list`);
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
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-xl text-gray-500">Product not found</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <ProductClient productData={productData} products={products} />
            <Footer />
        </>
    );
};

export default Product;