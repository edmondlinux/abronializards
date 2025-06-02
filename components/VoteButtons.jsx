
import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';

const VoteButtons = ({ blogId, initialUpvotes = 0, initialDownvotes = 0, initialUserVote = null }) => {
    const { isSignedIn, user } = useUser();
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [userVote, setUserVote] = useState(initialUserVote);
    const [loading, setLoading] = useState(false);
    const [showSignInPrompt, setShowSignInPrompt] = useState(false);

    const handleVote = async (voteType) => {
        if (!isSignedIn) {
            setShowSignInPrompt(true);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/blog/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    blogId,
                    voteType,
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
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            {/* Upvote Button */}
            <button
                onClick={() => handleVote('upvote')}
                disabled={loading}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    userVote === 'upvote'
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                        : 'bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 border-2 border-transparent'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
                <svg 
                    className={`w-5 h-5 ${userVote === 'upvote' ? 'fill-current' : 'stroke-current fill-none'}`}
                    viewBox="0 0 24 24" 
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 13l3-3 3 3m0 0l3-3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16" />
                </svg>
                <span className="font-medium">{upvotes}</span>
            </button>

            {/* Downvote Button */}
            <button
                onClick={() => handleVote('downvote')}
                disabled={loading}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    userVote === 'downvote'
                        ? 'bg-red-100 text-red-700 border-2 border-red-300'
                        : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border-2 border-transparent'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
                <svg 
                    className={`w-5 h-5 ${userVote === 'downvote' ? 'fill-current' : 'stroke-current fill-none'}`}
                    viewBox="0 0 24 24" 
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 11l-3 3-3-3m0 0l-3 3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4" />
                </svg>
                <span className="font-medium">{downvotes}</span>
            </button>

            {/* Sign In Prompt Modal */}
            {showSignInPrompt && !isSignedIn && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Sign in to vote
                        </h3>
                        <p className="text-gray-600 mb-4">
                            You need to be signed in to vote on blog posts.
                        </p>
                        <div className="flex space-x-3">
                            <SignInButton mode="modal">
                                <button className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                            <button
                                onClick={() => setShowSignInPrompt(false)}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoteButtons;
