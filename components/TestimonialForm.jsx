
'use client';
import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { X, Star, Send } from 'lucide-react';

const TestimonialForm = ({ onSuccess, onCancel }) => {
    const { user, isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }

        if (!message.trim() || message.length > 500) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/testimonial/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.trim(),
                    userName: user.fullName || user.firstName || 'Anonymous',
                    userImage: user.imageUrl || ''
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('');
                onSuccess?.(data.message);
            } else {
                alert(data.message || 'Failed to submit testimonial');
            }
        } catch (error) {
            console.error('Error submitting testimonial:', error);
            alert('Failed to submit testimonial. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
    };

    const handleLogin = () => {
        openSignIn();
        setShowLoginModal(false);
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Share Your Experience</h3>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Testimonial
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your experience with our platform..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                        rows={4}
                        maxLength={500}
                        required
                        aria-describedby="message-help"
                    />
                    <p id="message-help" className="mt-1 text-xs text-gray-500">
                        {message.length}/500 characters
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className="fill-current" />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">We appreciate your feedback!</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !message.trim() || message.length > 500}
                        className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit Testimonial'}</span>
                    </button>
                </div>
            </form>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-end mb-4">
                            <button 
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="text-center">
                            <div className="mb-4">
                                <Star className="mx-auto text-orange-500 mb-2" size={48} />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Share Your Testimonial
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    You need to login or create an account to leave a testimonial.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleLogin}
                                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                                >
                                    Login / Create Account
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialForm;
