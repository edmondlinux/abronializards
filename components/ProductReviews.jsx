"use client";
import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Star, X, MessageCircle } from "lucide-react";
import Image from "next/image";

const ProductReviews = ({ productId }) => {
    const { user, isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/review/list/${productId}`);
            const data = await response.json();

            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddReview = () => {
        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }
        setShowReviewForm(true);
    };

    const handleSubmitReview = async () => {
        if (!comment.trim()) {
            alert("Please write a review comment");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/review/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment: comment.trim(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                setShowReviewForm(false);
                setComment("");
                setRating(5);
                fetchReviews(); // Refresh reviews
                alert("Review added successfully!");
            } else {
                alert(data.message || "Failed to add review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to add review");
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

    const renderStars = (
        rating,
        interactive = false,
        onRatingChange = null,
    ) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
                        onClick={
                            interactive ? () => onRatingChange(star) : undefined
                        }
                    />
                ))}
            </div>
        );
    };

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
              ).toFixed(1)
            : 0;

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-medium text-gray-800">
                        Customer Reviews
                    </h3>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                            {renderStars(Math.round(averageRating))}
                            <span className="text-sm text-gray-600">
                                {averageRating} out of 5 ({reviews.length}{" "}
                                review{reviews.length !== 1 ? "s" : ""})
                            </span>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleAddReview}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Write a Review
                </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-lg font-medium mb-3">
                        Write Your Review
                    </h4>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating
                        </label>
                        {renderStars(rating, true, setRating)}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Review
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            rows={4}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSubmitReview}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                        <button
                            onClick={() => setShowReviewForm(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                </div>
            ) : reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex items-start gap-3">
                                <Image
                                    src={review.userImage}
                                    alt={review.userName}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h5 className="font-medium text-gray-800">
                                            {review.userName}
                                        </h5>
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {new Date(
                                            review.date,
                                        ).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-700">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <MessageCircle
                        size={48}
                        className="mx-auto mb-2 text-gray-300"
                    />
                    <p>No reviews yet. Be the first to review this product!</p>
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
                                    Write a Review
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    You need to login or create an account to
                                    write a review.
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

export default ProductReviews;
