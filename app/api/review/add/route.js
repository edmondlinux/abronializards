import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        await connectDB();

        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not authenticated",
                },
                { status: 401 },
            );
        }

        const { productId, rating, comment } = await request.json();

        if (!productId || !rating || !comment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields",
                },
                { status: 400 },
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Rating must be between 1 and 5",
                },
                { status: 400 },
            );
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 },
            );
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            userId: user.id,
            productId: productId,
        });

        if (existingReview) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You have already reviewed this product",
                },
                { status: 400 },
            );
        }

        const newReview = new Review({
            userId: user.id,
            productId: productId,
            userName: user.firstName + " " + user.lastName,
            userImage: user.imageUrl,
            rating: rating,
            comment: comment,
        });

        await newReview.save();

        return NextResponse.json({
            success: true,
            message: "Review added successfully",
            review: newReview,
        });
    } catch (error) {
        console.error("Error adding review:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 },
        );
    }
}
