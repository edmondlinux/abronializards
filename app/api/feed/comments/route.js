import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("postId");
        const parentId = searchParams.get("parentId");

        if (!postId) {
            return NextResponse.json(
                { success: false, message: "Post ID is required" },
                { status: 400 },
            );
        }

        let query = { postId };
        if (parentId) {
            query.parentId = parentId;
        } else {
            query.parentId = null;
        }

        const comments = await Comment.find(query)
            .sort({ createdAt: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            comments,
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch comments" },
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

        const { content, postId, parentId, author } = await request.json();

        if (!content || !content.trim()) {
            return NextResponse.json(
                { success: false, message: "Content is required" },
                { status: 400 },
            );
        }

        if (!postId) {
            return NextResponse.json(
                { success: false, message: "Post ID is required" },
                { status: 400 },
            );
        }

        if (!author || !author.userId || !author.name || !author.imageUrl) {
            return NextResponse.json(
                { success: false, message: "Author information is required" },
                { status: 400 },
            );
        }

        // Verify the user is creating their own comment
        if (author.userId !== userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 403 },
            );
        }

        // Verify the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 },
            );
        }

        // If it's a reply, verify the parent comment exists
        if (parentId) {
            const parentComment = await Comment.findById(parentId);
            if (!parentComment) {
                return NextResponse.json(
                    { success: false, message: "Parent comment not found" },
                    { status: 404 },
                );
            }
        }

        const newComment = new Comment({
            content: content.trim(),
            postId,
            parentId: parentId || null,
            author: {
                userId: author.userId,
                name: author.name,
                imageUrl: author.imageUrl,
            },
        });

        const savedComment = await newComment.save();

        // Update comment count
        if (parentId) {
            await Comment.findByIdAndUpdate(parentId, {
                $inc: { replyCount: 1 },
            });
        } else {
            await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
        }

        return NextResponse.json({
            success: true,
            comment: savedComment,
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create comment" },
            { status: 500 },
        );
    }
}
