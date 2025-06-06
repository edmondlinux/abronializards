
'use client';
import React, { useState, useEffect } from 'react';
import { MessageSquare, Check, X, Clock, Eye, Search } from 'lucide-react';

const TestimonialsAdmin = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [processing, setProcessing] = useState({});

    const fetchTestimonials = async (status = 'pending', page = 1, reset = false) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/testimonial/admin?status=${status}&page=${page}&limit=10`);
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
        fetchTestimonials(filter, 1, true);
    }, [filter]);

    const handleAction = async (testimonialId, action) => {
        setProcessing(prev => ({ ...prev, [testimonialId]: true }));

        try {
            const response = await fetch('/api/testimonial/admin', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testimonialId,
                    action
                })
            });

            const data = await response.json();

            if (data.success) {
                // Remove testimonial from current list
                setTestimonials(prev => prev.filter(t => t._id !== testimonialId));

                // Show success message
                const actionText = action === 'approve' ? 'approved' : 'rejected';
                alert(`Testimonial ${actionText} successfully!`);
            } else {
                alert(data.message || `Failed to ${action} testimonial`);
            }
        } catch (error) {
            console.error(`Error ${action}ing testimonial:`, error);
            alert(`Failed to ${action} testimonial`);
        } finally {
            setProcessing(prev => ({ ...prev, [testimonialId]: false }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            fetchTestimonials(filter, currentPage + 1);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Testimonials Management
                </h1>
                <p className="text-gray-600">
                    Review and manage customer testimonials
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setFilter('pending')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                filter === 'pending'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Clock className="inline-block w-4 h-4 mr-2" />
                            Pending Review
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                filter === 'approved'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Check className="inline-block w-4 h-4 mr-2" />
                            Approved
                        </button>
                    </nav>
                </div>
            </div>

            {/* Testimonials List */}
            {loading && testimonials.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <span className="ml-2 text-gray-600">Loading testimonials...</span>
                </div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {filter} testimonials
                    </h3>
                    <p className="text-gray-500">
                        {filter === 'pending' 
                            ? 'All testimonials have been reviewed.' 
                            : 'No approved testimonials yet.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial._id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            {/* Testimonial Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        {testimonial.userImage ? (
                                            <img
                                                src={testimonial.userImage}
                                                alt={testimonial.userName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                <span className="text-orange-600 font-medium">
                                                    {testimonial.userName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">
                                            {testimonial.userName}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            Submitted: {formatDate(testimonial.submittedAt)}
                                        </p>
                                        {testimonial.approvedAt && (
                                            <p className="text-xs text-green-600">
                                                Approved: {formatDate(testimonial.approvedAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {filter === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAction(testimonial._id, 'approve')}
                                                disabled={processing[testimonial._id]}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                            >
                                                {processing[testimonial._id] ? (
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                                ) : (
                                                    <Check className="w-3 h-3 mr-1" />
                                                )}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(testimonial._id, 'reject')}
                                                disabled={processing[testimonial._id]}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                            >
                                                {processing[testimonial._id] ? (
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                                ) : (
                                                    <X className="w-3 h-3 mr-1" />
                                                )}
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {filter === 'approved' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <Check className="w-3 h-3 mr-1" />
                                            Approved
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Testimonial Message */}
                            <blockquote className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
                                "{testimonial.message}"
                            </blockquote>
                        </div>
                    ))}

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="text-center pt-6">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Loading...
                                    </>
                                ) : (
                                    'Load More'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestimonialsAdmin;
