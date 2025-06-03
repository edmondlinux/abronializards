import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Comment from "@/models/Comment";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request, { params }) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 },
            );
        }

        await connectDB();

        const { commentId } = await params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return NextResponse.json(
                { success: false, message: "Comment not found" },
                { status: 404 },
            );
        }

        const hasLiked = comment.likedBy.includes(userId);

        if (hasLiked) {
            // Unlike the comment
            comment.likedBy = comment.likedBy.filter((id) => id !== userId);
            comment.likes = Math.max(0, comment.likes - 1);
        } else {
            // Like the comment
            comment.likedBy.push(userId);
            comment.likes += 1;
        }

        await comment.save();

        return NextResponse.json({
            success: true,
            likes: comment.likes,
            hasLiked: !hasLiked,
        });
    } catch (error) {
        console.error("Error toggling comment like:", error);
        return NextResponse.json(
            { success: false, message: "Failed to toggle like" },
            { status: 500 },
        );
    }
}
