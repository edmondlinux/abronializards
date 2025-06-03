import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Post from "@/models/Post";
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

        const { postId } = await params;
        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 },
            );
        }

        const hasLiked = post.likedBy.includes(userId);

        if (hasLiked) {
            // Unlike the post
            post.likedBy = post.likedBy.filter((id) => id !== userId);
            post.likes = Math.max(0, post.likes - 1);
        } else {
            // Like the post
            post.likedBy.push(userId);
            post.likes += 1;
        }

        await post.save();

        return NextResponse.json({
            success: true,
            likes: post.likes,
            hasLiked: !hasLiked,
        });
    } catch (error) {
        console.error("Error toggling post like:", error);
        return NextResponse.json(
            { success: false, message: "Failed to toggle like" },
            { status: 500 },
        );
    }
}
