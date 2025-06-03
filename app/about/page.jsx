import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assets } from "@/assets/assets";
import Image from "next/image";

export const metadata = {
  title: "About Us | Abronia Lizards - Expert Reptile Breeders",
  description:
    "Learn about our passion for Abronia lizards and commitment to responsible breeding. Discover our story, expertise, and dedication to arboreal reptile conservation.",
  keywords:
    "about abronia lizards, reptile breeders, abronia experts, lizard conservation, captive breeding program",
};

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        {/* Hero Section */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                About <span className="text-emerald-600">Abronia Lizards</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Passionate breeders dedicated to the conservation and
                responsible propagation of magnificent Abronia species through
                expert care and ethical practices.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Our Story Section */}
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded by passionate herpetologists with over 15 years of
                    experience in reptile care and breeding, Abronia Lizards
                    began as a dedication to preserving these magnificent
                    arboreal species through responsible captive breeding
                    programs.
                  </p>
                  <p>
                    What started as a personal fascination with the unique
                    beauty and behavior of Abronia species has evolved into a
                    comprehensive breeding facility focused on producing
                    healthy, genetically diverse lizards while educating
                    enthusiasts about proper care techniques.
                  </p>
                  <p>
                    Our commitment extends beyond breeding – we're dedicated to
                    conservation efforts, research collaboration, and ensuring
                    that each Abronia lizard finds a knowledgeable, caring home
                    where it can thrive for years to come.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <Image
                  src={assets.abronia_graminea_habitat_image}
                  alt="Abronia Graminea"
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <p className="text-sm text-gray-500 italic text-center">
                    Abronia graminea - One of our featured breeding species
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission Section */}
          <div className="mb-20">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Our Mission
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🦎</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Conservation
                  </h3>
                  <p className="text-gray-600">
                    Preserving Abronia species through ethical captive breeding
                    programs that maintain genetic diversity and reduce wild
                    collection pressure.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Education
                  </h3>
                  <p className="text-gray-600">
                    Providing comprehensive care guides, species information,
                    and ongoing support to ensure successful keeping of these
                    specialized reptiles.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Passion
                  </h3>
                  <p className="text-gray-600">
                    Sharing our love and expertise for these incredible arboreal
                    lizards with fellow enthusiasts and newcomers alike.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Sets Us Apart */}
          <div className="mb-20">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                What Sets Us Apart
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Captive-Bred Excellence
                      </h4>
                      <p className="text-gray-600 text-sm">
                        All our lizards are responsibly captive-bred, ensuring
                        better health, temperament, and adaptation to captive
                        environments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Expert Care Protocols
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Years of experience have refined our husbandry
                        techniques to optimize health, breeding success, and
                        longevity.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Genetic Diversity
                      </h4>
                      <p className="text-gray-600 text-sm">
                        We maintain multiple breeding lines to ensure genetic
                        health and vigor in our offspring.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Comprehensive Support
                      </h4>
                      <p className="text-gray-600 text-sm">
                        From pre-purchase consultation to ongoing care advice,
                        we're committed to your success as an Abronia keeper.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Safe Shipping
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Professional packaging and trusted shipping partners
                        ensure your new companion arrives safely.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Species Specialization
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Our exclusive focus on Abronia species allows us to
                        provide unmatched expertise and care standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Species We Work With */}
          <div className="mb-20">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Species We Specialize In
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                    Abronia graminea
                  </h3>
                  <p className="text-emerald-700 text-sm">
                    The stunning Mexican Alligator Lizard, known for its vibrant
                    green coloration and docile temperament.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Abronia taeniata
                  </h3>
                  <p className="text-blue-700 text-sm">
                    A beautiful species with distinctive banding patterns and
                    excellent adaptability to captive conditions.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    Abronia mixteca
                  </h3>
                  <p className="text-purple-700 text-sm">
                    A rare and coveted species that we're proud to work with in
                    our conservation breeding programs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Whether you're a seasoned keeper or new to Abronia lizards, we're
              here to support your journey with these incredible reptiles. Let's
              work together to ensure these amazing species thrive for
              generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/all-products"
                className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                View Our Lizards
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300 hover:scale-105"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
