import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        author: {
            userId: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            imageUrl: {
                type: String,
                required: true,
            },
        },
        likes: {
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: String,
            },
        ],
        replyCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

// Index for better performance
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1, createdAt: 1 });

const Comment =
    mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;
