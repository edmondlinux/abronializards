'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import HomeTestimonials from "@/components/HomeTestimonials";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from '@/components/SEO';

const Home = () => {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Abronia Lizards",
    "url": "https://abronializards.com/",
    "logo": "https://ik.imagekit.io/14iir4o77/IMG_9610.png?updatedAt=1748940318208",
    "contactPoint": [{
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@abronializards.com"
    }],
    "sameAs": [
      "https://www.facebook.com/abronializards",
      "https://www.instagram.com/abronializards"
    ]
  };

  return (
    <>
      <SEO
        title="Abronia Lizards | Captive-Bred Graminea, Taeniata & More — Expert Care & Supplies"
        description="Shop premium captive-bred Abronia lizards including Graminea, Taeniata, and Mixteca. Trusted breeders with expert care guides, terrarium setup tips, and top reptile supplies. Safe shipping. Healthy lizards guaranteed."
        canonical="https://abronializards.com/"
        url="https://abronializards.com/"
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
        jsonLd={organizationJsonLd}
      />
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <HomeTestimonials />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;