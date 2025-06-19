'use client';
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, X } from 'lucide-react';
import TestimonialCard from '@/components/TestimonialCard';
import TestimonialForm from '@/components/TestimonialForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchTestimonials = async (page = 1, reset = false) => {
        try {
            const response = await fetch(`/api/testimonial/list?page=${page}&limit=6`);
            const data = await response.json();

            if (data.success) {
                if (reset) {
                    setTestimonials(data.testimonials);
                } else {
                    setTestimonials(prev => [...prev, ...data.testimonials]);
                }
                setHasMore(data.pagination.hasMore);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials(1, true);
    }, []);

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            fetchTestimonials(currentPage + 1);
        }
    };

    const handleFormSuccess = (message) => {
        setShowForm(false);
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handleShowForm = () => {
        setShowForm(true);
        setSuccessMessage('');
    };

    if (loading && testimonials.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading testimonials...</p>
                </div>
            </div>
        );
    }

    return ( <>
        <SEO
          title="Testimonials | Abronia Lizards - Real Customer Reviews"
          description="Read real testimonials from reptile enthusiasts who trust Abronia Lizards for healthy, captive-bred lizards and expert support."
          canonical="https://abronializards.com/testimonials"
          url="https://abronializards.com/testimonials"
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
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Star className="text-yellow-300" size={32} />
                            <MessageSquare className="text-white" size={32} />
                            <Star className="text-yellow-300" size={32} />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            What Our Community Says
                        </h1>
                        <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                            Real experiences from real reptile enthusiasts who trust our platform for their exotic pet needs.
                        </p>
                        <button
                            onClick={handleShowForm}
                            className="inline-flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg"
                        >
                            <Plus size={20} />
                            <span>Share Your Experience</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Star className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    {successMessage}
                                </p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setSuccessMessage('')}
                                    className="text-green-400 hover:text-green-600"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Testimonial Form */}
                {showForm && (
                    <div className="mb-12">
                        <TestimonialForm
                            onSuccess={handleFormSuccess}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}

                {/* Testimonials Grid */}
                {testimonials.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {testimonials.map((testimonial) => (
                                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="text-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            <span>Load More Testimonials</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No testimonials yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Be the first to share your experience with our community!
                        </p>
                        <button
                            onClick={handleShowForm}
                            className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Leave a Testimonial</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
        <Footer />
        </>
    );
};

export default TestimonialsPage;
