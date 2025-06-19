
'use client';
import React from 'react';
import { Star, User } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Header with user info */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                    {testimonial.userImage ? (
                        <img
                            src={testimonial.userImage}
                            alt={testimonial.userName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <User size={24} className="text-orange-600" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {testimonial.userName}
                    </h4>
                    <p className="text-xs text-gray-500">
                        {formatDate(testimonial.submittedAt)}
                    </p>
                </div>
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-400 fill-current" />
                    ))}
                </div>
            </div>

            {/* Testimonial message */}
            <blockquote className="text-gray-700 text-sm leading-relaxed">
                "{testimonial.message}"
            </blockquote>

            {/* Optional: Verified badge */}
            <div className="mt-4 flex items-center justify-end">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Verified Customer
                </span>
            </div>
        </div>
    );
};

export default TestimonialCard;
