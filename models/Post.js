import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: "",
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
        commentCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

// Index for better performance
PostSchema.index({ createdAt: -1 });
PostSchema.index({ "author.userId": 1 });

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;
