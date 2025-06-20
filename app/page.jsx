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

  const homeFaqs = [
    {
      question: 'What species of Abronia lizards do you offer?',
      answer: 'We offer a variety of captive-bred Abronia species, including Graminea, Taeniata, and Mixteca.'
    },
    {
      question: 'Is shipping safe for live reptiles?',
      answer: 'Yes, we use overnight, temperature-controlled shipping to ensure your lizard arrives healthy and safe.'
    },
    {
      question: 'Do you provide care support after purchase?',
      answer: 'Absolutely! Our team is available for ongoing care advice and support for all customers.'
    }
  ];

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
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": homeFaqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <HomeTestimonials />
        <Banner />
        <NewsLetter />
        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto my-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <dl className="space-y-4">
            {homeFaqs.map((faq, idx) => (
              <div key={idx}>
                <dt className="font-semibold text-gray-800">{faq.question}</dt>
                <dd className="text-gray-600 ml-2">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;