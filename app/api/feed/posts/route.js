import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Post from "@/models/Post";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            posts,
            page,
            hasMore: posts.length === limit,
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch posts" },
            { status: 500 },
        );
    }
}

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 },
            );
        }

        await connectDB();

        const { content, image, author } = await request.json();

        if (!content || !content.trim()) {
            return NextResponse.json(
                { success: false, message: "Content is required" },
                { status: 400 },
            );
        }

        if (!author || !author.userId || !author.name || !author.imageUrl) {
            return NextResponse.json(
                { success: false, message: "Author information is required" },
                { status: 400 },
            );
        }

        // Verify the user is creating their own post
        if (author.userId !== userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 403 },
            );
        }

        const newPost = new Post({
            content: content.trim(),
            image: image || "",
            author: {
                userId: author.userId,
                name: author.name,
                imageUrl: author.imageUrl,
            },
        });

        const savedPost = await newPost.save();

        return NextResponse.json({
            success: true,
            post: savedPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create post" },
            { status: 500 },
        );
    }
}
