'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import SEO from '@/components/SEO';

const AllProducts = () => {

    const { products } = useAppContext();

    return (
        <>
            <SEO
              title="All Products | Abronia Lizards - Captive-Bred Reptiles for Sale"
              description="Browse all available captive-bred Abronia lizards. Healthy, ethically bred reptiles with expert care and safe shipping."
              canonical="https://abronializards.com/all-products"
              url="https://abronializards.com/all-products"
              image="https://ik.imagekit.io/14iir4o77/IMG_9610.png?updatedAt=1748940318208"
              openGraph={{
                type: 'website',
                siteName: 'Abronia Lizards',
              }}
              twitter={{
                card: 'summary_large_image',
                site: '@abronializards',
                creator: '@abronializards',
              }}
            />
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {products.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
