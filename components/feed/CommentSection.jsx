"use client";
import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Heart, Reply, Send, X } from "lucide-react";

const CommentSection = ({ postId, onCommentAdded }) => {
    const { user, isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState(new Set());

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/feed/comments?postId=${postId}`);
            const data = await response.json();

            if (data.success) {
                setComments(data.comments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReplies = async (commentId) => {
        try {
            const response = await fetch(
                `/api/feed/comments?postId=${postId}&parentId=${commentId}`,
            );
            const data = await response.json();

            if (data.success) {
                setComments((prev) => [
                    ...prev.filter((c) => c.parentId !== commentId),
                    ...data.comments,
                ]);
                setExpandedReplies((prev) => new Set([...prev, commentId]));
            }
        } catch (error) {
            console.error("Error fetching replies:", error);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }

        if (!newComment.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/feed/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: newComment.trim(),
                    postId,
                    author: {
                        userId: user.id,
                        name: user.fullName || user.firstName || "Anonymous",
                        imageUrl: user.imageUrl,
                    },
                }),
            });

            const data = await response.json();

            if (data.success) {
                setComments((prev) => [...prev, data.comment]);
                setNewComment("");
                if (onCommentAdded) {
                    onCommentAdded();
                }
            }
        } catch (error) {
            console.error("Error creating comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitReply = async (e, parentCommentId) => {
        e.preventDefault();

        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }

        if (!replyContent.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/feed/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: replyContent.trim(),
                    postId,
                    parentId: parentCommentId,
                    author: {
                        userId: user.id,
                        name: user.fullName || user.firstName || "Anonymous",
                        imageUrl: user.imageUrl,
                    },
                }),
            });

            const data = await response.json();

            if (data.success) {
                setComments((prev) => [...prev, data.comment]);
                setReplyContent("");
                setReplyingTo(null);
                setExpandedReplies(
                    (prev) => new Set([...prev, parentCommentId]),
                );
            }
        } catch (error) {
            console.error("Error creating reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }

        try {
            const response = await fetch(
                `/api/feed/comments/${commentId}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const data = await response.json();

            if (data.success) {
                setComments((prev) =>
                    prev.map((comment) =>
                        comment._id === commentId
                            ? {
                                  ...comment,
                                  likes: data.likes,
                                  likedBy: data.hasLiked
                                      ? [...(comment.likedBy || []), user.id]
                                      : (comment.likedBy || []).filter(
                                            (id) => id !== user.id,
                                        ),
                              }
                            : comment,
                    ),
                );
            }
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return "Just now";
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    const topLevelComments = comments.filter((comment) => !comment.parentId);
    const getReplies = (commentId) =>
        comments.filter((comment) => comment.parentId === commentId);

    const handleCloseModal = () => {
        setShowLoginModal(false);
    };

    const handleLogin = () => {
        openSignIn();
        setShowLoginModal(false);
    };

    return (
        <div className="p-4">
            {/* Add Comment Form */}
            {isSignedIn ? (
                <form onSubmit={handleSubmitComment} className="mb-4">
                    <div className="flex items-start space-x-3">
                        <img
                            src={user.imageUrl}
                            alt={user.fullName || "User"}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                rows="2"
                                disabled={isSubmitting}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={
                                        !newComment.trim() || isSubmitting
                                    }
                                    className="flex items-center space-x-1 bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    <Send size={14} />
                                    <span>
                                        {isSubmitting
                                            ? "Posting..."
                                            : "Comment"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600 text-sm mb-2">
                        Login to join the conversation
                    </p>
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                        Sign In
                    </button>
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="text-center text-gray-500 py-4">
                    Loading comments...
                </div>
            ) : (
                <div className="space-y-4">
                    {topLevelComments.map((comment) => (
                        <div key={comment._id} className="space-y-2">
                            {/* Main Comment */}
                            <div className="flex items-start space-x-3">
                                <img
                                    src={comment.author.imageUrl}
                                    alt={comment.author.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-medium text-sm">
                                                {comment.author.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800">
                                            {comment.content}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4 mt-2">
                                        <button
                                            onClick={() =>
                                                handleLikeComment(comment._id)
                                            }
                                            className={`flex items-center space-x-1 text-xs ${
                                                comment.likedBy?.includes(
                                                    user?.id,
                                                )
                                                    ? "text-red-600"
                                                    : "text-gray-500 hover:text-red-600"
                                            } transition-colors`}
                                        >
                                            <Heart
                                                size={14}
                                                className={
                                                    comment.likedBy?.includes(
                                                        user?.id,
                                                    )
                                                        ? "fill-current"
                                                        : ""
                                                }
                                            />
                                            <span>{comment.likes || 0}</span>
                                        </button>

                                        <button
                                            onClick={() =>
                                                setReplyingTo(
                                                    replyingTo === comment._id
                                                        ? null
                                                        : comment._id,
                                                )
                                            }
                                            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                                        >
                                            <Reply size={14} />
                                            <span>Reply</span>
                                        </button>

                                        {comment.replyCount > 0 &&
                                            !expandedReplies.has(
                                                comment._id,
                                            ) && (
                                                <button
                                                    onClick={() =>
                                                        fetchReplies(
                                                            comment._id,
                                                        )
                                                    }
                                                    className="text-xs text-blue-600 hover:text-blue-700"
                                                >
                                                    View {comment.replyCount}{" "}
                                                    {comment.replyCount === 1
                                                        ? "reply"
                                                        : "replies"}
                                                </button>
                                            )}
                                    </div>

                                    {/* Reply Form */}
                                    {replyingTo === comment._id && (
                                        <form
                                            onSubmit={(e) =>
                                                handleSubmitReply(
                                                    e,
                                                    comment._id,
                                                )
                                            }
                                            className="mt-3"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <img
                                                    src={user?.imageUrl}
                                                    alt={
                                                        user?.fullName || "User"
                                                    }
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                                <div className="flex-1">
                                                    <textarea
                                                        value={replyContent}
                                                        onChange={(e) =>
                                                            setReplyContent(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={`Reply to ${comment.author.name}...`}
                                                        className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                        rows="2"
                                                        disabled={isSubmitting}
                                                    />
                                                    <div className="flex justify-end mt-2 space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setReplyingTo(
                                                                    null,
                                                                );
                                                                setReplyContent(
                                                                    "",
                                                                );
                                                            }}
                                                            className="text-xs text-gray-500 hover:text-gray-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                !replyContent.trim() ||
                                                                isSubmitting
                                                            }
                                                            className="flex items-center space-x-1 bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <Send size={12} />
                                                            <span>
                                                                {isSubmitting
                                                                    ? "Posting..."
                                                                    : "Reply"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Replies */}
                            {expandedReplies.has(comment._id) && (
                                <div className="ml-8 space-y-2">
                                    {getReplies(comment._id).map((reply) => (
                                        <div
                                            key={reply._id}
                                            className="flex items-start space-x-3"
                                        >
                                            <img
                                                src={reply.author.imageUrl}
                                                alt={reply.author.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="bg-gray-50 rounded-lg p-2">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="font-medium text-xs">
                                                            {reply.author.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {formatDate(
                                                                reply.createdAt,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-800">
                                                        {reply.content}
                                                    </p>
                                                </div>

                                                <div className="flex items-center space-x-4 mt-1">
                                                    <button
                                                        onClick={() =>
                                                            handleLikeComment(
                                                                reply._id,
                                                            )
                                                        }
                                                        className={`flex items-center space-x-1 text-xs ${
                                                            reply.likedBy?.includes(
                                                                user?.id,
                                                            )
                                                                ? "text-red-600"
                                                                : "text-gray-500 hover:text-red-600"
                                                        } transition-colors`}
                                                    >
                                                        <Heart
                                                            size={12}
                                                            className={
                                                                reply.likedBy?.includes(
                                                                    user?.id,
                                                                )
                                                                    ? "fill-current"
                                                                    : ""
                                                            }
                                                        />
                                                        <span>
                                                            {reply.likes || 0}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
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
                                <MessageCircle
                                    className="mx-auto text-orange-500 mb-2"
                                    size={48}
                                />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Join the conversation
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    You need to login or create an account to
                                    comment and interact.
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

export default CommentSection;
