
'use client';
import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Heart, MessageCircle, Share, MoreHorizontal, X } from 'lucide-react';
import CommentSection from './CommentSection';
import Link from 'next/link';

const PostCard = ({ post, onLikeUpdate }) => {
    const { user, isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [isLiked, setIsLiked] = useState(
        isSignedIn && post.likedBy?.includes(user?.id)
    );
    const [likes, setLikes] = useState(post.likes || 0);
    const [isLiking, setIsLiking] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const MAX_CONTENT_LENGTH = 300;
    const needsExpansion = post.content.length > MAX_CONTENT_LENGTH;
    const displayContent = needsExpansion && !isExpanded 
        ? post.content.substring(0, MAX_CONTENT_LENGTH) + '...'
        : post.content;

    const handleLike = async () => {
        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }

        if (isLiking) return;

        setIsLiking(true);

        try {
            const response = await fetch(`/api/feed/posts/${post._id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                setLikes(data.likes);
                setIsLiked(data.hasLiked);
                if (onLikeUpdate) {
                    onLikeUpdate(post._id, data.likes, data.hasLiked);
                }
            }
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Post by ${post.author.name}`,
                    text: post.content.substring(0, 100),
                    url: `/feed/post/${post._id}`
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(`${window.location.origin}/feed/post/${post._id}`);
        }
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
    };

    const handleLogin = () => {
        openSignIn();
        setShowLoginModal(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours}h`;
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return `${days}d`;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Post Header */}
            <div className="p-4 pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src={post.author.imageUrl}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <h4 className="font-semibold text-gray-900 hover:underline cursor-pointer">
                                {post.author.name}
                            </h4>
                            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal size={20} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
                <div className="text-gray-900 whitespace-pre-wrap">
                    {displayContent}
                    {needsExpansion && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                        >
                            {isExpanded ? 'See less' : (
                                <Link href={`/feed/post/${post._id}`} className="hover:underline">
                                    See more
                                </Link>
                            )}
                        </button>
                    )}
                </div>

                {post.image && (
                    <div className="mt-3">
                        <Link href={`/feed/post/${post._id}`}>
                            <img
                                src={post.image}
                                alt="Post image"
                                className="w-full rounded-lg object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            />
                        </Link>
                    </div>
                )}
            </div>

            {/* Engagement Stats */}
            {(likes > 0 || post.commentCount > 0) && (
                <div className="px-4 py-2 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600">
                        {likes > 0 && (
                            <div className="flex items-center space-x-1">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Heart size={12} className="text-white fill-current" />
                                    </div>
                                </div>
                                <span>{likes}</span>
                            </div>
                        )}
                        {post.commentCount > 0 && (
                            <span>{post.commentCount} comment{post.commentCount !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                </div>
            )}

            {/* Post Actions */}
            <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex justify-between">
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center justify-center space-x-2 flex-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                            isLiked
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:bg-gray-100'
                        } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Heart
                            size={20}
                            className={isLiked ? 'fill-current' : ''}
                        />
                        <span className="font-medium">Like</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center justify-center space-x-2 flex-1 py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <MessageCircle size={20} />
                        <span className="font-medium">Comment</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center space-x-2 flex-1 py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <Share size={20} />
                        <span className="font-medium">Share</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="border-t border-gray-100">
                    <CommentSection 
                        postId={post._id} 
                        onCommentAdded={() => {
                            // Optionally update comment count
                        }}
                    />
                </div>
            )}

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
                                <Heart className="mx-auto text-blue-600 mb-2" size={48} />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Like this post
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    You need to login or create an account to interact with posts.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleLogin}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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

export default PostCard;
