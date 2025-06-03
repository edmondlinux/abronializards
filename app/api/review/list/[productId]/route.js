
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import Review from "@/models/Review";

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { productId } = await params;

        if (!productId) {
            return NextResponse.json({
                success: false,
                message: "Product ID is required"
            }, { status: 400 });
        }

        const reviews = await Review.find({ productId })
            .sort({ date: -1 });

        return NextResponse.json({
            success: true,
            reviews: reviews
        });

    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}
