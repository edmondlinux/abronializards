
'use client';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

const FeedClient = () => {
    const { navigate } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async (pageNum = 1, reset = false) => {
        if (pageNum === 1) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const response = await fetch(`/api/feed/posts?page=${pageNum}&limit=10`);
            const data = await response.json();

            if (data.success) {
                if (reset || pageNum === 1) {
                    setPosts(data.posts);
                } else {
                    setPosts(prev => [...prev, ...data.posts]);
                }
                setHasMore(data.hasMore);
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const handleLikeUpdate = (postId, likes, hasLiked) => {
        setPosts(prev => prev.map(post => 
            post._id === postId 
                ? { 
                    ...post, 
                    likes,
                    likedBy: hasLiked 
                        ? [...(post.likedBy || []), 'current-user']
                        : (post.likedBy || []).filter(id => id !== 'current-user')
                }
                : post
        ));
    };

    const loadMore = () => {
        if (hasMore && !isLoadingMore) {
            fetchPosts(page + 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-6">
                <CreatePost onPostCreated={handlePostCreated} />

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                            <p className="text-gray-600 mt-3 text-sm">Loading posts...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {posts.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                                <p className="text-gray-500">Be the first to share something with the community!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {posts.map(post => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onLikeUpdate={handleLikeUpdate}
                                    />
                                ))}

                                {hasMore && (
                                    <div className="flex justify-center py-4">
                                        <button
                                            onClick={loadMore}
                                            disabled={isLoadingMore}
                                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                                                    <span>Loading...</span>
                                                </>
                                            ) : (
                                                <span>Load More</span>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {!hasMore && posts.length > 0 && (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500 text-sm">You've reached the end!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default FeedClient;
