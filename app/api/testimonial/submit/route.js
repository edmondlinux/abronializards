
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Testimonial from "@/models/Testimonial";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Authentication required"
            }, { status: 401 });
        }

        await connectDB();

        const { message, userName, userImage } = await request.json();

        if (!message || !userName) {
            return NextResponse.json({
                success: false,
                message: "Message and user name are required"
            }, { status: 400 });
        }

        if (message.length > 500) {
            return NextResponse.json({
                success: false,
                message: "Message must be 500 characters or less"
            }, { status: 400 });
        }

        // Check if user has already submitted a testimonial
        const existingTestimonial = await Testimonial.findOne({ userId });

        if (existingTestimonial) {
            return NextResponse.json({
                success: false,
                message: "You have already submitted a testimonial"
            }, { status: 400 });
        }

        const newTestimonial = new Testimonial({
            userId,
            userName,
            userImage: userImage || '',
            message: message.trim()
        });

        const savedTestimonial = await newTestimonial.save();

        return NextResponse.json({
            success: true,
            message: "Testimonial submitted successfully and is pending approval",
            testimonial: savedTestimonial
        });

    } catch (error) {
        console.error("Error submitting testimonial:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to submit testimonial"
        }, { status: 500 });
    }
}
