'use client';
import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';

const VoteButtons = ({ blogId, initialUpvotes = 0, initialDownvotes = 0, initialUserVote = null }) => {
    const { user, isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [userVote, setUserVote] = useState(initialUserVote);
    const [isLoading, setIsLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Update state when props change (e.g., on page reload)
    useEffect(() => {
        setUpvotes(initialUpvotes);
        setDownvotes(initialDownvotes);
        setUserVote(initialUserVote);
    }, [initialUpvotes, initialDownvotes, initialUserVote]);

    const handleVote = async (voteType) => {
        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }

        if (isLoading) return;

        setIsLoading(true);

        try {
            const response = await fetch('/api/blog/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    blogId,
                    voteType
                }),
            });

            const data = await response.json();

            if (data.success) {
                setUpvotes(data.upvotes);
                setDownvotes(data.downvotes);
                setUserVote(data.userVote);
            } else {
                console.error('Vote failed:', data.message);
            }
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsLoading(false);
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
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600 font-medium">Was this helpful?</span>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Upvote Button */}
                    <button
                        onClick={() => handleVote('upvote')}
                        disabled={isLoading}
                        className={`
                            flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 
                            ${userVote === 'upvote' 
                                ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                            }
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm active:scale-95'}
                        `}
                        title="Mark as helpful"
                    >
                        <ThumbsUp 
                            size={16} 
                            className={`${userVote === 'upvote' ? 'fill-current' : ''}`} 
                        />
                        <span className="text-sm font-medium">{upvotes}</span>
                    </button>

                    {/* Downvote Button */}
                    <button
                        onClick={() => handleVote('downvote')}
                        disabled={isLoading}
                        className={`
                            flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 
                            ${userVote === 'downvote' 
                                ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                            }
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm active:scale-95'}
                        `}
                        title="Mark as not helpful"
                    >
                        <ThumbsDown 
                            size={16} 
                            className={`${userVote === 'downvote' ? 'fill-current' : ''}`} 
                        />
                        <span className="text-sm font-medium">{downvotes}</span>
                    </button>
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        {/* Close button */}
                        <div className="flex justify-end mb-4">
                            <button 
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal content */}
                        <div className="text-center">
                            <div className="mb-4">
                                <ThumbsUp className="mx-auto text-orange-500 mb-2" size={48} />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Vote on this post
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    You need to login or create an account to vote and help the community.
                                </p>
                            </div>

                            {/* Action buttons */}
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

export default VoteButtons;