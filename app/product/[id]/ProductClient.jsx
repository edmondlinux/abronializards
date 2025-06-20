"use client";
import { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import ProductReviews from "@/components/ProductReviews";
import Breadcrumbs from '@/components/Breadcrumbs';

const ProductClient = ({ productData, products }) => {
    const { currency, addToCart, router, user } = useAppContext();
    const [mainImage, setMainImage] = useState(productData.image[0]);
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
      // Fetch related blog posts by category
      if (productData.category) {
        fetch(`/api/blog/list?category=${encodeURIComponent(productData.category)}&limit=3`)
          .then(res => res.json())
          .then(data => {
            if (data.success) setRelatedPosts(data.blogPosts);
          });
      }
    }, [productData.category]);

    return (
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            {/* Breadcrumbs */}
            <Breadcrumbs items={[
              { name: 'Home', href: '/' },
              { name: 'Products', href: '/all-products' },
              { name: productData.name, href: `/product/${productData.slug || productData._id}` }
            ]} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src={mainImage}
                            alt={productData.name}
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                            priority
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                            >
                                <Image
                                    src={image}
                                    alt={productData.name}
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Image
                                className="h-4 w-4"
                                src={assets.star_icon}
                                alt="star_icon"
                            />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_icon}
                                alt="star_icon"
                            />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_icon}
                                alt="star_icon"
                            />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_icon}
                                alt="star_icon"
                            />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_dull_icon}
                                alt="star_dull_icon"
                            />
                        </div>
                        <p>(4.5)</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        {currency}
                        {productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            {currency}
                            {productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">
                                        Captive Bred?:
                                    </td>
                                    <td className="text-gray-800/50 ">
                                        yes
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">
                                        Lineage:
                                    </td>
                                    <td className="text-gray-800/50 ">
                                        yes
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">
                                        Category
                                    </td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <button
                            onClick={() => addToCart(productData._id)}
                            className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => {
                                addToCart(productData._id);
                                router.push(user ? "/cart" : "");
                            }}
                            className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Reviews Section */}
            <ProductReviews productId={productData._id} />

            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">
                        Featured{" "}
                        <span className="font-medium text-orange-600">
                            Products
                        </span>
                    </p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {products.slice(0, 5).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>

            {/* Related Blog Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="my-14">
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-medium">Related Blog Posts</p>
                  <div className="w-20 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {relatedPosts.map(post => (
                    <div key={post._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      {post.featuredImage && (
                        <img src={post.featuredImage} alt={post.title} className="w-full h-40 object-cover" />
                      )}
                      <div className="p-4">
                        <p className="font-medium text-lg mb-2">{post.title}</p>
                        <p className="text-sm text-gray-600 mb-3">{post.excerpt || post.description?.slice(0, 80) + '...'}</p>
                        <a href={`/blog/${post.slug}`} className="text-orange-600 hover:underline">Read more →</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
    );
};

export default ProductClient;
