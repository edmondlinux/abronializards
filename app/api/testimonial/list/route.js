
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Testimonial from "@/models/Testimonial";

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const testimonials = await Testimonial.find({ isApproved: true })
            .sort({ approvedAt: -1, submittedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Testimonial.countDocuments({ isApproved: true });

        return NextResponse.json({
            success: true,
            testimonials,
            pagination: {
                page,
                limit,
                total,
                hasMore: skip + testimonials.length < total
            }
        });

    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch testimonials"
        }, { status: 500 });
    }
}
