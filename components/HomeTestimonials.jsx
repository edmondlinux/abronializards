
'use client';
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import TestimonialCard from '@/components/TestimonialCard';
import Link from 'next/link';

const HomeTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch('/api/testimonial/list?page=1&limit=6');
                const data = await response.json();

                if (data.success) {
                    setTestimonials(data.testimonials);
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => 
            prev === testimonials.length - 1 ? 0 : prev + 1
        );
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => 
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    };

    if (loading || testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Star className="text-orange-500" size={28} />
                        <MessageSquare className="text-orange-600" size={28} />
                        <Star className="text-orange-500" size={28} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Community Says
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        Real experiences from reptile enthusiasts who trust our platform for their exotic pet needs.
                    </p>
                </div>

                {/* Desktop: Grid View */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {testimonials.slice(0, 3).map((testimonial) => (
                        <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                    ))}
                </div>

                {/* Mobile: Carousel View */}
                <div className="md:hidden">
                    <div className="relative">
                        <div className="overflow-hidden">
                            <div 
                                className="flex transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {testimonials.map((testimonial) => (
                                    <div key={testimonial._id} className="w-full flex-shrink-0 px-2">
                                        <TestimonialCard testimonial={testimonial} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        {testimonials.length > 1 && (
                            <>
                                <button
                                    onClick={prevTestimonial}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                                    aria-label="Previous testimonial"
                                >
                                    <ChevronLeft size={20} className="text-gray-600" />
                                </button>
                                <button
                                    onClick={nextTestimonial}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                                    aria-label="Next testimonial"
                                >
                                    <ChevronRight size={20} className="text-gray-600" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Dots Indicator */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center space-x-2 mt-6">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentIndex ? 'bg-orange-600' : 'bg-gray-300'
                                    }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <Link 
                        href="/testimonials"
                        className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg"
                    >
                        <MessageSquare size={20} />
                        <span>View All Testimonials</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeTestimonials;
