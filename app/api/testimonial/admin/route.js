
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Testimonial from "@/models/Testimonial";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({
                success: false,
                message: "Not authorized"
            }, { status: 403 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "pending";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        const skip = (page - 1) * limit;

        const filter = status === "pending" ? { isApproved: false } : { isApproved: true };

        const testimonials = await Testimonial.find(filter)
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Testimonial.countDocuments(filter);

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
        console.error("Error fetching testimonials for admin:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch testimonials"
        }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({
                success: false,
                message: "Not authorized"
            }, { status: 403 });
        }

        await connectDB();

        const { testimonialId, action } = await request.json();

        if (!testimonialId || !["approve", "reject"].includes(action)) {
            return NextResponse.json({
                success: false,
                message: "Invalid request data"
            }, { status: 400 });
        }

        if (action === "approve") {
            const updatedTestimonial = await Testimonial.findByIdAndUpdate(
                testimonialId,
                {
                    isApproved: true,
                    approvedAt: new Date(),
                    approvedBy: userId
                },
                { new: true }
            );

            if (!updatedTestimonial) {
                return NextResponse.json({
                    success: false,
                    message: "Testimonial not found"
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                message: "Testimonial approved successfully",
                testimonial: updatedTestimonial
            });
        } else {
            // Reject - delete the testimonial
            const deletedTestimonial = await Testimonial.findByIdAndDelete(testimonialId);

            if (!deletedTestimonial) {
                return NextResponse.json({
                    success: false,
                    message: "Testimonial not found"
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                message: "Testimonial rejected and deleted successfully"
            });
        }

    } catch (error) {
        console.error("Error managing testimonial:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to manage testimonial"
        }, { status: 500 });
    }
}
