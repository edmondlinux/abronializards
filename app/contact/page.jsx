
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { assets } from '@/assets/assets';
import Image from 'next/image';

export const metadata = {
  title: "Contact Us | Abronia Lizards - Expert Reptile Support",
  description: "Get in touch with Abronia Lizards for expert advice on care, shipping, and purchasing premium captive-bred arboreal lizards. Professional reptile support team ready to help.",
  keywords: "contact abronia lizards, reptile support, lizard care help, shipping questions, abronia breeder contact",
};

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Contact <span className="text-emerald-600">Us</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions about our Abronia lizards or need expert care advice? 
                We're here to help you every step of the way.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Get In Touch</h2>
                <p className="text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-sm">✉️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email Us</p>
                    <a
                      href="mailto:support@abronializards.com"
                      className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors duration-300"
                    >
                      support@abronializards.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-sm">⏰</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Response Time</p>
                    <p className="text-blue-600 font-semibold">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpful Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-emerald-600 text-sm">🦎</span>
                  </span>
                  What We Can Help With
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    Abronia species selection and availability
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    Care guides and husbandry advice
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    Shipping and delivery questions
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    Terrarium setup recommendations
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    Health and wellness concerns
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    Breeding program information
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">📚</span>
                  </span>
                  Quick Resources
                </h3>
                <div className="space-y-3">
                  <a href="/blog/abronia-care-sheet" className="block p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors duration-300 group">
                    <span className="text-gray-700 group-hover:text-emerald-600 font-medium">Complete Care Guide →</span>
                  </a>
                  <a href="/blog/shipping-and-returns" className="block p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors duration-300 group">
                    <span className="text-gray-700 group-hover:text-emerald-600 font-medium">Shipping Information →</span>
                  </a>
                  <a href="/blog/abronia-species-info" className="block p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors duration-300 group">
                    <span className="text-gray-700 group-hover:text-emerald-600 font-medium">Species Information →</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you ship nationwide?</h4>
                <p className="text-gray-600 text-sm">Yes, we ship healthy Abronia lizards safely across the United States with our trusted shipping partners.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What's included with my purchase?</h4>
                <p className="text-gray-600 text-sm">Each lizard comes with care instructions, feeding guidelines, and ongoing support from our expert team.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Are your lizards captive-bred?</h4>
                <p className="text-gray-600 text-sm">Yes, all our Abronia lizards are responsibly captive-bred in controlled environments for optimal health.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How do I prepare for my new lizard?</h4>
                <p className="text-gray-600 text-sm">We provide detailed setup guides and are always available to help you create the perfect habitat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
